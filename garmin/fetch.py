"""Scarica i dati dalla Garmin Connect Personal API in data/<atleta>/garmin.js (letto da dashboard.html)
e il dettaglio di ogni attività (file FIT) in data/<atleta>/act/<id>.js, solo per quelle non ancora scaricate.

Uso:  .venv\\Scripts\\python fetch.py [--athlete davide-mariotti] [--days 365 | --since 2024-08-29] [--details-days 14]
La chiave arriva da GARMIN_KEY (GitHub Actions) oppure da GARMIN_KEY_<NOME_COGNOME> nel file .env.
"""

import argparse
import io
import json
import math
import os
import time
import xml.etree.ElementTree as ET
import zipfile
from datetime import date, datetime, timedelta
from pathlib import Path

from garmin_fit_sdk import Decoder, Stream
from garmin_personal_api import GarminPersonalApiClient, HttpError, PersonalApiAuthenticator

ROOT = Path(__file__).parent


def load_env():
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            key, sep, value = line.partition("=")
            if sep and not key.lstrip().startswith("#"):
                os.environ.setdefault(key.strip(), value.strip())


def retry(fn, *args):
    """La Personal API concede circa 100 chiamate al minuto: su HTTP 429 aspetta quanto chiede e riprova."""
    for _ in range(5):
        try:
            return fn(*args)
        except HttpError as e:
            if getattr(e, "status_code", None) != 429:
                raise
            wait = json.loads(e.response_text or "{}").get("retryInSeconds", 30)
            print(f"  limite di chiamate raggiunto, attendo {wait + 1} s", flush=True)
            time.sleep(wait + 1)
    return fn(*args)


def ranged(fn, start, end, max_days, pick=lambda r: r):
    """Gli endpoint a intervallo accettano al massimo `max_days` giorni: spezza e concatena."""
    out = []
    while start <= end:
        stop = min(start + timedelta(days=max_days - 1), end)
        out += pick(retry(fn, start, stop)) or []
        start = stop + timedelta(days=1)
    return out


def all_activities(c, page=100):
    acts = []
    while batch := c.search_activities(start=len(acts), limit=page):
        acts += batch
        if len(batch) < page:
            break
    for a in acts:
        a.pop("splitSummaries", None)  # pesante e non usato dalla dashboard
    return acts


def mean(values):
    values = [v for v in values if v is not None]
    return round(sum(values) / len(values), 2) if values else None


def activity_detail(zip_bytes):
    """Lo zip di Garmin contiene il FIT, oppure un GPX per le attività importate da altre app."""
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        name = next(n for n in zf.namelist() if n.lower().endswith((".fit", ".gpx")))
        raw = zf.read(name)
    return gpx_detail(raw) if name.lower().endswith(".gpx") else fit_detail(raw)


def haversine(lat1, lon1, lat2, lon2):
    """Distanza in metri tra due punti GPS."""
    p = math.pi / 180
    a = math.sin((lat2 - lat1) * p / 2) ** 2 + math.cos(lat1 * p) * math.cos(lat2 * p) * math.sin((lon2 - lon1) * p / 2) ** 2
    return 12_742_000 * math.asin(math.sqrt(a))


