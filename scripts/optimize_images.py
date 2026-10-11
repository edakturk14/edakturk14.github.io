"""Generate responsive gallery thumbnails without changing the originals."""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def optimize(source):
    output = source.parent / "thumbnails"
    output.mkdir(exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        mode = "RGBA" if "A" in image.getbands() or "transparency" in image.info else "RGB"
        image = image.convert(mode)
        for width in sorted({min(size, image.width) for size in (480, 960, 1440)}):
            height = round(image.height * width / image.width)
            thumbnail = image.resize((width, height), Image.Resampling.LANCZOS)
            destination = output / f"{source.stem}-{width}.webp"
            thumbnail.save(destination, "WEBP", quality=85, method=6)
            print(f"{destination} {width}w ({destination.stat().st_size:,} bytes)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("images", type=Path, nargs="+")
    for source in parser.parse_args().images:
        optimize(source)
