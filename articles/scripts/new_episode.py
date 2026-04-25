#!/usr/bin/env python3

import argparse
import html
import json
import re
import sys
import urllib.request
from datetime import datetime, timedelta
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


DOWNLOAD_BASE_URL = "https://download.binaergewitter.de"

BASENAME_RE = re.compile(
    r"^(?P<audio_date>\d{4}-\d{2}-\d{2})\.Binaergewitter\.Talk\.(?P<number>\d+)$"
)

OLD_BASENAME_RE = re.compile(
    r"\d{4}-\d{2}-\d{2}\.Binaergewitter\.Talk\.\d+"
)

DEFAULT_VOICE_KEYS = [
    "l33tname",
    "madmas",
    "ingo",
    "felix",
    "sebastian",
]

# Anpassen, falls die HTML/JSON-Speaker anders benannt sind.
SPEAKER_TO_VOICE_ALIAS = {
    "l33tname": "l33tname",
    "leetname": "l33tname",

    # In eurem Beispiel ist Markus in YAML offenbar "madmas".
    "markus": "madmas",
    "madmas": "madmas",

    "ingo": "ingo",

    "felix": "felix",

    "sebastian": "sebastian",
}


def fail(message: str) -> None:
    print(f"Fehler: {message}", file=sys.stderr)
    sys.exit(1)


def warn(message: str) -> None:
    print(f"Warnung: {message}", file=sys.stderr)


def yaml_double_quote(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def normalize_key(value: str) -> str:
    value = html.unescape(value).strip().lower()
    value = value.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    value = re.sub(r"[^a-z0-9]+", "", value)
    return value


def fetch_text(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "binaergewitter-new-episode-script/1.0",
        },
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, errors="replace")


def fetch_json(url: str) -> Any:
    return json.loads(fetch_text(url))


class EpisodeHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title_parts: list[str] = []
        self.heading_parts: list[str] = []
        self.meta_titles: list[str] = []
        self.speakers: list[str] = []

        self._in_title = False
        self._heading_depth = 0
        self._speaker_depth = 0

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {key.lower(): value or "" for key, value in attrs_list}
        tag = tag.lower()

        if tag == "title":
            self._in_title = True

        if tag in {"h1", "h2"}:
            self._heading_depth += 1

        if tag == "meta":
            meta_name = attrs.get("name", "").lower()
            meta_property = attrs.get("property", "").lower()
            content = attrs.get("content", "")

            if content and meta_name in {"title", "twitter:title"}:
                self.meta_titles.append(content)

            if content and meta_property in {"og:title"}:
                self.meta_titles.append(content)

        data_speaker = attrs.get("data-speaker")
        if data_speaker:
            self.speakers.append(data_speaker)

        css_class = attrs.get("class", "").lower()
        if "speaker" in css_class:
            self._speaker_depth += 1

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()

        if tag == "title":
            self._in_title = False

        if tag in {"h1", "h2"} and self._heading_depth:
            self._heading_depth -= 1

        if self._speaker_depth:
            self._speaker_depth -= 1

    def handle_data(self, data: str) -> None:
        data = data.strip()
        if not data:
            return

        if self._in_title:
            self.title_parts.append(data)

        if self._heading_depth:
            self.heading_parts.append(data)

        if self._speaker_depth:
            self.speakers.append(data)


def decode_json_string(value: str) -> str:
    try:
        return json.loads(f'"{value}"')
    except json.JSONDecodeError:
        return value


def extract_title_candidates_from_html(html_text: str) -> list[str]:
    parser = EpisodeHTMLParser()
    parser.feed(html_text)

    candidates: list[str] = []

    candidates.extend(parser.meta_titles)
    candidates.extend(parser.heading_parts)

    if parser.title_parts:
        candidates.append(" ".join(parser.title_parts))

    # Häufige JSON-Felder in eingebetteten Scripts.
    for match in re.finditer(
        r'"(?:episode_?title|podcast_?title|title|name)"\s*:\s*"((?:\\.|[^"\\])*)"',
        html_text,
        flags=re.IGNORECASE,
    ):
        candidates.append(decode_json_string(match.group(1)))

    cleaned: list[str] = []
    seen: set[str] = set()

    for candidate in candidates:
        candidate = normalize_space(candidate)
        candidate = re.sub(r"\s*[-|–]\s*Auphonic.*$", "", candidate, flags=re.IGNORECASE)
        candidate = candidate.strip()

        if not candidate:
            continue

        key = candidate.lower()
        if key in seen:
            continue

        seen.add(key)
        cleaned.append(candidate)

    return cleaned


