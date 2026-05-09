from PIL import Image, ImageDraw, ImageFont
import os

def make_icon(size, path):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded black background
    r = int(size * 0.22)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=(10, 10, 10, 255))

    gold = (200, 169, 110)

    # "JS" big text
    js_size = int(size * 0.42)
    try:
        font_js = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", js_size)
    except Exception:
        font_js = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), "JS", font=font_js)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2
    y = int(size * 0.16)
    draw.text((x, y), "JS", fill=gold, font=font_js)

    # Separator line
    lw = int(size * 0.55)
    lx = (size - lw) // 2
    ly = int(size * 0.67)
    draw.rectangle([lx, ly, lx + lw, ly + max(2, int(size * 0.012))], fill=gold)

    # "PERSONAL TRAINER" subtitle
    sub_size = max(8, int(size * 0.085))
    try:
        font_sub = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", sub_size)
    except Exception:
        font_sub = ImageFont.load_default()

    sub_text = "PERSONAL TRAINER"
    sbbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sw = sbbox[2] - sbbox[0]
    sx = (size - sw) // 2
    sy = ly + int(size * 0.04)
    draw.text((sx, sy), sub_text, fill=gold, font=font_sub)

    img.save(path, "PNG")
    print(f"Created {path}")

out = r"C:\Users\mousa\josilvapt"
make_icon(192, os.path.join(out, "icon-192.png"))
make_icon(512, os.path.join(out, "icon-512.png"))
print("Icons generated!")