def gpx_detail(raw):
    """GPX -> stesse serie del FIT (tempo, distanza, FC, velocità, quota) e traccia; il GPX non ha giri."""
    pts = []  # (secondi, lat, lon, quota, FC)
    for p in ET.fromstring(raw).iter():
        if p.tag.endswith("trkpt"):
            v = {c.tag.rsplit("}", 1)[-1]: c.text for c in p.iter()}  # ele, time, hr senza namespace
            if v.get("time"):
                pts.append((datetime.fromisoformat(v["time"].replace("Z", "+00:00")).timestamp(),
                            float(p.get("lat")), float(p.get("lon")), v.get("ele"), v.get("hr")))
    if len(pts) < 2:
        return {"rec": {}, "gps": [], "laps": []}
    dist = [0.0]
    for a, b in zip(pts, pts[1:]):
        dist.append(dist[-1] + haversine(a[1], a[2], b[1], b[2]))
    k = max(1, math.ceil(len(pts) / 700))
    rec = {"t": [], "d": [], "hr": [], "spd": [], "alt": []}
    for i in range(0, len(pts), k):
        j, h = min(i + k, len(pts)) - 1, max(i - 1, 0)
        dt = pts[j][0] - pts[h][0]
        rec["t"].append(round(pts[j][0] - pts[0][0]))
        rec["d"].append(round(dist[j], 1))
        rec["hr"].append(mean([float(x[4]) for x in pts[i:j + 1] if x[4]]))
        rec["spd"].append(round((dist[j] - dist[h]) / dt, 3) if dt > 0 else None)
        rec["alt"].append(mean([float(x[3]) for x in pts[i:j + 1] if x[3]]))
    rec = {key: col for key, col in rec.items() if any(v is not None for v in col)}
    g = max(1, math.ceil(len(pts) / 600))
    return {"rec": rec, "gps": [[round(x[1], 5), round(x[2], 5)] for x in pts[::g]], "laps": []}


def fit_detail(raw):
    """FIT -> serie compatte (~700 punti), giri e traccia GPS."""
    msgs, _ = Decoder(Stream.from_byte_array(bytearray(raw))).read(convert_datetimes_to_dates=False)
    recs = [r for r in msgs.get("record_mesgs", []) if "timestamp" in r]
    sport = (msgs.get("session_mesgs") or [{}])[0].get("sport")
    legs = 2 if sport == "running" else 1  # la cadenza FIT della corsa è per singola gamba
    semi = 180 / 2**31  # semicerchi -> gradi

    def cad(r, key="cadence", frac="fractional_cadence"):
        return (r[key] + (r.get(frac) or 0)) * legs if r.get(key) is not None else None

    k = max(1, math.ceil(len(recs) / 700))
    t0 = recs[0]["timestamp"] if recs else 0
    rec = {"t": [], "d": [], "hr": [], "spd": [], "alt": [], "cad": [], "pwr": []}
    for i in range(0, len(recs), k):
        b = recs[i:i + k]
        rec["t"].append(b[-1]["timestamp"] - t0)
        rec["d"].append(b[-1].get("distance"))
        rec["hr"].append(mean([r.get("heart_rate") for r in b]))
        rec["spd"].append(mean([r.get("enhanced_speed", r.get("speed")) for r in b]))
        rec["alt"].append(mean([r.get("enhanced_altitude", r.get("altitude")) for r in b]))
        rec["cad"].append(mean([cad(r) for r in b]))
        rec["pwr"].append(mean([r.get("power") for r in b]))
    rec = {key: col for key, col in rec.items() if any(v is not None for v in col)}

    pos = [(r["position_lat"] * semi, r["position_long"] * semi) for r in recs if r.get("position_lat") is not None]
    g = max(1, math.ceil(len(pos) / 600))
    laps = [{
        "t": lap.get("total_timer_time"), "d": lap.get("total_distance"),
        "spd": lap.get("enhanced_avg_speed", lap.get("avg_speed")), "gap": lap.get("avg_grade_adjusted_speed"),
        "hr": lap.get("avg_heart_rate"), "mhr": lap.get("max_heart_rate"),
        "cad": cad(lap, "avg_cadence", "avg_fractional_cadence"), "pwr": lap.get("avg_power"),
        "asc": lap.get("total_ascent"), "int": lap.get("intensity"),
    } for lap in msgs.get("lap_mesgs", [])]
    return {"rec": rec, "gps": [[round(a, 5), round(b, 5)] for a, b in pos[::g]], "laps": laps}


