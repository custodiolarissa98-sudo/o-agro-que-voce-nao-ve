"""Corrige a entonação das perguntas na narração (voz pf_dora tende a terminar perguntas como afirmações).
Para cada frase terminada em '?', sobe a melodia (F0) no final da frase, como na fala brasileira,
sem mudar a duração: legendas e animações continuam sincronizadas.
Uso: python3 tools/perguntas.py <pasta_do_episodio>   -> grava tts/nq{i}.wav ao lado de tts/n{i}.wav
"""
import sys, re, numpy as np, soundfile as sf, pyworld as pw
ep = sys.argv[1]
src = open(f'{ep}/tts/gen.py').read()
L = re.search(r'L=\[(.*?)\]\n', src, re.S).group(1)
L = [s.strip().strip('"') for s in L.split('",\n')]
SEMI_YN, SEMI_WH, WIN = 5.0, 3.0, 0.60   # subida em semitons (sim/não, pergunta com "como/quando...") e janela final (s)
WH = ('como', 'quando', 'onde', 'por que', 'qual', 'quem', 'o que', 'quanto')

def sentence_bounds(a, sr, n):
    hop = int(sr * .02); r = np.array([np.sqrt(np.mean(a[j:j+hop]**2)) for j in range(0, len(a)-hop, hop)])
    sil = r < r.max() * .03; gaps = []; j = 0
    while j < len(sil):
        if sil[j]:
            k = j
            while k < len(sil) and sil[k]: k += 1
            if k - j >= 6 and j > 0 and k < len(sil): gaps.append(((j + k) / 2 * .02, k - j))
            j = k
        else: j += 1
    nz = np.where(~sil)[0]; st, en = nz[0] * .02, (nz[-1] + 1) * .02
    g = sorted(sorted(gaps, key=lambda x: -x[1])[:n - 1])
    b = [st] + [x[0] for x in g] + [en]
    # end of voiced speech inside each sentence
    ends = []
    for i in range(n):
        seg = np.where(~sil[int(b[i]/.02):int(b[i+1]/.02)])[0]
        ends.append(b[i] + (seg[-1] + 1) * .02 if len(seg) else b[i+1])
    return b, ends

for i, text in enumerate(L):
    a, sr = sf.read(f'{ep}/tts/n{i}.wav'); out = a.copy()
    sents = [s for s in re.split(r'(?<=[.?!])\s+', text) if s]
    b, ends = sentence_bounds(a, sr, len(sents))
    for si, s in enumerate(sents):
        if not s.endswith('?'): continue
        semi = SEMI_WH if any(w in s.lower().lstrip('e ').split(' ', 2)[0:2] or s.lower().lstrip('e ').startswith(w) for w in WH) else SEMI_YN
        s0, s1 = max(0, b[si] - .05), min(len(a) / sr, b[si + 1] + .05)
        i0, i1 = int(s0 * sr), int(s1 * sr); x = a[i0:i1].astype(np.float64)
        f0, tt = pw.harvest(x, sr, f0_floor=90, f0_ceil=450, frame_period=5)
        sp = pw.cheaptrick(x, f0, tt, sr); ap = pw.d4c(x, f0, tt, sr)
        tend = ends[si] - s0; u = np.clip((tt - (tend - WIN)) / WIN, 0, 1)
        # sobe até o pico (~75% da janela) e desce um pouco: contorno de pergunta sim/não do português brasileiro
        curve = np.where(u < .75, np.sin(u / .75 * np.pi / 2) ** 2, 1 - .35 * ((u - .75) / .25))
        curve[u <= 0] = 0
        f0m = np.where(f0 > 0, f0 * 2 ** (semi * curve / 12), 0)
        y = pw.synthesize(f0m, sp, ap, sr, frame_period=5)[:len(x)]
        if len(y) < len(x): y = np.pad(y, (0, len(x) - len(y)))
        y *= np.sqrt(np.mean(x**2) / max(1e-9, np.mean(y**2)))
        fade = int(.02 * sr); w = np.ones(len(x)); w[:fade] = np.linspace(0, 1, fade); w[-fade:] = np.linspace(1, 0, fade)
        out[i0:i1] = out[i0:i1] * (1 - w) + y * w
        print(f'n{i}: pergunta corrigida (+{semi} st): "{s}"')
    sf.write(f'{ep}/tts/nq{i}.wav', out, sr)
