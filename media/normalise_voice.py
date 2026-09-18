#!/usr/bin/env python3
"""Rebuild app/public/voice: one clean continuous file per spoken line, at one loudness.

Character lines come from their untouched recordings in media/audio/characters (no retiming, no pauses
removed). Narrator lines keep their recorded pace. Every line: edge silence trimmed, two-pass loudnorm to
-16 LUFS / -1.5 dBTP, 48 kHz, MP3 160k plus Opus 64k.
Run: python3 media/normalise_voice.py [name ...]
"""
import json, os, re, subprocess, sys, glob, shutil, tempfile
ROOT = "/Users/mosesjeremiah/boardroom dilema"
PUB = f"{ROOT}/app/public/voice"
CHAR = f"{ROOT}/media/audio/characters"
TRIM = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,"
        "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.2,areverse")

def ff(*a):
    return subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", *a], capture_output=True, text=True)

def process(name):
    src = f"{CHAR}/{name}.mp3" if os.path.exists(f"{CHAR}/{name}.mp3") else f"{PUB}/{name}.mp3"
    tmp = tempfile.mkdtemp()
    work = f"{tmp}/src.mp3"; shutil.copy(src, work)
    m = ff("-i", work, "-af", f"{TRIM},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-").stderr
    j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
          f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    wav = f"{tmp}/out.wav"
    r = ff("-y", "-i", work, "-af", f"{TRIM},{ln},aresample=48000", "-ac", "1", wav)
    if r.returncode: print(r.stderr[-800:]); sys.exit(1)
    ff("-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "160k", f"{PUB}/{name}.mp3")
    ff("-y", "-i", wav, "-c:a", "libopus", "-b:a", "64k", f"{PUB}/{name}.webm")
    shutil.rmtree(tmp)
    return os.path.basename(src) if src.startswith(CHAR) else "narration"

names = sys.argv[1:] or sorted(os.path.basename(p)[:-4] for p in glob.glob(f"{PUB}/*.mp3"))
for n in names:
    print(n, process(n))
