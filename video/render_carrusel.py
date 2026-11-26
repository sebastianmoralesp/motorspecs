#!/usr/bin/env python3
"""Uso: python3 render_carrusel.py spec.json salida_dir
spec.json = {"slides": [ ...Slide... ]}  (ver src/Carousel.tsx). Genera salida_dir/1.jpg, 2.jpg, ... (1080x1350 JPEG)."""
import json, subprocess, sys, os
spec = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__))
for i in range(len(spec['slides'])):
    pf = os.path.join(out, f'_props{i}.json'); json.dump({'slides': spec['slides'], 'i': i}, open(pf, 'w'), ensure_ascii=False)
    subprocess.run(['npx', 'remotion', 'still', 'src/index.ts', 'Carrusel', os.path.join(out, f'{i+1}.jpg'), f'--props={pf}',
                    '--image-format=jpeg', '--jpeg-quality=92', '--browser-executable=/usr/bin/google-chrome',
                    '--chrome-mode=chrome-for-testing', '--log=error'], cwd=here, check=True)
    os.remove(pf)
print('ok', out)
