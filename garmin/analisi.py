"""Analisi di un atleta a blocchi, da una gara all'altra: volume, intensità, efficienza (passo a parità di FC e FC a
parità di passo), economia di corsa, lunghi, gare e recupero. Metodo e lettura dei numeri in ANALISI.md.

Uso:  .venv\\Scripts\\python analisi.py davide-mariotti
Legge  data/<atleta>/garmin.js, data/<atleta>/act/*.js, data/<atleta>/gare.json (gare: date, nome, km)
       e data/<atleta>/analisi-coach.json (il commento scritto, facoltativo).
Scrive data/<atleta>/analisi.js (window.ANALISI) e stampa un riassunto da cui scrivere il commento.
Tutto in data/: privato, non va mai nella repo pubblica.
"""

import json
import math
import statistics as st
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).parent
HR_REF = [140, 145, 150, 155, 160, 165, 170]       # FC a cui confrontare il passo
PACE_REF = [390, 360, 330, 300, 285]               # passi (s/km) a cui confrontare la FC: 6:30 6:00 5:30 5:00 4:45
EASY_PACE = (345, 405)                             # 5:45–6:45: forma di corsa confrontata a passo facile
FAST_PACE = (270, 315)                             # 4:30–5:15: forma a passo veloce
PACE_BANDS = [(375, 400), (355, 375), (335, 355), (315, 335), (295, 315), (270, 295)]  # FC a passo fisso: 6:15–6:40 … 4:30–4:55
EFFORT_FULL = {"half": 0.98, "marathon": 0.92}       # "a tutta": FC media almeno il 98% della soglia in mezza, il 92% in maratona
SPLIT_DAYS = 140                                   # blocchi più lunghi di 20 settimane: FC a passo fisso divisa in due metà (stagioni diverse)


def load_js(path, marker="="):
    """'window.GARMIN = {...};' (marker '=') oppure '(window.ACT = ...)[id] = {...};' (marker '] = ') -> oggetto."""
    text = path.read_text(encoding="utf-8")
    return json.loads(text[text.index(marker) + len(marker):text.rstrip().rindex(";")])


def med(xs):
    xs = [x for x in xs if x is not None]
    return round(st.median(xs), 2) if xs else None


def mean(xs):
    xs = [x for x in xs if x is not None]
    return round(sum(xs) / len(xs), 2) if xs else None


def fit_line(xs, ys):
    """Retta ai minimi quadrati y = a + b·x; None se i punti sono pochi o tutti uguali."""
    n = len(xs)
    if n < 15:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    if sxx == 0:
        return None
    b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sxx
    return my - b * mx, b


def vdot(meters, seconds):
    """VDOT di Daniels/Gilbert da una gara (stessa formula di piano.js)."""
    vel, t = meters / (seconds / 60), seconds / 60
    return (-4.6 + 0.182258 * vel + 0.000104 * vel * vel) / (0.8 + 0.1894393 * math.exp(-0.012778 * t) + 0.2989558 * math.exp(-0.1932605 * t))


def lthr_of(D):
    """FC di soglia della corsa (Garmin)."""
    z = next((z for z in D.get("hrZones") or [] if z["sport"] == "RUNNING"), None) or {}
    return z.get("lactateThresholdHeartRateUsed")


def zones_of(D):
    """Zone FC attuali della corsa (fisse per tutti i blocchi, così i blocchi sono confrontabili)."""
    z = next((z for z in D.get("hrZones") or [] if z["sport"] == "RUNNING"), None) or (D.get("hrZones") or [{}])[0]
    return [z.get(f"zone{i}Floor") for i in range(1, 6)] + [z.get("maxHeartRateUsed")]


