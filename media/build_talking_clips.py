#!/usr/bin/env python3
"""Build the talking speaker clips (Kling 3.0, lip-synced) for Pages 6 and 9.

Each source clip says one line from app/src/sim/content.ts in the character's own (Kling) voice. For each:
- video and audio are cut at the same points (just before the first word, just after the last), so the
  lips stay in sync with the recording;
- the video is cropped to the framing the page already uses, found by matching the earlier presence
  clip's first frame, then saved muted as app/public/speakers/<name>.mp4 with <name>_start/_end.webp;
- the audio becomes the line's recording in app/public/voice (two-pass loudnorm to -16 LUFS / -1.5 dBTP,
  48 kHz mono, MP3 160k plus Opus 64k), which the app plays and starts the clip with.

Sources: media/talking/<name>.mp4 (the Higgsfield downloads; not committed).
Run: python3 media/build_talking_clips.py [name ...]    Needs ffmpeg, numpy and Pillow.
Bump VERSION in app/public/sw.js afterwards: the voice files keep their names.
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = f"{ROOT}/media/talking"
SPEAKERS = f"{ROOT}/app/public/speakers"
VOICE = f"{ROOT}/app/public/voice"

# name: (voice file, output size, earlier presence frame whose framing the crop matches)
CLIPS = {
    "regulator_talk": ("char_regulator", (1280, 720), "regulator_start.webp"),
    "employee_talk": ("char_employee", (720, 1280), "employee_start.webp"),
    "journalist_talk": ("char_journalist", (720, 1280), "journalist_start.webp"),
    "family_talk": ("char_family", (720, 1280), "family_start.webp"),
    "board_chair_q1_relationship": ("qa_q1_relationship", (720, 720), "board_chair_start.webp"),
    "board_chair_q1_compliance": ("qa_q1_compliance", (720, 720), "board_chair_start.webp"),
    "independent_director_q2": ("qa_q2", (720, 720), "independent_director_start.webp"),
}
LEAD = 0.15  # kept before the first word
TAIL = 0.45  # kept after the last word


def ff(*a, check=True):
    r = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", *a], capture_output=True, text=True)
    if check and r.returncode:
        sys.exit(r.stderr[-1500:])
    return r.stderr


def duration(path):
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", ff("-i", path, check=False))
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])


def speech_bounds(path):
    """First and last moments of speech, from silencedetect."""
    dur = duration(path)
    log = ff("-i", path, "-vn", "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-", check=False)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    first = ends[0] if starts and starts[0] < 0.05 and ends else 0.0
    last = starts[-1] if starts and (len(ends) < len(starts) or ends[-1] >= dur - 0.05) else dur
    return first, last, dur


def frame(path, t, size):
    """A grey frame at time t, as floats, scaled to size."""
    tmp = tempfile.mktemp(suffix=".png")
    ff("-y", "-ss", f"{t}", "-i", path, "-frames:v", "1", "-vf", f"scale={size[0]}:{size[1]}", tmp)
    img = np.asarray(Image.open(tmp).convert("L"), dtype=np.float32)
    os.remove(tmp)
    return img


def ncc(a, b):
    a = a - a.mean(); b = b - b.mean()
    d = np.sqrt((a * a).sum() * (b * b).sum())
    return float((a * b).sum() / d) if d else 0.0


def find_crop(src, t, out_size, reference):
    """Crop box (x, y, w, h) in the 1920x1080 source matching the earlier clip's framing."""
    W, H, k = 1920, 1080, 8
    aspect = out_size[0] / out_size[1]
    big = frame(src, t, (W // k, H // k))
    ref_img = Image.open(reference).convert("L")
    best = (-1.0, None)
    for h in range(H, int(H * 0.45), -24):
        w = round(h * aspect)
        if w > W:
            continue
        rw, rh = max(4, w // k), max(4, h // k)
        ref = np.asarray(ref_img.resize((rw, rh), Image.BILINEAR), dtype=np.float32)
        for y in range(0, big.shape[0] - rh + 1, 1):
            for x in range(0, big.shape[1] - rw + 1, 1):
                score = ncc(big[y:y + rh, x:x + rw], ref)
                if score > best[0]:
                    best = (score, (x * k, y * k, w, h))
    score, (x, y, w, h) = best
    x, y = min(x, W - w), min(y, H - h)
    return (x - x % 2, y - y % 2, w - w % 2, h - h % 2), score


def centre_crop(out_size):
    W, H = 1920, 1080
    aspect = out_size[0] / out_size[1]
    w, h = (round(H * aspect), H) if H * aspect <= W else (W, round(W / aspect))
    return ((W - w) // 2 // 2 * 2, (H - h) // 2 // 2 * 2, w - w % 2, h - h % 2)


def loudnorm(src, ss, to, out_wav):
    cut = ["-ss", f"{ss:.3f}", "-to", f"{to:.3f}", "-i", src, "-vn"]
    m = ff(*cut, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-", check=False)
    j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
          f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    ff("-y", *cut, "-af", f"{ln},aresample=48000", "-ac", "1", out_wav)


def build(name):
    voice, size, ref_name = CLIPS[name]
    src = f"{SRC}/{name}.mp4"
    first, last, dur = speech_bounds(src)
    ss, to = max(0.0, first - LEAD), min(dur, last + TAIL)

    reference = f"{SPEAKERS}/{ref_name}"
    if os.path.exists(reference):
        (x, y, w, h), score = find_crop(src, ss, size, reference)
        if score < 0.45:
            (x, y, w, h), how = centre_crop(size), f"centre (match {score:.2f} too weak)"
        else:
            how = f"matched {score:.2f}"
    else:
        (x, y, w, h), how = centre_crop(size), "centre (no reference)"

    vf = f"crop={w}:{h}:{x}:{y},scale={size[0]}:{size[1]}:flags=lanczos,fps=24,format=yuv420p"
    out = f"{SPEAKERS}/{name}.mp4"
    ff("-y", "-ss", f"{ss:.3f}", "-to", f"{to:.3f}", "-i", src, "-an", "-vf", vf, "-c:v", "libx264", "-preset", "slow",
       "-crf", "24", "-profile:v", "high", "-movflags", "+faststart", out)
    ff("-y", "-i", out, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", f"{SPEAKERS}/{name}_start.webp")
    ff("-y", "-sseof", "-0.1", "-i", out, "-frames:v", "1", "-update", "1", "-c:v", "libwebp", "-quality", "82",
       f"{SPEAKERS}/{name}_end.webp")

    wav = tempfile.mktemp(suffix=".wav")
    loudnorm(src, ss, to, wav)
    ff("-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "160k", f"{VOICE}/{voice}.mp3")
    ff("-y", "-i", wav, "-c:a", "libopus", "-b:a", "64k", f"{VOICE}/{voice}.webm")
    os.remove(wav)
    print(f"{name}: {ss:.2f}-{to:.2f}s of {dur:.2f}s, crop {w}x{h}+{x}+{y} ({how}), "
          f"{os.path.getsize(out) // 1024} KB -> voice/{voice}")


for n in sys.argv[1:] or CLIPS:
    build(n)
