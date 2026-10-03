#!/usr/bin/env python3
import struct
import zlib
import math

def create_png(width, height, filename):
    # RGBA image buffer
    pixels = []
    cx = width / 2.0
    cy = height / 2.0
    radius = width / 2.0 - 2.0

    for y in range(height):
        row = [0] # filter byte 0 (None)
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx * dx + dy * dy)
            
            # Squircle / rounded rect factor
            # Normalized coordinates [-1, 1]
            nx = (x - cx) / (width * 0.46)
            ny = (y - cy) / (height * 0.46)
            squircle = (nx**4 + ny**4)

            if squircle <= 1.0:
                # Inside squircle
                # Emerald green background gradient
                t = y / height
                r = int(5 * (1 - t) + 16 * t)
                g = int(150 * (1 - t) + 185 * t)
                b = int(105 * (1 - t) + 129 * t)
                a = 255

                # Rising sun in center top
                sdx = x - cx
                sdy = y - (cy - 10)
                if math.sqrt(sdx * sdx + sdy * sdy) < 18:
                    r, g, b = 245, 158, 11 # Golden Amber Sun

                # Mountain silhouette in bottom half
                if y >= cy - 6:
                    # Mountain triangular shape
                    slope = abs(x - cx)
                    peak_y = (cy - 6) + slope * 0.8
                    if y >= peak_y:
                        # Mountain body
                        r, g, b = 240, 253, 250 # Snow mountain white
                        if x > cx:
                            r, g, b = 203, 213, 225 # Shaded side
                
                # Warm traditional roof in lower center
                if cy + 10 <= y <= cy + 24 and abs(x - cx) < (24 - (y - (cy + 10)) * 0.5):
                    r, g, b = 180, 83, 9 # Terracotta roof

                row.extend([r, g, b, a])
            else:
                # Transparent outside squircle
                row.extend([0, 0, 0, 0])
        pixels.append(bytes(row))

    raw_data = b"".join(pixels)
    compressed = zlib.compress(raw_data)

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
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "ic_launcher.png"
    create_png(128, 128, out)
    print(f"Generated PNG icon at {out}")
