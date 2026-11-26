#!/usr/bin/env python3
"""Narración Kokoro (voz masculina em_alex) -> narration.wav + public/props.json (duración de cada escena).
Uso: python3 narrate.py script.json salida_dir
script.json = {"lineas": ["texto escena 1", ...], "min_anim": [3.2, 4.6, ...], "voz": "em_alex"}
 - Escribe los números con letras (mejor pronunciación). Una línea por escena.
Requiere: pip install --break-system-packages kokoro-onnx soundfile numpy"""
import json, os, sys, urllib.request
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
spec = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__))
kdir = os.environ.get('KOKORO_DIR', os.path.expanduser('~/kokoro')); os.makedirs(kdir, exist_ok=True)
base = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
for f in ('kokoro-v1.0.onnx', 'voices-v1.0.bin'):
    if not os.path.exists(os.path.join(kdir, f)): urllib.request.urlretrieve(base + f, os.path.join(kdir, f))
LEAD, TAIL = 0.3, 0.5
lines = spec['lineas']; mins = spec.get('min_anim') or [3.5] * len(lines); voz = spec.get('voz', 'em_alex')
k = Kokoro(os.path.join(kdir, 'kokoro-v1.0.onnx'), os.path.join(kdir, 'voices-v1.0.bin'))
clips, durs, sr = [], [], 24000
for l in lines:
    x, sr = k.create(l, voice=voz, speed=1.05, lang='es'); clips.append(x); durs.append(len(x) / sr)
D = [round(max(d + LEAD + TAIL, m), 2) for d, m in zip(durs, mins)]
starts = [sum(D[:i]) for i in range(len(D))]; total = sum(D)
buf = np.zeros(int(total * sr) + sr, dtype=np.float32)
for i, x in enumerate(clips):
    off = int((starts[i] + LEAD) * sr); buf[off:off + len(x)] += x
buf = buf[:int(total * sr)]; buf = buf / np.abs(buf).max() * 0.89
sf.write(os.path.join(out, 'narration.wav'), buf, sr)
json.dump({'fps': 30, 'durFrames': [int(round(d * 30)) for d in D]}, open(os.path.join(here, 'public', 'props.json'), 'w'))
print('escenas (s):', D, 'total', round(total, 2))
