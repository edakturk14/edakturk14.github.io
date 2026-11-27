"""Serve this static app without exposing the rest of the repository or .git."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


class PublicFiles(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self._private_path():
            self.send_error(404)
            return
        super().do_GET()

    def do_HEAD(self):
        if self._private_path():
            self.send_error(404)
            return
        super().do_HEAD()

    def _private_path(self):
        parts = Path(unquote(urlsplit(self.path).path)).parts
        return any(part.startswith('.') or part in {'scripts', 'README.md'} for part in parts if part != '/')

    def list_directory(self, path):
        self.send_error(404)
        return None


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=3000)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    server = ThreadingHTTPServer(('0.0.0.0', args.port), partial(PublicFiles, directory=str(root)))
    print(f'Desert Reverie serving on port {args.port}', flush=True)
    server.serve_forever()
