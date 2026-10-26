"""Pubblica data/<atleta>/ su Firestore (athletes/<atleta>), compresso in gzip.

Uso:  .venv\\Scripts\\python publish.py davide-mariotti           # pubblica
      .venv\\Scripts\\python publish.py --pull davide-mariotti    # riporta in locale quello che è online (per fetch.py)
Credenziali: FIREBASE_SERVICE_ACCOUNT (JSON del service account, in GitHub Actions)
             oppure il file service-account.json accanto a questo script (in locale).
Scrive solo questo script (Admin SDK); le regole Firestore fanno leggere solo gli account autorizzati.
"""

import gzip
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore

ROOT = Path(__file__).parent
CHUNK = 900_000  # un documento Firestore regge al massimo 1 MiB


def json_from_js(path, marker):
    """'window.GARMIN = {...};' oppure '(window.ACT ...)[id] = {...};' -> testo JSON."""
    text = path.read_text(encoding="utf-8")
    return text[text.index(marker) + len(marker):text.rstrip().rindex(";")]


def pull(athlete, doc, base):
    """Riporta in locale quello che è già su Firestore: dati (garmin.js) ed elenco dei dettagli (act/online.txt).
    Serve in GitHub Actions, dove si parte da zero: così fetch.py scarica solo le novità."""
    meta = doc.get()
    (base / "act").mkdir(parents=True, exist_ok=True)
    if meta.exists:
        parts = [doc.collection("blobs").document(f"garmin-{i}").get().get("d") for i in range(meta.get("parts"))]
        (base / "garmin.js").write_text("window.GARMIN = " + gzip.decompress(b"".join(parts)).decode() + ";\n", encoding="utf-8")
    ids = [d.id for d in doc.collection("acts").list_documents()]
    (base / "act" / "online.txt").write_text("\n".join(ids), encoding="utf-8")
    print(f"{athlete}: {'dati ripresi da Firestore' if meta.exists else 'nessun dato su Firestore'}, {len(ids)} dettagli già online")


def main():
    args = sys.argv[1:]
    athlete = next((a for a in args if not a.startswith("--")), "davide-mariotti")
    base = ROOT / "data" / athlete
    sa = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    firebase_admin.initialize_app(credentials.Certificate(json.loads(sa) if sa else str(ROOT / "service-account.json")))
    doc = firestore.client().collection("athletes").document(athlete)
    if "--pull" in args:
        return pull(athlete, doc, base)

    gz = gzip.compress(json_from_js(base / "garmin.js", "window.GARMIN = ").encode())
    parts = [gz[i:i + CHUNK] for i in range(0, len(gz), CHUNK)]
    for i, part in enumerate(parts):
        doc.collection("blobs").document(f"garmin-{i}").set({"d": part})
    doc.set({"parts": len(parts), "updated": datetime.now(timezone.utc)})
    print(f"{athlete}: dati {len(gz) // 1024} KB compressi in {len(parts)} documento/i")

    plan = ROOT / "piano.js"  # il piano gare è solo di Davide e resta fuori dalla repo pubblica
    if athlete == "davide-mariotti" and plan.exists():
        doc.collection("blobs").document("plan").set({"d": gzip.compress(plan.read_bytes())})
        print(f"{athlete}: piano aggiornato")

    analysis = base / "analisi.js"  # analisi a blocchi di analisi.py: privata, solo da locale (in GitHub Actions non c'è e resta quella online)
    if analysis.exists():
        doc.collection("blobs").document("analysis").set({"d": gzip.compress(json_from_js(analysis, "window.ANALISI = ").encode())})
        print(f"{athlete}: analisi aggiornata")

    have = {d.id for d in doc.collection("acts").list_documents()}
    new = [f for f in sorted((base / "act").glob("*.js")) if f.stem not in have]
    db = firestore.client()
    for i in range(0, len(new), 100):  # batch: max 500 scritture e 10 MB per richiesta
        batch = db.batch()
        for f in new[i:i + 100]:
            batch.set(doc.collection("acts").document(f.stem), {"d": gzip.compress(json_from_js(f, "] = ").encode())})
        batch.commit()
    print(f"{athlete}: {len(new)} attività nuove caricate ({len(have)} già presenti)")


if __name__ == "__main__":
    main()
