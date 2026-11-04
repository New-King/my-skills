#!/usr/bin/env python3
"""Sentence-by-sentence TTS + word-level timing for a Remotion explainer.

Reads script.json, writes public/audio/s*.wav and src/timing.json.
Requires: edge-tts, and macOS `afconvert` (or ffmpeg on PATH).
"""
import asyncio
import json
import shutil
import subprocess
import sys
import wave
from array import array
from pathlib import Path

try:
    import edge_tts
except ImportError:
    raise SystemExit(
        "edge-tts is not installed. Run:\n"
        "  python3 -m venv .venv-tts\n"
        "  .venv-tts/bin/pip install edge-tts\n"
        "  .venv-tts/bin/python scripts/tts.py"
    )

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "script.json"
AUDIO_DIR = ROOT / "public" / "audio"
TIMING_PATH = ROOT / "src" / "timing.json"
NARRATION_PATH = ROOT / "NARRATION.md"


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise SystemExit(f"missing {CONFIG_PATH}")
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return round(w.getnframes() / w.getframerate(), 3)


def to_wav(src: Path, dst: Path) -> None:
    if shutil.which("afconvert"):
        subprocess.run(
            ["afconvert", "-f", "WAVE", "-d", "LEI16@24000", str(src), str(dst)],
            check=True,
            capture_output=True,
        )
        return
    if shutil.which("ffmpeg"):
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(src),
             "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(dst)],
            check=True,
        )
        return
    raise SystemExit("need afconvert (macOS) or ffmpeg to convert TTS audio")


def trim_wav(path: Path, start: float, end: float) -> float:
    with wave.open(str(path), "rb") as w:
        params = w.getparams()
        rate = w.getframerate()
        samples = array("h")
        samples.frombytes(w.readframes(w.getnframes()))
    a = max(0, int(start * rate))
    b = min(len(samples), int(end * rate))
    samples = samples[a:b]
    with wave.open(str(path), "wb") as w:
        w.setnchannels(params.nchannels)
        w.setsampwidth(params.sampwidth)
        w.setframerate(rate)
        w.writeframes(samples.tobytes())
    return round((b - a) / rate, 3)


def apply_gain(path: Path, gain: float) -> None:
    with wave.open(str(path), "rb") as w:
        params = w.getparams()
        samples = array("h")
        samples.frombytes(w.readframes(w.getnframes()))
    for i, sample in enumerate(samples):
        samples[i] = max(-32768, min(32767, int(sample * gain)))
    with wave.open(str(path), "wb") as w:
        w.setnchannels(params.nchannels)
        w.setsampwidth(params.sampwidth)
        w.setframerate(params.framerate)
        w.writeframes(samples.tobytes())


async def synth(scene: dict, voice: str, rate: str, gain: float, tail: float) -> dict:
    scene_id = scene["id"]
    text = scene["text"]
    mp3 = AUDIO_DIR / f"{scene_id}.mp3"
    wav = AUDIO_DIR / f"{scene_id}.wav"
    words = []

    communicate = edge_tts.Communicate(
        text, voice, rate=rate, boundary="WordBoundary"
    )
    with mp3.open("wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 10_000_000
                end = start + chunk["duration"] / 10_000_000
                words.append(
                    {"text": chunk["text"], "start": round(start, 3), "end": round(end, 3)}
                )

    if not words:
        raise SystemExit(
            f"{scene_id}: TTS returned no WordBoundary events. "
            "Check edge-tts version (>=7) and network access."
        )

    to_wav(mp3, wav)
    raw_duration = wav_duration(wav)
    start_at = max(0, words[0]["start"] - 0.06)
    end_at = min(raw_duration, words[-1]["end"] + tail)
    duration = trim_wav(wav, start_at, end_at)
    apply_gain(wav, gain)

    for w in words:
        w["start"] = round(max(0, w["start"] - start_at), 3)
        w["end"] = round(min(duration, max(0, w["end"] - start_at)), 3)
    mp3.unlink(missing_ok=True)
    return {
        "id": scene_id,
        "text": text,
        "audio": f"audio/{scene_id}.wav",
        "duration": duration,
        "words": words,
    }


def fmt(t: float) -> str:
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


async def main() -> None:
    cfg = load_config()
    scenes_cfg = cfg.get("scenes", [])
    if not scenes_cfg:
        raise SystemExit("script.json has no scenes")

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    voice = cfg.get("voice", "zh-CN-XiaoxiaoNeural")
    rate = cfg.get("rate", "+5%")
    gain = float(cfg.get("gain", 1.55))
    lead = float(cfg.get("lead", 0.45))
    gap = float(cfg.get("gap", 0.28))
    tail = float(cfg.get("tail", 0.22))
    total = float(cfg.get("duration", 30))
    fps = int(cfg.get("fps", 30))

    scenes = []
    for item in scenes_cfg:
        scene = await synth(item, voice, rate, gain, tail)
        print(f'{scene["id"]}: {scene["duration"]}s, {len(scene["words"])} words')
        scenes.append(scene)

    cursor = lead
    for scene in scenes:
        scene["start"] = round(cursor, 3)
        cursor += scene["duration"] + gap
    ends_at = round(cursor - gap, 3)
    timing = {
        "fps": fps,
        "lead": lead,
        "gap": gap,
        "total": total,
        "endsAt": ends_at,
        "scenes": scenes,
    }
    TIMING_PATH.write_text(json.dumps(timing, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = ["# 配音与分镜", "", "| 场景 | 开始 | 文案 |", "| --- | --- | --- |"]
    for scene in scenes:
        lines.append(f'| {scene["id"]} | {fmt(scene["start"])} | {scene["text"]} |')
    lines += ["", f"最后一句结束：{fmt(ends_at)}；目标总长：{total:g}s。", ""]
    NARRATION_PATH.write_text("\n".join(lines), encoding="utf-8")

    print(f"speech ends at {ends_at:g}s / target {total:g}s")
    if ends_at > total - 0.3:
        print("WARNING: speech is too close to the end; shorten the script.", file=sys.stderr)


if __name__ == "__main__":
    asyncio.run(main())
