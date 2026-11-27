"""Regression checks for Safari video ranges and private-file handling."""
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.error import HTTPError
from urllib.request import Request, urlopen
import unittest

from serve import PublicFiles


class QuietFiles(PublicFiles):
    def log_message(self, *args):
        pass


class StaticServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root = Path(__file__).resolve().parents[1]
        cls.video = (cls.root / 'assets/trailer.mp4').read_bytes()
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietFiles, directory=str(cls.root)))
        cls.thread = Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f'http://127.0.0.1:{cls.server.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def test_safari_two_byte_probe(self):
        with urlopen(Request(self.base + '/assets/trailer.mp4', headers={'Range': 'bytes=0-1'})) as response:
            self.assertEqual(response.status, 206)
            self.assertEqual(response.headers['Content-Range'], f'bytes 0-1/{len(self.video)}')
            self.assertEqual(response.headers['Content-Length'], '2')
            self.assertEqual(response.read(), self.video[:2])

    def test_open_ended_and_suffix_ranges(self):
        for value in [f'bytes={len(self.video)-4}-', 'bytes=-4']:
            with self.subTest(value=value), urlopen(Request(self.base + '/assets/trailer.mp4', headers={'Range': value})) as response:
                self.assertEqual(response.status, 206)
                self.assertEqual(response.read(), self.video[-4:])

    def test_unsatisfiable_range(self):
        with self.assertRaises(HTTPError) as error:
            urlopen(Request(self.base + '/assets/trailer.mp4', headers={'Range': f'bytes={len(self.video)}-'}))
        self.assertEqual(error.exception.code, 416)
        self.assertEqual(error.exception.headers['Content-Range'], f'bytes */{len(self.video)}')

    def test_normal_video_request(self):
        with urlopen(self.base + '/assets/trailer.mp4') as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(response.read(), self.video)

    def test_conditional_range_falls_back_to_complete_video(self):
        for validator in ['"outdated-film"', 'Wed, 01 Jan 2020 00:00:00 GMT']:
            with self.subTest(validator=validator), urlopen(Request(self.base + '/assets/trailer.mp4', headers={'Range': 'bytes=5-', 'If-Range': validator})) as response:
                self.assertEqual(response.status, 200)
                self.assertEqual(response.read(), self.video)

    def test_private_files_and_directory_listing_not_served(self):
        for path in ['/scripts/serve.py', '/%2egit/config', '/README.md', '/assets/']:
            with self.subTest(path=path), self.assertRaises(HTTPError) as error:
                urlopen(self.base + path)
            self.assertEqual(error.exception.code, 404)

    def test_homepage_serves(self):
        with urlopen(self.base + '/') as response:
            self.assertEqual(response.status, 200)
            self.assertIn(b'DESERT', response.read())


if __name__ == '__main__':
    unittest.main()