def download_details(c, activities, since, folder):
    folder.mkdir(parents=True, exist_ok=True)
    todo = [a for a in activities if a["startTimeLocal"][:10] >= since.isoformat() and not a.get("manualActivity")
            and not (folder / f"{a['activityId']}.js").exists()]
    for n, a in enumerate(todo, 1):
        aid = a["activityId"]
        try:
            detail = activity_detail(retry(c.download_activity, aid))
        except Exception as e:  # un file illeggibile non deve fermare gli altri: si riprova al prossimo giro
            print(f"! dettaglio {aid}: {type(e).__name__} {e}")
            continue
        js = f"(window.ACT = window.ACT || {{}})[{aid}] = {json.dumps(detail, separators=(',', ':'))};\n"
        (folder / f"{aid}.js").write_text(js, encoding="utf-8")
        if n % 20 == 0 or n == len(todo):
            print(f"  dettagli      {n}/{len(todo)}", flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--athlete", default="davide-mariotti", help="id nome-cognome: cartella data/<id> e chiave GARMIN_KEY_<NOME_COGNOME>")
    parser.add_argument("--days", type=int, default=365, help="giorni di storico per i dati giornalieri")
    parser.add_argument("--since", type=date.fromisoformat, help="data di inizio AAAA-MM-GG al posto di --days (tutta la storia)")
    parser.add_argument("--details-days", type=int, help="giorni di attività di cui scaricare il FIT (default: tutto lo storico)")
    args = parser.parse_args()
    days, athlete = args.days, args.athlete

    load_env()
    env_name = "GARMIN_KEY_" + athlete.upper().replace("-", "_")
    key = os.environ.get("GARMIN_KEY") or os.environ.get(env_name)
    if not key:
        raise SystemExit(f"Manca la chiave: imposta GARMIN_KEY oppure {env_name} nel file .env")
    cache = Path.home() / ".config" / "garmin" / f"token-{athlete}.json"  # un token per atleta
    token = PersonalApiAuthenticator(bearer_token_cache_file=cache).obtain_token(key)
    c = GarminPersonalApiClient(token.access_token)
    end = date.today()
    start = args.since or end - timedelta(days=days - 1)
    yday = end - timedelta(days=1)

    # Limiti misurati: summaries/sleep/bodyBattery max ~31 giorni, HRV e peso fino a 365.
    jobs = {
        "profile": lambda: c.get_user_profile_settings(),
        "hrZones": lambda: c.get_heart_rate_zones(),
        "fitnessAge": lambda: c.get_fitness_age(yday),
        "summaries": lambda: ranged(c.get_daily_summaries, start, end, 31, lambda r: r["data"]),
        "sleep": lambda: ranged(c.get_daily_sleep_summaries, start, end, 31),
        "bodyBattery": lambda: ranged(c.get_daily_body_battery, start, end, 31),
        "hrv": lambda: ranged(c.get_daily_hrv_summaries, start, end, 365, lambda r: r["hrvSummaries"]),
        "weight": lambda: ranged(c.get_weight_measurements, start, end, 365, lambda r: r["dailyWeightSummaries"]),
        "weightGoals": lambda: c.get_effective_weight_goals(start, end),
        "heartRateDay": lambda: c.get_daily_heart_rate(yday),
        "hrvNight": lambda: c.get_daily_hrv(end),
        "activities": lambda: all_activities(c),
    }
    data = {"generated": datetime.now().isoformat(timespec="minutes"), "from": start.isoformat()}
    for name, job in jobs.items():
        try:
            data[name] = retry(job)
            size = len(data[name]) if isinstance(data[name], list) else "ok"
            print(f"  {name:13} {size}", flush=True)
        except HttpError as e:  # un endpoint che fallisce non deve bloccare gli altri
            print(f"! {name:13} {e}")
            data[name] = None

    out = ROOT / "data" / athlete / "garmin.js"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("window.GARMIN = " + json.dumps(data, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"Scritto {out} ({out.stat().st_size // 1024} KB)", flush=True)
    if data["activities"]:
        since = end - timedelta(days=args.details_days - 1) if args.details_days else start
        download_details(c, data["activities"], since, out.parent / "act")
    print("Fatto. Apri dashboard.html")


if __name__ == "__main__":
    main()
