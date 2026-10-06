"""Package only the static preview files on a GitHub runner."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parent.parent
STATIC_FILES = (
    "index.html",
    "design-preview/index.html", "design-preview/app.js", "design-preview/styles.css",
    "design-preview/assets/OFL-Onest.txt", "design-preview/assets/amg-logo-white.webp",
    "design-preview/assets/favicon.svg", "design-preview/assets/onest-cyrillic.woff2",
    "design-preview/assets/onest-ext.woff2", "design-preview/assets/onest-latin.woff2",
)


def source_hashes():
    hashes = {}
    for name in STATIC_FILES:
        source = ROOT / name
        if source.is_symlink() or not source.is_file():
            raise RuntimeError(f"Expected a regular static file: {name}")
        hashes[name] = hashlib.sha256(source.read_bytes()).hexdigest()
    return hashes


if __name__ == "__main__":
    commit = os.environ.get("GITHUB_SHA", "")
    if os.environ.get("GITHUB_ACTIONS") != "true" or not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise SystemExit("Build the preview in GitHub Actions; no local build output is needed.")
    destination = ROOT / "_site"
    destination.mkdir(exist_ok=False)
    hashes = source_hashes()
    for name in STATIC_FILES:
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / name, target)
    manifest = {
        "commit": commit,
        "run_id": os.environ["GITHUB_RUN_ID"],
        "run_attempt": os.environ["GITHUB_RUN_ATTEMPT"],
        "data": "fictional-demo-only",
        "files": hashes,
    }
    (destination / "deployment.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Packaged {len(hashes)} static files for {commit}; excluded test output and dependencies.")
