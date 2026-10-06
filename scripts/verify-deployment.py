"""Read back the published commit and every static file without downloading archives."""
import hashlib
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

spec = spec_from_file_location("preview_build", Path(__file__).with_name("build-preview.py"))
build = module_from_spec(spec)
spec.loader.exec_module(build)


def fetch(url):
    request = urllib.request.Request(url, headers={"Cache-Control": "no-cache"})
    with urllib.request.urlopen(request, timeout=15) as response:
        return response.read()


if __name__ == "__main__":
    base = os.environ["PREVIEW_URL"].rstrip("/") + "/"
    commit = os.environ["GITHUB_SHA"]
    run_id = os.environ["GITHUB_RUN_ID"]
    query = urllib.parse.urlencode({"commit": commit, "run": run_id})
    url = urllib.parse.urljoin(base, "deployment.json") + "?" + query
    for attempt in range(8):
        try:
            manifest = json.loads(fetch(url))
            if manifest.get("commit") == commit and manifest.get("run_id") == run_id:
                break
        except (urllib.error.URLError, json.JSONDecodeError):
            pass
        if attempt == 7:
            raise SystemExit("The public preview does not identify the expected deployment.")
        time.sleep(5)
    expected = build.source_hashes()
    if manifest.get("files") != expected or manifest.get("data") != "fictional-demo-only":
        raise SystemExit("The published manifest does not match the tested static package.")
    for name, digest in expected.items():
        public = fetch(urllib.parse.urljoin(base, name) + "?" + query)
        if hashlib.sha256(public).hexdigest() != digest:
            raise SystemExit(f"Public file does not match the tested commit: {name}")
    print(f"Verified public commit {commit}, run {run_id}, and {len(expected)} static file hashes.")