def main():
    sys.stdout.reconfigure(encoding="utf-8")  # la console di Windows non è UTF-8
    athlete = sys.argv[1] if len(sys.argv) > 1 else "davide-mariotti"
    base = ROOT / "data" / athlete
    D = load_js(base / "garmin.js")
    races = json.loads((base / "gare.json").read_text(encoding="utf-8"))["races"]
    coach_file = base / "analisi-coach.json"
    coach = json.loads(coach_file.read_text(encoding="utf-8")) if coach_file.exists() else None
    floors = zones_of(D)
    lthr = lthr_of(D)
    today = D["generated"][:10]

    runs = [a for a in D["activities"] if "running" in a["activityType"]["typeKey"] and a.get("distance")]
    runs.sort(key=lambda a: a["startTimeLocal"])
    for a in runs:
        a["day"] = a["startTimeLocal"][:10]
    race_ids = {}
    for r in races:  # la gara è la corsa più lunga del giorno
        same = [a for a in runs if a["day"] == r["date"]]
        if same:
            race_ids[max(same, key=lambda a: a["distance"])["activityId"]] = r

    # blocchi: dal giorno dopo la gara precedente (o dalla prima corsa) al giorno della gara; poi il blocco in corso
    starts = [runs[0]["day"]] + [(date.fromisoformat(r["date"]) + timedelta(days=1)).isoformat() for r in races]
    ends = [r["date"] for r in races] + [today]
    blocks = [{"id": f"B{i + 1}", "from": s, "to": e, "race": races[i] if i < len(races) else None}
              for i, (s, e) in enumerate(zip(starts, ends)) if s <= e]

    detail_cache = {}

    def detail(a):
        aid = a["activityId"]
        if aid not in detail_cache:
            f = base / "act" / f"{aid}.js"
            detail_cache[aid] = load_js(f, "] = ") if f.exists() else None
        return detail_cache[aid]

    def zone_of(hr):
        return sum(hr >= f for f in floors[:5] if f)  # 0 = sotto Z1

    def steady_laps(det):
        """Giri "a regime" -> (FC, velocità corretta per la pendenza). Non il primo (FC ancora in salita), almeno 3 minuti,
        non un recupero, e il giro prima allo stesso passo (±6%): dopo un cambio di ritmo la FC resta indietro e farebbe
        sembrare il passo più facile di quanto è."""
        laps, out = (det or {}).get("laps") or [], []
        for j, lap in enumerate(laps):
            v, prev = lap.get("gap") or lap.get("spd"), laps[j - 1] if j else {}
            pv = prev.get("gap") or prev.get("spd")
            if (j == 0 or not v or not pv or not lap.get("hr") or (lap.get("t") or 0) < 180 or v < 1.8
                    or lap.get("int") in ("rest", "recovery") or prev.get("int") in ("rest", "recovery") or abs(v - pv) / pv > 0.06):
                continue
            out.append((lap["hr"], v))
        return out

    weights = sorted((m["allWeightMetrics"][0]["calendarDate"], m["allWeightMetrics"][0]["weight"] / 1000)
                     for m in D.get("weight") or [] if m.get("allWeightMetrics") and m["allWeightMetrics"][0].get("weight"))
    vo2_file = base / "vo2max.json"  # VO2max Garmin (dal connettore MCP, non dall'API): facoltativo
    vo2 = json.loads(vo2_file.read_text(encoding="utf-8"))["points"] if vo2_file.exists() else []

    out_blocks = []
    monthly = {}  # mese -> velocità dei giri a 145–150 bpm (stagionalità e tendenza)
    for b in blocks:
        rs = [a for a in runs if b["from"] <= a["day"] <= b["to"]]
        train = [a for a in rs if a["activityId"] not in race_ids]
        days = (date.fromisoformat(b["to"]) - date.fromisoformat(b["from"])).days + 1
        weeks = days / 7
        wk = {}
        for a in rs:
            d = date.fromisoformat(a["day"])
            wk.setdefault((d - timedelta(days=d.weekday())).isoformat(), []).append(a)
        n_weeks = max(1, math.ceil(weeks))
        km_week = [sum(x["distance"] for x in v) / 1000 for v in wk.values()]

        # intensità: tempo nelle zone fisse dalle serie FC dei FIT (solo allenamenti, gare escluse)
        zt = [0.0] * 6
        laps_pts, decs = [], []
        form = {"easy": [], "fast": []}
        for a in train:
            det = detail(a)
            rec = (det or {}).get("rec") or {}
            t, hr = rec.get("t") or [], rec.get("hr") or []
            for i in range(1, min(len(t), len(hr))):
                if hr[i] is not None:
                    zt[zone_of(hr[i])] += t[i] - t[i - 1]
            for lap_hr, v in steady_laps(det):
                laps_pts.append((lap_hr, v))
                if 145 <= lap_hr < 150:
                    monthly.setdefault(a["day"][:7], []).append(v)
            # deriva cardiaca (decoupling) sui lunghi facili e costanti: efficienza seconda metà vs prima metà
            spd = rec.get("spd") or []
            if a["duration"] >= 70 * 60 and (a.get("averageHR") or 999) <= 155 and len(t) > 50:
                pts = [(t[i], spd[i], hr[i]) for i in range(min(len(t), len(spd), len(hr)))
                       if t[i] > 600 and spd[i] and hr[i] and spd[i] > 1.8]
                if len(pts) > 40:
                    half = pts[0][0] + (pts[-1][0] - pts[0][0]) / 2
                    ef = lambda p: sum(x[1] for x in p) / sum(x[2] for x in p)
                    h1, h2 = [p for p in pts if p[0] < half], [p for p in pts if p[0] >= half]
                    s1, s2 = sum(p[1] for p in h1) / len(h1), sum(p[1] for p in h2) / len(h2)
                    if abs(s2 - s1) / s1 <= 0.04:  # niente progressivi né lunghi con blocchi veloci
                        e1, e2 = ef(h1), ef(h2)
                        decs.append(round((e1 - e2) / e1 * 100, 1))
            # forma di corsa a parità di passo (le dinamiche cambiano con la velocità)
            v = a.get("averageSpeed")
            flat = (a.get("elevationGain") or 0) / (a["distance"] / 1000) <= 10
            pace = 1000 / v if v and flat else None
            key = "easy" if pace and EASY_PACE[0] <= pace <= EASY_PACE[1] else "fast" if pace and FAST_PACE[0] <= pace <= FAST_PACE[1] else None
            if key:
                form[key].append(a)

        # efficienza: retta velocità ~ FC sui giri stabili -> passo previsto a FC fissa e FC prevista a passo fisso
        line = fit_line([p[0] for p in laps_pts if 130 <= p[0] <= 178], [p[1] for p in laps_pts if 130 <= p[0] <= 178])
        pace_at_hr = {h: round(1000 / (line[0] + line[1] * h)) if line and line[0] + line[1] * h > 0 else None for h in HR_REF}
        hr_at_pace = {p: round((1000 / p - line[0]) / line[1]) if line and line[1] > 0 else None for p in PACE_REF}
        bins = {}
        for h in HR_REF:
            vs = [v for hr, v in laps_pts if h <= hr < h + 5]
            bins[h] = {"n": len(vs), "pace": round(1000 / st.median(vs)) if len(vs) >= 6 else None}
        easy_runs = [a for a in train if a.get("averageHR") and a["averageHR"] <= 150 and a["distance"] >= 5000]
        ef_runs = [round((a.get("avgGradeAdjustedSpeed") or a["averageSpeed"]) * 60 / a["averageHR"], 3) for a in easy_runs]

        def form_stats(lst):
            g = lambda k: med([x.get(k) for x in lst])
            return {"n": len(lst), "pace": med([1000 / x["averageSpeed"] for x in lst]),
                    "hr": g("averageHR"), "cad": g("averageRunningCadenceInStepsPerMinute"), "stride": g("avgStrideLength"),
                    "gct": g("avgGroundContactTime"), "vo": g("avgVerticalOscillation"), "vr": g("avgVerticalRatio"),
                    "power": g("avgPower")}

        labels = {}
        for a in train:
            labels[a.get("trainingEffectLabel") or "?"] = labels.get(a.get("trainingEffectLabel") or "?", 0) + 1
        longs = [a for a in train if a["distance"] >= 18000]
        tot_z = sum(zt) or 1
        summ = [s for s in D.get("summaries") or [] if b["from"] <= s["calendarDate"] <= b["to"]]
        slp = [s for s in D.get("sleep") or [] if s.get("calendarDate") and b["from"] <= s["calendarDate"] <= b["to"] and s.get("sleepTimeSeconds")]
        hrv = [h for h in D.get("hrv") or [] if b["from"] <= h["calendarDate"] <= b["to"]]
        v_in = [v for d, v in vo2 if b["from"] <= d <= b["to"]]
        v_before = [v for d, v in vo2 if d <= b["from"]]
        out_blocks.append({
            **b, "days": days, "weeks": round(weeks, 1),
            "volume": {"runs": len(rs), "km": round(sum(a["distance"] for a in rs) / 1000), "km_week": round(sum(a["distance"] for a in rs) / 1000 / weeks, 1),
                       "km_week_max": round(max(km_week), 1) if km_week else 0, "runs_week": round(len(rs) / weeks, 1),
                       "weeks_empty": n_weeks - len(wk), "long_runs": len(longs), "longest": round(max((a["distance"] for a in train), default=0) / 1000, 1),
                       "other_hours": round(sum(a["duration"] for a in D["activities"] if b["from"] <= a["startTimeLocal"][:10] <= b["to"] and "running" not in a["activityType"]["typeKey"]) / 3600, 1)},
            "zones": {"below": round(zt[0] / tot_z * 100), **{f"z{i}": round(zt[i] / tot_z * 100) for i in range(1, 6)}, "hours": round(sum(zt) / 3600, 1)},
            "types": dict(sorted(labels.items(), key=lambda x: -x[1])),
            "efficiency": {"laps": len(laps_pts), "pace_at_hr": pace_at_hr, "hr_at_pace": hr_at_pace, "bins": bins,
                           "ef_easy": med(ef_runs), "easy_runs": len(easy_runs), "easy_hr": med([a["averageHR"] for a in easy_runs]),
                           "easy_pace": med([1000 / (a.get("avgGradeAdjustedSpeed") or a["averageSpeed"]) for a in easy_runs])},
            "decoupling": {"n": len(decs), "median": med(decs)},
            "form": {k: form_stats(v) for k, v in form.items()},
            "health": {"rhr": mean([(s.get("heartRate") or {}).get("restingValue") for s in summ]), "hrv": mean([h.get("lastNightAvg") for h in hrv]),
                       "sleep_h": mean([s["sleepTimeSeconds"] / 3600 for s in slp]), "sleep_score": mean([((s.get("sleepScores") or {}).get("overall") or {}).get("value") for s in slp]),
                       "stress": mean([(s.get("stress") or {}).get("avgLevel") for s in summ if ((s.get("stress") or {}).get("avgLevel") or -1) >= 0]),
                       "weight": med([w for d, w in weights if b["from"] <= d <= b["to"]])},
            "vo2max": {"start": (v_before[-1] if v_before else (v_in[0] if v_in else None)), "end": v_in[-1] if v_in else None, "peak": max(v_in) if v_in else None},
        })

    # FC a passo fisso per periodo: i blocchi lunghi si dividono al primo del mese più vicino a metà, per non mescolare le stagioni
    periods = []
    for b in blocks:
        f, e = date.fromisoformat(b["from"]), date.fromisoformat(b["to"])
        if (e - f).days > SPLIT_DAYS:
            mid = f + (e - f) / 2
            cut = date(mid.year, mid.month, 1) if mid.day <= 15 else date(mid.year + (mid.month == 12), mid.month % 12 + 1, 1)
            periods += [(b["id"] + "a", b["from"], (cut - timedelta(days=1)).isoformat()), (b["id"] + "b", cut.isoformat(), b["to"])]
        else:
            periods.append((b["id"], b["from"], b["to"]))
    out_periods = []
    for pid, f, e in periods:
        pts = [pt for a in runs if f <= a["day"] <= e and a["activityId"] not in race_ids for pt in steady_laps(detail(a))]
        bands = []
        for lo, hi in PACE_BANDS:
            hs = [h for h, v in pts if lo <= 1000 / v < hi]
            bands.append({"hr": round(st.median(hs)) if len(hs) >= 5 else None, "n": len(hs)})
        out_periods.append({"id": pid, "from": f, "to": e, "bands": bands})

    # gare: tempo, passo, FC, ritmo prima e seconda metà, deriva, VDOT
    out_races = []
    for aid, r in race_ids.items():
        a = next(x for x in runs if x["activityId"] == aid)
        rec = (detail(a) or {}).get("rec") or {}
        d, t, hr = rec.get("d") or [], rec.get("t") or [], rec.get("hr") or []
        half = a["distance"] / 2
        i_half = next((i for i, x in enumerate(d) if x and x >= half), None)
        split = None
        if i_half:
            t1 = t[i_half]
            split = {"first": round(t1), "second": round(a["duration"] - t1),
                     "hr1": mean(hr[:i_half]), "hr2": mean(hr[i_half:])}
        v = a.get("avgGradeAdjustedSpeed") or a["averageSpeed"]
        # sforzo: una gara "controllata" (FC sotto la soglia di sforzo pieno) dà un VDOT minimo, non la forma;
        # "invalid" in gare.json (malattia, gara da accompagnatore) la esclude
        thr = a["averageHR"] / lthr if lthr else None
        full = EFFORT_FULL["marathon" if r["km"] > 30 else "half"]
        effort = "invalid" if r.get("effort") == "invalid" else "max" if thr and thr >= full else "controlled" if thr else None
        i5 = next((i for i, x in enumerate(d) if x and x >= a["distance"] - 5000), None)
        hr_last5 = mean(hr[i5:]) if i5 is not None else None
        before = lambda n: round(sum(x["distance"] for x in runs if 0 < (date.fromisoformat(r["date"]) - date.fromisoformat(x["day"])).days <= n) / 1000)
        long6 = max((x["distance"] for x in runs if 0 < (date.fromisoformat(r["date"]) - date.fromisoformat(x["day"])).days <= 42), default=0)
        load = {"km7": before(7), "km14": before(14), "km28": before(28), "long6w": round(long6 / 1000, 1)}
        out_races.append({**r, "load": load, "effort": effort, "hr_thr": round(thr * 100) if thr else None, "hr_last5": round(hr_last5) if hr_last5 else None, "id": aid, "time": round(a["duration"]), "km_real": round(a["distance"] / 1000, 2), "pace": round(1000 / a["averageSpeed"]),
                          "gap": round(1000 / v), "hr": round(a["averageHR"]), "hr_max": a.get("maxHR"), "hr_pct": round(a["averageHR"] / floors[5] * 100) if floors[5] else None,
                          "ef": round(v * 60 / a["averageHR"], 3), "elev": a.get("elevationGain"), "temp_max": a.get("maxTemperature"),
                          "cad": a.get("averageRunningCadenceInStepsPerMinute"), "stride": a.get("avgStrideLength"), "power": a.get("avgPower"),
                          "gct": a.get("avgGroundContactTime"), "vo": a.get("avgVerticalOscillation"), "vr": a.get("avgVerticalRatio"),
                          "vdot": round(vdot(r["km"] * 1000, a["duration"]), 1), "split": split})
    out_races.sort(key=lambda r: r["date"])

    # serie per i grafici: settimane (km per blocco), efficienza delle facili corsa per corsa, passo a 145–150 bpm mese per mese
    weekly = {}
    for a in runs:
        d = date.fromisoformat(a["day"])
        w = (d - timedelta(days=d.weekday())).isoformat()
        weekly[w] = weekly.get(w, 0) + a["distance"] / 1000
    series = {
        "weekly": [[w, round(km, 1)] for w, km in sorted(weekly.items())],
        "ef": [[a["day"], round((a.get("avgGradeAdjustedSpeed") or a["averageSpeed"]) * 60 / a["averageHR"], 3), round(a["averageHR"]), round(1000 / (a.get("avgGradeAdjustedSpeed") or a["averageSpeed"]))]
               for a in runs if a.get("averageHR") and a["averageHR"] <= 150 and a["distance"] >= 5000 and a["activityId"] not in race_ids],
        "monthly_145": [[m, round(1000 / st.median(v)), len(v)] for m, v in sorted(monthly.items()) if len(v) >= 4],
        "vo2max": vo2, "weight": [[d, round(w, 1)] for d, w in weights],
    }
    result = {"generated": D["generated"], "athlete": athlete, "zones": floors, "pace_bands": PACE_BANDS, "blocks": out_blocks,
              "periods": out_periods, "races": out_races, "series": series, "coach": coach}
    (base / "analisi.js").write_text("window.ANALISI = " + json.dumps(result, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")

    # riassunto leggibile per scrivere il commento
    pace = lambda s: f"{int(s // 60)}:{int(round(s % 60)):02d}" if s else "–"
    for b in out_blocks:
        v, e, f = b["volume"], b["efficiency"], b["form"]
        print(f"\n== {b['id']} {b['from']} → {b['to']} ({b['weeks']} sett.) {('→ ' + b['race']['name']) if b['race'] else '(in corso)'}")
        print(f"  volume: {v['runs']} corse, {v['km']} km, {v['km_week']} km/sett (max {v['km_week_max']}), {v['runs_week']} uscite/sett, settimane vuote {v['weeks_empty']}, lunghi≥18 {v['long_runs']}, più lunga {v['longest']} km, altro sport {v['other_hours']} h")
        print(f"  zone (fisse {floors}): {b['zones']}")
        print(f"  tipi Garmin: {b['types']}")
        print(f"  passo a FC (retta su {e['laps']} giri): " + "  ".join(f"{h}:{pace(p)}" for h, p in e["pace_at_hr"].items()))
        print(f"  passo a FC (mediana giri):  " + "  ".join(f"{h}:{pace(x['pace'])}(n{x['n']})" for h, x in e["bins"].items()))
        print(f"  FC a passo: " + "  ".join(f"{pace(p)}:{h}" for p, h in e["hr_at_pace"].items()))
        print(f"  facili (FC≤150, ≥5 km): {e['easy_runs']} · FC {e['easy_hr']} · passo {pace(e['easy_pace'])} · EF {e['ef_easy']} | decoupling lunghi: {b['decoupling']}")
        for k in ("easy", "fast"):
            x = f[k]
            print(f"  forma {k}: n{x['n']} passo {pace(x['pace'])} FC {x['hr']} cad {x['cad']} passo {x['stride']}cm GCT {x['gct']} VO {x['vo']} VR {x['vr']} W {x['power']}")
        print(f"  salute: {b['health']} · VO2max {b['vo2max']}")
    print("\n== gare")
    for r in out_races:
        s = r["split"] or {}
        print(f"  {r['date']} {r['name']}: {pace(r['time'] // 60 * 60 / 60) if False else r['time']}s · {pace(r['pace'])}/km (GAP {pace(r['gap'])}) · FC {r['hr']} ({r['hr_pct']}%) max {r['hr_max']} · VDOT {r['vdot']} · EF {r['ef']} · D+ {r['elev']} · T max {r['temp_max']} · cad {r['cad']} · split {s.get('first')}/{s.get('second')} FC {s.get('hr1')}/{s.get('hr2')} · prima: {r['load']} · sforzo {r['effort']} ({r['hr_thr']}% soglia, ultimi 5 km FC {r['hr_last5']})")
    print("\n== FC a passo fisso (giri a regime):", "  ".join(f"{pace(lo)}–{pace(hi)}" for lo, hi in PACE_BANDS))
    for pr in out_periods:
        print(f"  {pr['id']:4} {pr['from']} → {pr['to']}: " + "  ".join(f"{x['hr'] or '–':>3}(n{x['n']})" for x in pr["bands"]))
    print("\n== passo a 145–150 bpm per mese:", "  ".join(f"{m}:{pace(p)}(n{n})" for m, p, n in series["monthly_145"]))
    print(f"\nScritto {base / 'analisi.js'}")


if __name__ == "__main__":
    main()
