#!/usr/bin/env python3
"""Generate a subtle ambient bed for the explainer. No external samples.

Reads duration from script.json; writes public/audio/bed.wav.
"""
import json
import wave
from pathlib import Path

try:
    import numpy as np
except ImportError:
    raise SystemExit("numpy is required: python3 -m pip install numpy")

ROOT = Path(__file__).resolve().parents[1]
CFG = json.loads((ROOT / "script.json").read_text(encoding="utf-8"))
DUR = float(CFG.get("duration", 30))
SR = 44100
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)

# Warm, slightly unresolved chords. Times are relative to a 30s cut.
BASE_CHORDS = [
    (0.0, 7.2, [130.81, 155.56, 196.00, 233.08]),   # Cm
    (6.6, 12.4, [103.83, 130.81, 155.56, 196.00]),  # Ab
    (11.8, 19.2, [87.31, 103.83, 130.81, 155.56]),  # Fm
    (18.6, 25.2, [77.78, 98.00, 116.54, 155.56]),   # Eb
    (24.6, 30.0, [65.41, 98.00, 130.81, 155.56]),   # C
]
scale = DUR / 30.0
CHORDS = [(a * scale, min(DUR, b * scale), freqs) for a, b, freqs in BASE_CHORDS]

left = np.zeros(N)
right = np.zeros(N)
for start, end, freqs in CHORDS:
    a = int(start * SR)
    b = min(N, int(end * SR))
    local_t = t[a:b] - start
    fade = np.minimum(1.0, np.minimum(local_t / 1.6, (end - start - local_t) / 1.6))
    fade = np.clip(fade, 0.0, 1.0) ** 1.5
    for idx, f in enumerate(freqs):
        phase = rng.uniform(0, 2 * np.pi)
        tone = (
            np.sin(2 * np.pi * f * local_t + phase)
            + 0.32 * np.sin(2 * np.pi * f * 2.002 * local_t + phase * 0.7)
            + 0.12 * np.sin(2 * np.pi * f * 0.501 * local_t + phase * 1.3)
        )
        pan = 0.5 + 0.22 * np.sin(idx * 1.9 + 0.4)
        amp = 0.055 * fade
        left[a:b] += tone * amp * np.sqrt(1 - pan)
        right[a:b] += tone * amp * np.sqrt(pan)

# Soft filtered air, like distant traffic.
noise = rng.normal(0, 1, (N, 2))
spec = np.fft.rfft(noise, axis=0)
freqs = np.fft.rfftfreq(N, 1 / SR)
mask = np.exp(-0.5 * ((np.log(np.maximum(freqs, 1)) - np.log(550)) / 0.55) ** 2)
spec *= mask[:, None]
air = np.fft.irfft(spec, n=N, axis=0)
air = air / (np.max(np.abs(air)) + 1e-9) * 0.035
left += air[:, 0]
right += air[:, 1]

# Slow breathing and global fades.
swell = 0.82 + 0.18 * np.sin(2 * np.pi * 0.045 * t - 0.7)
left *= swell
right *= swell
fade_in = np.clip(t / 1.8, 0, 1) ** 1.4
fade_out = np.clip((DUR - t) / 2.4, 0, 1) ** 1.2
left *= fade_in * fade_out
right *= fade_in * fade_out

# Gentle high-pass to keep the low end clean on small speakers.
def highpass(x, alpha=0.996):
    y = np.empty_like(x)
    prev_x = 0.0
    prev_y = 0.0
    for i in range(x.shape[0]):
        prev_y = alpha * (prev_y + x[i] - prev_x)
        prev_x = x[i]
        y[i] = prev_y
    return y

left = highpass(left)
right = highpass(right)
peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
left = left / peak * 0.775
right = right / peak * 0.775

stereo = np.stack([left, right], axis=1)
pcm = np.clip(stereo * 32767, -32768, 32767).astype("<i2")
out = ROOT / "public" / "audio" / "bed.wav"
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", out, out.stat().st_size, "bytes")
