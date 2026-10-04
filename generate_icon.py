#!/usr/bin/env python3
"""
High-Resolution Crisp Icon Generator for सँगालो (Sangalo) — Nepal Patro & Cultural Keepsake
Renders authentic Nepal Crimson (#c8102e), Sacred Gold (#f59e0b) calendar sheet with
Chandra-Surya (Moon & Sun) celestial motifs with 2x supersampling using pure Python (no PIL/external dependencies).
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

    # Authentic Nepal Colors (RGBA)
    CRIMSON_DARK = (153, 27, 27, 255)   # #991b1b
    CRIMSON_MID  = (200, 16, 46, 255)   # #c8102e (Nepal Flag Crimson)
    CRIMSON_DEEP = (127, 29, 29, 255)   # #7f1d1d
    GOLD_AMBER   = (253, 224, 71, 255)  # #fde047
    GOLD_MID     = (245, 158, 11, 255)  # #f59e0b
    GOLD_DARK    = (180, 83, 9, 255)    # #b45309
    PURE_WHITE   = (255, 255, 255, 255) # #ffffff
    IVORY_WHITE  = (248, 250, 252, 255) # #f8fafc
    SLATE_LINE   = (226, 232, 240, 255) # #e2e8f0

    # Sub-pixel buffer
    s_rows = []

    # Calendar sheet boundaries
    cal_w = sw * 0.68
    cal_h = sh * 0.68
    cal_x1 = scx - cal_w / 2.0
    cal_x2 = scx + cal_w / 2.0
    cal_y1 = scy - cal_h / 2.0 + sh * 0.03
    cal_y2 = cal_y1 + cal_h
    cal_corner_r = sw * 0.08
    cal_header_h = cal_h * 0.22

    # Ring coordinates
    ring1_x = scx - sw * 0.16
    ring2_x = scx + sw * 0.16
    ring_y  = cal_y1

    # Chandra (Moon) center
    moon_cx = scx
    moon_cy = cal_y1 + cal_header_h + cal_h * 0.22
    moon_r  = sw * 0.11

    # Surya (Sun) center
    sun_cx = scx
    sun_cy = cal_y1 + cal_header_h + cal_h * 0.54
    sun_r  = sw * 0.12

    for sy in range(sh):
        s_row = []
        ny_norm = (sy - scy) / (sh * 0.45)
        for sx in range(sw):
            nx_norm = (sx - scx) / (sw * 0.45)
            squircle = (nx_norm**4 + ny_norm**4)

            if squircle <= 1.0:
                # Vertical Crimson Gradient across squircle
                t = sy / float(sh)
                r = int(CRIMSON_DARK[0] * (1 - t) + CRIMSON_DEEP[0] * t)
                g = int(CRIMSON_MID[1] * (1 - t) + CRIMSON_DEEP[1] * t)
                b = int(CRIMSON_DARK[2] * (1 - t) + CRIMSON_DEEP[2] * t)
                a = 255

                # Subtle golden hairline outer border
                if 0.91 <= squircle <= 1.0:
                    r = min(255, int(r * 0.4 + GOLD_MID[0] * 0.6))
                    g = min(255, int(g * 0.4 + GOLD_MID[1] * 0.6))
                    b = min(255, int(b * 0.4 + GOLD_MID[2] * 0.6))

                # 1. Hanging Brass Rings (above calendar sheet)
                for rx in (ring1_x, ring2_x):
                    dx_r = abs(sx - rx)
                    dy_r = abs(sy - (ring_y - sh * 0.02))
                    if dx_r <= sw * 0.035 and dy_r <= sh * 0.05:
                        if dx_r >= sw * 0.015 and dy_r >= sh * 0.02:
                            r, g, b = GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]
                        else:
                            r, g, b = GOLD_AMBER[0], GOLD_MID[1], GOLD_DARK[2]

                # 2. Calendar Sheet Body (Rounded Rectangle)
                # Compute distance to calendar sheet rounded rect
                dx_c = max(0, abs(sx - scx) - (cal_w / 2.0 - cal_corner_r))
                dy_c = max(0, abs(sy - (cal_y1 + cal_h / 2.0)) - (cal_h / 2.0 - cal_corner_r))
                in_cal = (dx_c * dx_c + dy_c * dy_c) <= (cal_corner_r * cal_corner_r)

                if in_cal:
                    # Is it in the top binding header?
                    if sy <= cal_y1 + cal_header_h:
                        # Top crimson header
                        r, g, b = CRIMSON_DARK[0], CRIMSON_DARK[1], CRIMSON_DARK[2]
                        # Golden header divider line
                        if abs(sy - (cal_y1 + cal_header_h)) <= scale * 1.5:
                            r, g, b = GOLD_MID[0], GOLD_MID[1], GOLD_MID[2]
                    else:
                        # Crisp white calendar body
                        r, g, b = PURE_WHITE[0], PURE_WHITE[1], PURE_WHITE[2]

                        # A. Chandra (Crescent Moon) in upper sheet
                        dx_m = sx - moon_cx
                        dy_m = sy - moon_cy
                        dist_m1 = math.sqrt(dx_m * dx_m + dy_m * dy_m)
                        # Inner cutout offset upward
                        dist_m2 = math.sqrt(dx_m * dx_m + (dy_m + sh * 0.035)**2)

                        # Moon disc/star in center
                        star_dist = math.sqrt(dx_m * dx_m + (dy_m + sh * 0.04)**2)
                        if star_dist <= sw * 0.026:
                            r, g, b = GOLD_AMBER[0], GOLD_MID[1], GOLD_DARK[2]
                        elif dist_m1 <= moon_r and dist_m2 >= moon_r * 0.92 and dy_m >= -moon_r * 0.3:
                            r, g, b = GOLD_AMBER[0], GOLD_MID[1], GOLD_DARK[2]

                        # B. Surya (Radiant 12-Ray Sun) in lower sheet
                        dx_s = sx - sun_cx
                        dy_s = sy - sun_cy
                        dist_s = math.sqrt(dx_s * dx_s + dy_s * dy_s)

                        if dist_s <= sun_r:
                            # Calculate 12 triangular rays using angular modulation
                            angle = math.atan2(dy_s, dx_s) # -pi to pi
                            # 12 rays -> 6 cycles of sin(12 * angle)
                            ray_mod = math.cos(12 * angle) # oscillates between -1 and 1
                            ray_radius = sun_r * (0.65 + 0.35 * max(0, ray_mod))

                            if dist_s <= ray_radius:
                                r, g, b = GOLD_MID[0], GOLD_MID[1], GOLD_DARK[2]

                            # Sun inner core (Crimson circle inside gold)
                            if dist_s <= sun_r * 0.44:
                                r, g, b = CRIMSON_MID[0], CRIMSON_MID[1], CRIMSON_MID[2]
                            if dist_s <= sun_r * 0.28:
                                r, g, b = GOLD_AMBER[0], GOLD_AMBER[1], GOLD_DARK[2]

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
