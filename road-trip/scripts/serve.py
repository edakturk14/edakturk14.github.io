"""Serve this static app without exposing the rest of the repository or .git."""
import argparse
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


class PublicFiles(SimpleHTTPRequestHandler):
    def send_head(self):
        self._range_end = None
        # Safari probes MP4s with bytes=0-1 before playing them. The standard
        # library server ignores Range, so handle single video byte ranges.
        header = self.headers.get('Range', '')
        path = Path(self.translate_path(self.path))
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', header)
        if self.command != 'GET' or path.suffix.lower() != '.mp4' or not match:
            return super().send_head()
        try:
            stream = path.open('rb')
        except OSError:
            self.send_error(404)
            return None
        size = path.stat().st_size
        first, last = match.groups()
        start = int(first) if first else max(0, size - int(last or '0'))
        end = min(int(last), size - 1) if first and last else size - 1
        if start >= size or start > end or (not first and not last):
            stream.close()
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        stream.seek(start)
        self._range_end = end
        self.send_response(206)
        self.send_header('Content-Type', 'video/mp4')
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        return stream

    def copyfile(self, source, outputfile):
        if self._range_end is None:
            return super().copyfile(source, outputfile)
        remaining = self._range_end - source.tell() + 1
        while remaining > 0:
            chunk = source.read(min(65536, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)

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
