#!/usr/bin/env python3
import os
import sys
import json
import socket
import shutil
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

PORT = 8090
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
PHONE_STORAGE = '/root/workspace/phone_storage'
PRIMARY_APK = os.path.join(PHONE_STORAGE, 'Sangalo.apk')
FALLBACK_APK = os.path.join(PHONE_STORAGE, 'Haven.apk')

def get_active_apk():
    if os.path.exists(PRIMARY_APK):
        return PRIMARY_APK, 'Sangalo.apk'
    if os.path.exists(FALLBACK_APK):
        return FALLBACK_APK, 'Haven.apk'
    return None, None

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class SangaloHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in ['/download', '/Sangalo.apk', '/Haven.apk']:
            apk_path, apk_name = get_active_apk()
            if apk_path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/vnd.android.package-archive')
                self.send_header('Content-Disposition', f'attachment; filename="{apk_name}"')
                self.send_header('Content-Length', str(os.path.getsize(apk_path)))
                self.end_headers()
                return
            else:
                self.send_response(404)
                self.end_headers()
                return
        super().do_HEAD()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        
        # Download APK directly if requested
        if parsed.path in ['/download', '/Sangalo.apk', '/Haven.apk']:
            apk_path, apk_name = get_active_apk()
            if apk_path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/vnd.android.package-archive')
                self.send_header('Content-Disposition', f'attachment; filename="{apk_name}"')
                self.send_header('Content-Length', str(os.path.getsize(apk_path)))
                self.end_headers()
                with open(apk_path, 'rb') as f:
                    shutil.copyfileobj(f, self.wfile)
                return
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(b"Sangalo.apk has not been compiled yet. Run build_apk.sh first.")
                return

        # Status endpoint for hub integration
        if parsed.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            apk_path, _ = get_active_apk()
            payload = {
                "name": "सँगालो — Sangalo Nepali Family Companion",
                "status": "online",
                "port": PORT,
                "local_ip": get_local_ip(),
                "apk_available": apk_path is not None,
                "apk_size_mb": round(os.path.getsize(apk_path) / (1024 * 1024), 2) if apk_path else 0
            }
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return

        super().do_GET()

if __name__ == '__main__':
    local_ip = get_local_ip()
    server_address = ('0.0.0.0', PORT)
    httpd = ThreadedHTTPServer(server_address, SangaloHandler)
    print(f"=== सँगालो (Sangalo) Family Companion Server ===")
    print(f"• Local access:  http://localhost:{PORT}")
    print(f"• Family Wi-Fi:  http://{local_ip}:{PORT}")
    apk_path, _ = get_active_apk()
    if apk_path:
        print(f"• APK Download:  http://{local_ip}:{PORT}/download")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
