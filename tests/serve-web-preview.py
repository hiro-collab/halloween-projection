"""Developer-only loopback static QA server; never serves repository files."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import argparse
import mimetypes
import json
import threading
import sys

parser = argparse.ArgumentParser()
parser.add_argument('directory', type=Path)
parser.add_argument('--port', type=int, default=0)
parser.add_argument('--stdin-control', action='store_true')
args = parser.parse_args()
folder = args.directory.resolve(strict=True)
allowed = {'index.html', 'styles.css', 'app.js', 'offline.js', 'sw.js', 'README.txt', 'LICENSE.txt', 'RIGHTS.txt', 'control-api.js', 'bat-motion.js', 'bat-art.js', 'bat-fire.js', 'assets/owner-bat-atlas.png', 'assets/OWNER-BAT-ASSET.txt'}
csp = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"

class Handler(BaseHTTPRequestHandler):
    def setup(self):
        # An idle Chrome preconnect must not block other approved static reads.
        self.request.settimeout(10)
        super().setup()

    def do_GET(self):
        path = self.path
        if path == '/web-preview/':
            name = 'index.html'
        elif path.startswith('/web-preview/'):
            name = path[len('/web-preview/'):]
        else:
            name = ''
        if name not in allowed:
            self.send_error(404)
            return
        content = (folder / name).read_bytes()
        mime = 'text/javascript' if name.endswith('.js') else mimetypes.guess_type(name)[0] or 'text/plain'
        self.send_response(200)
        self.send_header('Content-Type', mime + '; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Security-Policy', csp)
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('Cross-Origin-Resource-Policy', 'same-origin')
        self.send_header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), fullscreen=(self)')
        if name == 'sw.js':
            self.send_header('Service-Worker-Allowed', '/web-preview/')
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, *_):
        pass

server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
print(json.dumps({'url':f'http://127.0.0.1:{server.server_port}/web-preview/','pid':__import__('os').getpid()}), flush=True)
if args.stdin_control:
    def stop_input():
        for line in sys.stdin:
            if line.strip() == 'quit':
                server.shutdown()
                break
    threading.Thread(target=stop_input,daemon=True).start()
try:
    server.serve_forever()
finally:
    server.server_close()