def is_generic_title(value: str) -> bool:
    normalized = value.strip().lower()
    return normalized in {
        "auphonic transcript editor",
        "transcript editor",
        "auphonic",
    }


def choose_episode_title_suffix(html_text: str, episode_number: str) -> str | None:
    candidates = extract_title_candidates_from_html(html_text)

    ranked: list[tuple[int, str]] = []

    for candidate in candidates:
        if is_generic_title(candidate):
            continue

        score = 0

        if episode_number in candidate:
            score += 10

        if "binärgewitter" in candidate.lower() or "binaergewitter" in candidate.lower():
            score += 8

        if "talk" in candidate.lower():
            score += 4

        if ":" in candidate:
            score += 2

        if "auphonic" in candidate.lower():
            score -= 20

        ranked.append((score, candidate))

    if not ranked:
        return None

    ranked.sort(reverse=True)
    best = ranked[0][1]

    patterns = [
        rf"^Bin(?:ä|ae|a)rgewitter\s+Talk\s+#?\s*{re.escape(episode_number)}\s*[:\-–]\s*(.+)$",
        rf"^Talk\s+#?\s*{re.escape(episode_number)}\s*[:\-–]\s*(.+)$",
        rf"^#?\s*{re.escape(episode_number)}\s*[:\-–]\s*(.+)$",
    ]

    for pattern in patterns:
        match = re.match(pattern, best, flags=re.IGNORECASE)
        if match:
            return normalize_space(match.group(1))

    # Wenn die HTML-Seite nur den reinen Episodentitel enthält.
    if "binärgewitter" not in best.lower() and "binaergewitter" not in best.lower():
        return best

    return None


def extract_speakers_from_html(html_text: str) -> list[str]:
    parser = EpisodeHTMLParser()
    parser.feed(html_text)

    speakers: list[str] = list(parser.speakers)

    # Häufige JSON-Felder in eingebetteten Scripts.
    for match in re.finditer(
        r'"speaker"\s*:\s*"((?:\\.|[^"\\])*)"',
        html_text,
        flags=re.IGNORECASE,
    ):
        speakers.append(decode_json_string(match.group(1)))

    # data-speaker="..."
    for match in re.finditer(
        r'data-speaker=["\']([^"\']+)["\']',
        html_text,
        flags=re.IGNORECASE,
    ):
        speakers.append(match.group(1))

    return unique_clean_names(speakers)


def extract_speakers_from_speech_json(data: Any) -> list[str]:
    speakers: list[str] = []

    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and item.get("speaker"):
                speakers.append(str(item["speaker"]))

    return unique_clean_names(speakers)


