#!/usr/bin/env python3
"""Assemble the Boardroom Dilemma films from generated clips, narration and stills.

Outputs (app/public/films):
  intro.mp4 / intro.vtt
  executive_setup.mp4 / executive_setup.vtt
  executive_branch_{a,b,c,d}.mp4 / .vtt

Run: python3 media/build_films.py [intro|executive|all]
"""
import os
import re
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = "/Users/mosesjeremiah/boardroom dilema"
VID = f"{ROOT}/media/video"
AUD = f"{ROOT}/media/audio"
ORIG = f"{ROOT}/media/originals"
BUILD = f"{ROOT}/media/build"
OUT = f"{ROOT}/app/public/films"
W, H, FPS = 1280, 720, 24
os.makedirs(BUILD, exist_ok=True)
os.makedirs(OUT, exist_ok=True)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(" ".join(cmd))
        print(r.stderr[-3000:])
        sys.exit(1)
    return r


def duration(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).stdout.strip())


def font(size, bold=True):
    for p in [
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ]:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size, index=1 if bold and p.endswith(".ttc") else 0)
            except Exception:
                continue
    return ImageFont.load_default()


def text_png(path, text, size, spacing=0.12, box=False, align="center"):
    """Transparent 1280x720 overlay (align=lower-left for location slates) or a black title card (box=True)."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255 if box else 0))
    d = ImageDraw.Draw(img)
    f = font(size)
    chars = list(text)
    widths = [d.textlength(c, font=f) for c in chars]
    extra = size * spacing
    total = sum(widths) + extra * (len(chars) - 1)
    if align == "center":
        x, y = (W - total) / 2, (H - size) / 2
    else:
        x, y = 56, H - 96
        pad = 12
        d.rounded_rectangle([x - pad, y - pad, x + total + pad, y + size + pad + 4], radius=8, fill=(0, 0, 0, 150))
    for c, cw in zip(chars, widths):
        d.text((x, y), c, font=f, fill=(255, 255, 255, 235))
        x += cw + extra
    img.save(path)


def silence_onset(path, after=1.0, noise="-38dB"):
    """First speech onset after `after` seconds (end of the first silence that starts before it)."""
    err = subprocess.run(["ffmpeg", "-i", path, "-af", f"silencedetect=noise={noise}:d=0.4", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    for e in ends:
        if e >= after:
            return e
    return None


def seg_clip(name, src, speed=1.0, trim=None, gain=1.0, vo=None, vo_gain=1.0, duck=0.35, slate=None, min_dur=0.0):
    out = f"{BUILD}/{name}.mp4"
    clip_d = (trim[1] - trim[0]) if trim else duration(src)
    base_d = clip_d / speed
    vo_d = duration(vo[0]) + vo[1] if vo else 0
    seg_d = max(base_d, vo_d + 0.25, min_dur)
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if trim:
        cmd += ["-ss", f"{trim[0]}", "-t", f"{clip_d}"]
    cmd += ["-i", src]
    inputs = 1
    if vo:
        cmd += ["-i", vo[0]]
        inputs += 1
    if slate:
        slate_png = f"{BUILD}/{name}_slate.png"
        text_png(slate_png, slate, 26, spacing=0.1, align="lower-left")
        cmd += ["-loop", "1", "-i", slate_png]
        slate_idx = inputs
        inputs += 1
    v = f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"
    if speed != 1.0:
        v += f",setpts=PTS/{speed}"
    v += f",fps={FPS},tpad=stop_mode=clone:stop_duration={max(0.0, seg_d - base_d) + 0.1}"
    if slate:
        v += f"[vb];[{slate_idx}:v]format=rgba,fade=t=in:st=0.3:d=0.4:alpha=1,fade=t=out:st=3.4:d=0.5:alpha=1[s];[vb][s]overlay=0:0:shortest=1"
    v += ",format=yuv420p[v]"
    a = f"[0:a]aresample=48000,aformat=channel_layouts=stereo"
    if speed != 1.0:
        a += f",atempo={speed}"
    a += f",volume={duck * gain if vo else gain},apad[a0]"
    if vo:
        ms = int(vo[1] * 1000)
        a += f";[1:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms},volume={vo_gain},apad[a1];[a0][a1]amix=inputs=2:normalize=0[am]"
    else:
        a += ";[a0]anull[am]"
    a += f";[am]afade=t=in:st=0:d=0.04,afade=t=out:st={seg_d - 0.06}:d=0.06[a]"
    cmd += ["-filter_complex", v + ";" + a, "-map", "[v]", "-map", "[a]", "-t", f"{seg_d}",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-r", f"{FPS}", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", out]
    run(cmd)
    return out, seg_d


def seg_still(name, image, dur, vo=None, vo_gain=1.0, zoom_to=1.07):
    out = f"{BUILD}/{name}.mp4"
    frames = int(dur * FPS)
    step = (zoom_to - 1.0) / max(frames, 1)
    cmd = ["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", image, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo"]
    if vo:
        cmd += ["-i", vo[0]]
    v = (f"[0:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,"
         f"zoompan=z='1+{step}*on':d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS},setsar=1,format=yuv420p[v]")
    if vo:
        ms = int(vo[1] * 1000)
        a = f"[2:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms},volume={vo_gain},apad[a1];[1:a][a1]amix=inputs=2:normalize=0,afade=t=out:st={dur - 0.06}:d=0.06[a]"
    else:
        a = "[1:a]anull[a]"
    cmd += ["-filter_complex", v + ";" + a, "-map", "[v]", "-map", "[a]", "-t", f"{dur}",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-r", f"{FPS}", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", out]
    run(cmd)
    return out, dur


def seg_title(name, text, dur):
    png = f"{BUILD}/{name}.png"
    text_png(png, text, 64, spacing=0.14, box=True)
    out = f"{BUILD}/{name}.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", png, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
         "-filter_complex", f"[0:v]fps={FPS},fade=t=in:st=0:d=0.5,fade=t=out:st={dur - 0.6}:d=0.6,format=yuv420p[v]",
         "-map", "[v]", "-map", "1:a", "-t", f"{dur}", "-c:v", "libx264", "-crf", "20", "-r", f"{FPS}",
         "-c:a", "aac", "-b:a", "160k", "-ar", "48000", out])
    return out, dur


def concat(name, segments):
    listfile = f"{BUILD}/{name}_list.txt"
    with open(listfile, "w") as fh:
        for path, _ in segments:
            fh.write(f"file '{path}'\n")
    out = f"{OUT}/{name}.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", listfile,
         "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "-c:a", "aac", "-b:a", "128k", out])
    return out


def ts(t):
    h, rem = divmod(max(t, 0), 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def spread(lines, start, end, gap=0.25):
    """Distribute [(speaker, text)] across a window in proportion to word count."""
    words = [max(len(t.split()), 1) for _, t in lines]
    total_gap = gap * (len(lines) - 1)
    unit = (end - start - total_gap) / sum(words)
    cues, t = [], start
    for (spk, text), n in zip(lines, words):
        cues.append((spk, text, t, t + n * unit))
        t += n * unit + gap
    return cues


def write_vtt(name, cues):
    with open(f"{OUT}/{name}.vtt", "w") as fh:
        fh.write("WEBVTT\n\n")
        for i, (spk, text, a, b) in enumerate(cues, 1):
            body = f"<v {spk}>{text}" if spk else text
            fh.write(f"{i}\n{ts(a)} --> {ts(b)}\n{body}\n\n")


def build_intro():
    segs, cues, t = [], [], 0.0

    def add(seg, seg_cues):
        nonlocal t
        segs.append(seg)
        cues.extend((s, x, t + a, t + b) for s, x, a, b in seg_cues)
        t += seg[1]

    add(seg_clip("i01_a", f"{VID}/intro_a.mp4"), spread([("Board member", "Who knew the interlock had been bypassed?")], 0.4, 3.7))
    vo_b = f"{AUD}/vo_b.mp3"
    add(seg_clip("i02_b", f"{VID}/intro_b.mp4", speed=0.7, gain=0.9, vo=(vo_b, 0.3), slate="OGUN STATE FACILITY · THREE WEEKS EARLIER"),
        [("Narrator", "At Delta Industrial Nigeria's Ogun State facility, pressure to hit group margin targets had been building for months.", 0.3, 0.3 + duration(vo_b))])
    add(seg_clip("i03_c", f"{VID}/intro_c.mp4"),
        spread([("Operator", "That interlock has been bypassed for months. We shouldn't be running this line."),
                ("Supervisor", "I've raised it. The answer is keep running. Just get this batch through.")], 0.4, 7.7))
    add(seg_clip("i04_d", f"{VID}/intro_d.mp4"), [(None, "[Alarm. Machinery stops abruptly. Shouting.]", 0.0, 4.0)])
    add(seg_clip("i05_e", f"{VID}/intro_e.mp4"),
        spread([("Plant Manager", "What exactly do you want in the incident report?"),
                ("Regional Director", "Stick to what's confirmed. Don't put conclusions in writing yet.")], 0.3, 5.8))
    # F has dialogue from ~2.2s, so the narration runs over a slow push-in on its opening
    # spreadsheet frame, then F plays in full. Cue times follow the measured pauses.
    f_src = f"{VID}/intro_f.mp4"
    f_still = f"{BUILD}/intro_f_first.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", "0.3", "-i", f_src, "-frames:v", "1", f_still])
    vo_e = f"{AUD}/vo_e.mp3"
    add(seg_still("i06_f1", f_still, duration(vo_e) + 0.6, vo=(vo_e, 0.2), zoom_to=1.06),
        [("Narrator", "As the first reports came in, it became clear the accident might not be an isolated safety failure.", 0.2, 0.2 + duration(vo_e))])
    add(seg_clip("i07_f2", f_src),
        [("Auditor", "I've gone back fourteen months. Three payments, all through the same agent.", 2.2, 5.9),
         ("Finance Manager", "They're expediting fees.", 7.0, 8.1),
         ("Auditor", "Then why is there no record of where the money actually went?", 8.8, 10.9)])
    add(seg_clip("i08_g1", f"{VID}/intro_g1.mp4"),
        spread([("Journalist", "Workers say safety concerns were raised before the fatality. Will the company comment?")], 0.3, 4.8))
    add(seg_clip("i09_g2", f"{VID}/intro_g2.mp4"),
        spread([("FISCA official", "We're aware of the fatality. We have not opened an inquiry — at this stage.")], 0.3, 4.8))
    vo_g = f"{AUD}/vo_g.mp3"
    add(seg_still("i10_kb1", f"{ORIG}/p03_tabletop.png", duration(vo_g) + 0.8, vo=(vo_g, 0.3)),
        [("Narrator", "Questions about safety, oversight and financial conduct were beginning to converge.", 0.3, 0.3 + duration(vo_g))])
    add(seg_clip("i11_h", f"{VID}/intro_h.mp4"),
        spread([("Managing Director", "The Board meets in seventy-two hours. I need to understand what happened, how far this goes, and what we can defend.")], 0.3, 6.8))
    vo_h = f"{AUD}/vo_h.mp3"
    add(seg_still("i12_kb2", f"{ORIG}/p02_role.png", duration(vo_h) + 0.9, vo=(vo_h, 0.3)),
        [("Narrator", "You will examine the evidence, determine where accountability lies, and advise the Board on what Delta should do next.", 0.3, 0.3 + duration(vo_h))])
    add(seg_title("i13_title", "YOU HAVE 72 HOURS.", 3.2), [(None, "You have 72 hours.", 0.3, 3.0)])
    out = concat("intro", segs)
    write_vtt("intro", cues)
    print(out, f"{duration(out):.1f}s")


EXEC_OPTIONS = {
    "a": ("You're right, we should focus on the business realities and not get distracted.", "Good. I knew you'd see sense."),
    "b": ("I hear the pressure you were under — and I think the Board needs to hear that too, alongside what it cost.", "Then say it that way in there — pressure and cost, both."),
    "c": ("That's exactly the kind of thinking that got a man killed.", "Remember you said that."),
    "d": ("Let's discuss this after the Board meeting.", "After, then."),
}


def build_executive():
    segs, cues, t = [], [], 0.0

    def add(seg, seg_cues):
        nonlocal t
        segs.append(seg)
        cues.extend((s, x, t + a, t + b) for s, x, a, b in seg_cues)
        t += seg[1]

    vo = f"{AUD}/vo_exec.mp3"
    add(seg_still("e01_kb", f"{ORIG}/p07_executive.png", duration(vo) + 0.7, vo=(vo, 0.3), zoom_to=1.05),
        [("Narrator", "Your investigation has reached the Boardroom. Senior leaders now have something to lose.", 0.3, 0.3 + duration(vo))])
    add(seg_clip("e02_setup1", f"{VID}/exec_setup1.mp4"),
        spread([("Chidi Okafor", "Let's not turn this into a witch hunt. Performance is everything in this market — you slow down, you lose the contract, you lose the jobs.")], 0.3, 9.6))
    add(seg_clip("e03_setup2", f"{VID}/exec_setup2.mp4"),
        spread([("Chidi Okafor", "Everyone signed off on the budget. This is not about ethics, it's about being realistic.")], 0.2, 4.8))
    concat("executive_setup", segs)
    write_vtt("executive_setup", cues)

    # Each branch opens on a short hold of setup2's last frame (Chidi waiting) while the learner's
    # reply shows as a caption — the reply is never voiced. Then his reaction clip plays.
    # BRANCH_CUT: (trim start, speech start, speech end) measured with silencedetect. D's clip
    # opens with an unwanted voiced paraphrase of the learner's line, so it is trimmed away.
    hold_img = f"{ORIG}/exec_setup2_last.png"
    for key, (reply, line) in EXEC_OPTIONS.items():
        src = f"{VID}/exec_branch_{key}.mp4"
        if not os.path.exists(src):
            print("missing", src)
            continue
        cut, s0, s1 = BRANCH_CUT[key]
        hold = min(5.0, max(2.2, len(reply.split()) / 4 + 0.8))
        h = seg_still(f"e1{key}_hold", hold_img, hold, zoom_to=1.02)
        trim = (cut, duration(src)) if cut else None
        c = seg_clip(f"e1{key}_branch", src, trim=trim)
        concat(f"executive_branch_{key}", [h, c])
        write_vtt(f"executive_branch_{key}", [
            ("You", reply, 0.15, hold - 0.15),
            ("Chidi Okafor", line, hold + s0 - cut - 0.1, hold + s1 - cut + 0.4),
        ])
    print("executive films built")


BRANCH_CUT = {
    "a": (0.0, 1.30, 3.98),
    "b": (0.0, 1.71, 3.86),
    "c": (0.0, 2.67, 4.06),
    "d": (1.9, 2.38, 3.23),
}


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which in ("intro", "all"):
        build_intro()
    if which in ("executive", "all"):
        build_executive()
