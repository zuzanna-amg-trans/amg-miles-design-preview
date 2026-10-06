"""Local-only server for the independent AMG Miles visual prototype."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Robots-Tag", "noindex, nofollow")
        super().end_headers()


if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    server = ThreadingHTTPServer(("127.0.0.1", 4318), partial(PreviewHandler, directory=str(root)))
    print("AMG Miles design preview: http://127.0.0.1:4318", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