def unique_clean_names(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()

    for value in values:
        value = normalize_space(value)

        if not value:
            continue

        # Typische Fehlgriffe aus UI-Texten vermeiden.
        if value.lower() in {"speaker", "speakers", "sprecher", "unknown"}:
            continue

        key = normalize_key(value)
        if not key or key in seen:
            continue

        seen.add(key)
        result.append(value)

    return result


def split_frontmatter(text: str) -> tuple[str, str]:
    if not text.startswith("---\n"):
        fail("Die Vorlagen-Datei beginnt nicht mit YAML-Frontmatter.")

    end = text.find("\n---", 4)
    if end == -1:
        fail("YAML-Frontmatter konnte nicht geschlossen werden.")

    frontmatter = text[: end + len("\n---")]
    body = text[end + len("\n---") :]
    return frontmatter, body


def find_latest_markdown(posts_dir: Path) -> Path:
    candidates = list(posts_dir.glob("*.md")) + list(posts_dir.glob("*.markdown"))

    if not candidates:
        fail(f"Keine Markdown-Dateien in {posts_dir} gefunden.")

    def sort_key(path: Path):
        text = path.read_text(encoding="utf-8")

        match = re.search(
            r"(?m)^date:\s*(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}:\d{2}))?",
            text[:3000],
        )
        if match:
            return match.group(1), match.group(2) or "00:00:00", path.name

        match = re.match(r"(\d{4}-\d{2}-\d{2})", path.name)
        if match:
            return match.group(1), "00:00:00", path.name

        return "0000-00-00", "00:00:00", path.name

    return max(candidates, key=sort_key)


def make_output_filename(
    posts_dir: Path,
    extension: str,
    post_date: str,
    episode_number: str,
) -> Path:
    filename = f"{post_date}-binaergewitter-talk-number-{episode_number}{extension}"
    return posts_dir / filename


def replace_or_insert_frontmatter_line(frontmatter: str, key: str, line: str) -> str:
    if re.search(rf"(?m)^{re.escape(key)}:\s*", frontmatter):
        return re.sub(rf"(?m)^{re.escape(key)}:\s*.*$", line, frontmatter)

    return frontmatter.replace("---\n", f"---\n{line}\n", 1)


def update_frontmatter_basic(
    frontmatter: str,
    episode_number: str,
    post_date: str,
    post_time: str,
    title_suffix: str,
) -> str:
    title = f'Binärgewitter Talk #{episode_number}: {title_suffix}'

    frontmatter = replace_or_insert_frontmatter_line(
        frontmatter,
        "title",
        f'title: "{yaml_double_quote(title)}"',
    )

    frontmatter = replace_or_insert_frontmatter_line(
        frontmatter,
        "date",
        f"date: {post_date} {post_time}",
    )

    return frontmatter


def extract_voice_keys(frontmatter: str) -> list[str]:
    lines = frontmatter.splitlines()
    keys: list[str] = []

    in_voices = False

    for line in lines:
        if line.strip() == "voices:":
            in_voices = True
            continue

        if in_voices:
            if line.startswith("  ") or line.startswith("\t"):
                match = re.match(r"\s+([A-Za-z0-9_-]+):", line)
                if match:
                    keys.append(match.group(1))
            else:
                break

    return keys or DEFAULT_VOICE_KEYS


def speaker_to_voice_key(speaker: str, voice_keys: list[str]) -> str | None:
    normalized_voice_keys = {
        normalize_key(voice_key): voice_key
        for voice_key in voice_keys
    }

    speaker_key = normalize_key(speaker)

    if speaker_key in normalized_voice_keys:
        return normalized_voice_keys[speaker_key]

    alias = SPEAKER_TO_VOICE_ALIAS.get(speaker_key)
    if alias and alias in voice_keys:
        return alias

    return None


def replace_voices_block(frontmatter: str, speakers: list[str]) -> str:
    voice_keys = extract_voice_keys(frontmatter)

    active_voice_keys: set[str] = set()
    unknown_speakers: list[str] = []

    for speaker in speakers:
        voice_key = speaker_to_voice_key(speaker, voice_keys)
        if voice_key:
            active_voice_keys.add(voice_key)
        else:
            unknown_speakers.append(speaker)

    if unknown_speakers:
        warn(
            "Keine YAML-Voice-Zuordnung für Sprecher: "
            + ", ".join(sorted(unknown_speakers))
        )

    new_block = "voices:\n" + "\n".join(
        f"  {voice_key}: {'true' if voice_key in active_voice_keys else 'false'}"
        for voice_key in voice_keys
    )

    lines = frontmatter.splitlines()
    start = None

    for index, line in enumerate(lines):
        if line.strip() == "voices:":
            start = index
            break

    if start is None:
        return frontmatter.replace("\n---", f"\n{new_block}\n---", 1)

    end = start + 1
    while end < len(lines) and (lines[end].startswith("  ") or lines[end].startswith("\t")):
        end += 1

    updated_lines = lines[:start] + new_block.splitlines() + lines[end:]
    return "\n".join(updated_lines)


def clear_body_to_skeleton(body: str) -> str:
    headings = [
        line.rstrip()
        for line in body.splitlines()
        if re.match(r"^#{2,6}\s+", line)
    ]

    result = "\nTODO\n"

    for heading in headings:
        result += f"\n{heading}\n"

    return result + "\n"


def load_remote_episode_info(
    basename: str,
    episode_number: str,
    download_base_url: str,
) -> tuple[str | None, list[str]]:
    episode_url_base = f"{download_base_url.rstrip('/')}/{basename}"

    html_url = f"{episode_url_base}.html"
    speech_json_url = f"{episode_url_base}-speech.json"

    title_suffix: str | None = None
    speakers: list[str] = []

    try:
        html_text = fetch_text(html_url)
        title_suffix = choose_episode_title_suffix(html_text, episode_number)
        speakers = extract_speakers_from_html(html_text)
    except Exception as error:
        warn(f"Konnte HTML nicht auslesen: {html_url} ({error})")

    if not speakers:
        try:
            speech_json = fetch_json(speech_json_url)
            speakers = extract_speakers_from_speech_json(speech_json)
        except Exception as error:
            warn(f"Konnte Speech-JSON nicht auslesen: {speech_json_url} ({error})")

    return title_suffix, speakers


def main() -> None:
    default_posts_dir = Path("_posts") if Path("_posts").is_dir() else Path(".")

    parser = argparse.ArgumentParser(
        description="Erzeugt aus der letzten Binärgewitter-Markdown-Datei eine neue Episode."
    )
    parser.add_argument(
        "basename",
        help="Podcast-Basisname, z. B. 2026-04-03.Binaergewitter.Talk.378",
    )
    parser.add_argument(
        "--posts-dir",
        default=str(default_posts_dir),
        help="Verzeichnis mit Markdown-Posts. Default: _posts falls vorhanden, sonst aktuelles Verzeichnis.",
    )
    parser.add_argument(
        "--source",
        help="Explizite Vorlagen-Datei. Default: neueste Markdown-Datei im posts-dir.",
    )
    parser.add_argument(
        "--title",
        help='Titelteil nach dem Doppelpunkt. Default: aus HTML, sonst "TODO".',
    )
    parser.add_argument(
        "--download-base-url",
        default=DOWNLOAD_BASE_URL,
        help=f"Download-Basis-URL. Default: {DOWNLOAD_BASE_URL}",
    )
    parser.add_argument(
        "--no-fetch",
        action="store_true",
        help="Keine Metadaten aus HTML/JSON laden.",
    )
    parser.add_argument(
        "--publish-date",
        help="Veröffentlichungsdatum YYYY-MM-DD. Default: Audio-Datum + 1 Tag.",
    )
    parser.add_argument(
        "--time",
        default="15:00:00",
        help="Veröffentlichungszeit. Default: 15:00:00.",
    )
    parser.add_argument(
        "--clear-body",
        action="store_true",
        help="Body leeren und nur Überschriften als Skelett behalten.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Zieldatei überschreiben, falls sie existiert.",
    )

    args = parser.parse_args()

    basename_match = BASENAME_RE.match(args.basename)
    if not basename_match:
        fail(
            "Basename muss dem Format YYYY-MM-DD.Binaergewitter.Talk.NUMMER entsprechen."
        )

    audio_date = datetime.strptime(
        basename_match.group("audio_date"), "%Y-%m-%d"
    ).date()
    episode_number = basename_match.group("number")

    post_date = args.publish_date or str(audio_date + timedelta(days=1))

    posts_dir = Path(args.posts_dir)
    if not posts_dir.is_dir():
        fail(f"Posts-Verzeichnis existiert nicht: {posts_dir}")

    source = Path(args.source) if args.source else find_latest_markdown(posts_dir)
    if not source.is_file():
        fail(f"Vorlagen-Datei existiert nicht: {source}")

    remote_title_suffix: str | None = None
    remote_speakers: list[str] = []

    if not args.no_fetch:
        remote_title_suffix, remote_speakers = load_remote_episode_info(
            basename=args.basename,
            episode_number=episode_number,
            download_base_url=args.download_base_url,
        )

    title_suffix = args.title or remote_title_suffix or "TODO"

    text = source.read_text(encoding="utf-8")

    old_basenames = sorted(set(OLD_BASENAME_RE.findall(text)))
    if not old_basenames:
        fail("Kein alter Podcast-Basisname in der Vorlage gefunden.")

    for old_basename in old_basenames:
        text = text.replace(old_basename, args.basename)

    frontmatter, body = split_frontmatter(text)

    frontmatter = update_frontmatter_basic(
        frontmatter=frontmatter,
        episode_number=episode_number,
        post_date=post_date,
        post_time=args.time,
        title_suffix=title_suffix,
    )

    if remote_speakers:
        frontmatter = replace_voices_block(frontmatter, remote_speakers)
    else:
        warn("Keine Sprecher gefunden; voices-Block bleibt aus der Vorlage erhalten.")

    if args.clear_body:
        body = clear_body_to_skeleton(body)

    new_text = frontmatter + body

    target = make_output_filename(
        posts_dir=posts_dir,
        extension=source.suffix,
        post_date=post_date,
        episode_number=episode_number,
    )

    if target.exists() and not args.force:
        fail(f"Zieldatei existiert bereits: {target}. Mit --force überschreiben.")

    target.write_text(new_text, encoding="utf-8")

    print(f"Vorlage: {source}")
    print(f"Erzeugt: {target}")
    print(f"Titel: Binärgewitter Talk #{episode_number}: {title_suffix}")

    if remote_speakers:
        print("Sprecher: " + ", ".join(remote_speakers))


if __name__ == "__main__":
    main()
