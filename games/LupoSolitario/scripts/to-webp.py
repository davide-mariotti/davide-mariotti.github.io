"""Converte i PNG di public/img in WebP q95 (risoluzione invariata, differenza invisibile)
e aggiorna i riferimenti `public/img/...png` in data/ e src/.

Uso, dopo aver salvato nuove immagini generate:  python scripts/to-webp.py
"""
import re
from multiprocessing import Pool
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
KEEP_PNG = {"logo.png"}  # apple-touch-icon / manifest: iOS vuole PNG
REF = re.compile(r"public/img/[^\"'\s)]+?\.png")


def convert(png):
    with Image.open(png) as im:
        if im.mode == "RGBA" and im.getextrema()[3] == (255, 255):
            im = im.convert("RGB")  # alpha tutto opaco: inutile
        im.save(png.with_suffix(".webp"), quality=95, method=6)
    png.unlink()


def fix_refs(text):
    return REF.sub(lambda m: m[0][:-4] + ".webp" if (ROOT / m[0]).with_suffix(".webp").exists() else m[0], text)


if __name__ == "__main__":
    pngs = [p for p in (ROOT / "public/img").rglob("*.png") if p.name not in KEEP_PNG]
    with Pool() as pool:
        pool.map(convert, pngs)
    for f in [*ROOT.glob("data/**/*.json"), *ROOT.glob("src/**/*.js")]:
        with open(f, encoding="utf-8", newline="") as fh:
            text = fh.read()
        if (new := fix_refs(text)) != text:
            with open(f, "w", encoding="utf-8", newline="") as fh:
                fh.write(new)
    print(f"{len(pngs)} PNG convertiti in WebP")
