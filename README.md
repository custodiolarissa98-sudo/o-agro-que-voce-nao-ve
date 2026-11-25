# O Agro Que Você Não Vê 🌱

Série de vídeos educativos verticais (9:16, 1080×1920) para Instagram Reels e TikTok.

## Episódios
- `ep01_estomatos/` — "O segredo das pequenas bocas das plantas" (75 s)
- `ep02_cabelo_milho/` — "O Segredo do Cabelo do Milho" (75 s). Motor compartilhado em `build/core.js`; `build/build.py` monta o `index.html`.

## Como gerar um episódio (resumo)
1. `tts/gen.py` — narração (modelo Kokoro; os arquivos `kokoro-v1.0.onnx` e `voices-v1.0.bin` vêm de https://github.com/thewh1teagle/kokoro-onnx/releases e não ficam no repositório).
2. `build/tex.py` — texturas procedurais (epiderme, nervuras, solo).
3. `build/subs.py` — tempos das legendas a partir da narração.
4. `build/index.html` = `head.html` + legendas + `anim.js`; `build/render.js` renderiza os quadros (Playwright + ffmpeg).
5. `build/audio.py` — trilha, efeitos e mixagem com a narração.

Os MP4 finais não ficam no repositório (limite de 100 MB do GitHub).
Fontes Baloo 2 e Nunito: SIL Open Font License (Google Fonts).
