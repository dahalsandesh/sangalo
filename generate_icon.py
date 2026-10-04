#!/usr/bin/env python3
"""
High-Resolution Crisp Icon Generator for सँगालो (Sangalo)
Renders modern squircle app icons with supersampling using pure Python (no PIL/external dependencies).
"""
import struct
import zlib
import math
import sys

def render_icon(width, height, filename):
    # We will render using 2x supersampling for crisp edges then downsample
    scale = 2
    sw = width * scale
    sh = height * scale
    scx = sw / 2.0
    scy = sh / 2.0

    # Color definitions (RGBA)
    EMERALD_DARK = (6, 78, 59, 255)    # #064e3b
    EMERALD_MID  = (5, 150, 105, 255)  # #059669
    EMERALD_LGT  = (4, 120, 87, 255)   # #047857
    SUN_GOLD     = (245, 158, 11, 255)  # #f59e0b
    SUN_AMBER    = (253, 224, 71, 255)  # #fde047
    SNOW_WHITE   = (255, 255, 255, 255) # #ffffff
    SNOW_SHADOW  = (203, 213, 225, 255) # #cbd5e1
    SLATE_DARK   = (148, 163, 184, 255) # #94a3b8
    TERRACOTTA   = (180, 83, 9, 255)    # #b45309
    MAHOGANY     = (120, 53, 15, 255)   # #78350f
    WARM_CREAM   = (255, 251, 235, 255) # #fffbeb

    # Sub-pixel buffer
    s_rows = []

    for sy in range(sh):
        s_row = []
        ny_norm = (sy - scy) / (sh * 0.45)
        for sx in range(sw):
            nx_norm = (sx - scx) / (sw * 0.45)
            squircle = (nx_norm**4 + ny_norm**4)

            if squircle <= 1.0:
                # Vertical gradient across squircle
                t = sy / float(sh)
                r = int(EMERALD_DARK[0] * (1 - t) + EMERALD_LGT[0] * t)
                g = int(EMERALD_MID[1] * (1 - t) + EMERALD_LGT[1] * t)
                b = int(EMERALD_DARK[2] * (1 - t) + EMERALD_LGT[2] * t)
                a = 255

                # Subtle inner border stroke
                if 0.90 <= squircle <= 1.0:
                    r = min(255, int(r * 1.25 + 30))
                    g = min(255, int(g * 1.25 + 30))
                    b = min(255, int(b * 1.25 + 30))

                # 1. Golden Rising Sun
                sun_x = sx - scx
                sun_y = sy - (scy - sh * 0.14)
                sun_dist = math.sqrt(sun_x * sun_x + sun_y * sun_y)
                sun_r = sh * 0.14
                if sun_dist <= sun_r:
                    st = sun_dist / sun_r
                    r = int(SUN_AMBER[0] * (1 - st) + SUN_GOLD[0] * st)
                    g = int(SUN_AMBER[1] * (1 - st) + SUN_GOLD[1] * st)
                    b = int(SUN_AMBER[2] * (1 - st) + SUN_GOLD[2] * st)

                # 2. Side Mountain Peaks (Left & Right)
                # Left peak
                l_dx = abs(sx - (scx - sw * 0.22))
                l_peak_y = (scy - sh * 0.08) + l_dx * 1.1
                if sy >= l_peak_y and sy < scy + sh * 0.22 and sx < scx:
                    r, g, b = SNOW_SHADOW[0], SNOW_SHADOW[1], SNOW_SHADOW[2]

                # Right peak
                r_dx = abs(sx - (scx + sw * 0.22))
                r_peak_y = (scy - sh * 0.08) + r_dx * 1.1
                if sy >= r_peak_y and sy < scy + sh * 0.22 and sx > scx:
                    r, g, b = SNOW_SHADOW[0], SNOW_SHADOW[1], SNOW_SHADOW[2]

                # 3. Majestic Central Mountain Crest
                c_dx = abs(sx - scx)
                c_peak_y = (scy - sh * 0.24) + c_dx * 1.45
                if sy >= c_peak_y and sy < scy + sh * 0.24:
                    if sx <= scx:
                        r, g, b = SNOW_WHITE[0], SNOW_WHITE[1], SNOW_WHITE[2]
                    else:
                        r, g, b = SNOW_SHADOW[0], SNOW_SHADOW[1], SNOW_SHADOW[2]

                # 4. Pagoda Home Roof Silhouette
                roof_y_start = scy + sh * 0.06
                roof_y_end   = scy + sh * 0.22
                if roof_y_start <= sy <= roof_y_end:
                    r_slope = (sy - roof_y_start) * 0.85
                    if abs(sx - scx) <= r_slope + sw * 0.06:
                        r, g, b = TERRACOTTA[0], TERRACOTTA[1], TERRACOTTA[2]
                        # Eaves rim
                        if abs(abs(sx - scx) - (r_slope + sw * 0.06)) < scale * 2 or sy < roof_y_start + scale * 3:
                            r, g, b = MAHOGANY[0], MAHOGANY[1], MAHOGANY[2]

                # 5. Pagoda Base & Arched Doorway
                base_y_start = scy + sh * 0.21
                base_y_end   = scy + sh * 0.35
                if base_y_start <= sy <= base_y_end and abs(sx - scx) <= sw * 0.14:
                    r, g, b = WARM_CREAM[0], WARM_CREAM[1], WARM_CREAM[2]
                    # Arched door
                    door_x = abs(sx - scx)
                    door_w = sw * 0.05
                    door_top = scy + sh * 0.26
                    if door_x <= door_w and sy >= door_top:
                        r, g, b = TERRACOTTA[0], TERRACOTTA[1], TERRACOTTA[2]

                s_row.append((r, g, b, a))
            else:
                s_row.append((0, 0, 0, 0))
        s_rows.append(s_row)

    # Downsample by scale factor (box filter 2x2)
    pixels = []
    for y in range(height):
        row = [0] # filter byte
        sy_base = y * scale
        for x in range(width):
            sx_base = x * scale
            acc_r = acc_g = acc_b = acc_a = 0
            for dy in range(scale):
                for dx in range(scale):
                    pr, pg, pb, pa = s_rows[sy_base + dy][sx_base + dx]
                    acc_r += pr
                    acc_g += pg
                    acc_b += pb
                    acc_a += pa
            count = scale * scale
            avg_a = acc_a // count
            if avg_a > 0:
                row.extend([acc_r // count, acc_g // count, acc_b // count, avg_a])
            else:
                row.extend([0, 0, 0, 0])
        pixels.append(bytes(row))

    raw_data = b"".join(pixels)
    compressed = zlib.compress(raw_data, 9)

    def chunk(tag, data):
        c = tag + data
        crc = struct.pack(">I", zlib.crc32(c) & 0xffffffff)
        return struct.pack(">I", len(data)) + c + crc

    png_header = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    idat = chunk(b"IDAT", compressed)
    iend = chunk(b"IEND", b"")

    with open(filename, "wb") as f:
        f.write(png_header + ihdr + idat + iend)

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "ic_launcher.png"
    size = int(sys.argv[2]) if len(sys.argv) > 2 else 192
    render_icon(size, size, out)
    print(f"Generated crisp {size}x{size} PNG icon at {out}")
