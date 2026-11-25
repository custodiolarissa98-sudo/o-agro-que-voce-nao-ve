# O Agro Que Você Não Vê — padrões obrigatórios da série

Série de vídeos educativos sobre fisiologia vegetal e agro, para Instagram Reels e TikTok.
Todo episódio novo segue estes padrões. Não mude nada aqui sem autorização da dona do projeto.

## Narração (OBRIGATÓRIO — mesma voz em todos os episódios)

**Voz oficial da série (desde 25/11/2026): voz do CapCut**, escolhida pela dona do projeto por soar mais real
(perguntas com entonação de pergunta, ritmo natural).
- **Origem:** aplicativo CapCut → editor → Texto → Adicionar texto → **"Texto em áudio"**.
- **Nome da voz no CapCut:** A CONFIRMAR com a dona do projeto. É uma voz feminina (tom médio ≈ 247 Hz).
- **Fluxo:** a dona do projeto gera a narração no CapCut (um parágrafo por cena, sem música) e envia o vídeo/áudio exportado.
  O Claude extrai a voz, separa os parágrafos pelas pausas e encaixa cada um na sua cena.
  Se um parágrafo não couber na cena, acelerar no máximo ~12% (`atempo`) ou ajustar a duração das cenas.
  Referência: `ep01_estomatos/tts_capcut/` e `ep01_estomatos/build/audio_capcut.py`.
- O Claude **não consegue** gerar essa voz sozinho (o CapCut não tem conector nem API pública).
- O vídeo enviado pode ter imagens pessoais de fundo: nunca salvar o vídeo bruto no repositório, só a voz extraída.

### Voz anterior (Kokoro) — usar só se a dona do projeto pedir
- **Motor de voz:** Kokoro TTS v1.0, via pacote Python `kokoro-onnx` (versão 0.6.1)
- **Arquivos do modelo** (não ficam no repositório; baixar sempre destes endereços):
  - https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  - https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
- **Identificador da voz:** `pf_dora` (voz feminina, português brasileiro)
- **Idioma:** `lang="pt-br"`
- **Velocidade:** `speed=1.15` (padrão). Só se uma frase não couber no tempo da cena, aumentar até no máximo `1.38`. No episódio 01, só a cena 7 usou 1.38.
- **Geração:** um arquivo WAV por cena (24 kHz). Referência: `ep01_estomatos/tts/gen.py`.
- **Tratamento na mixagem:** passa-altas de 80 Hz; pico da narração em 0,89; a música abaixa cerca de 55% enquanto há fala. Referência: `ep01_estomatos/build/audio.py`.
- **Perguntas:** essa voz termina perguntas como afirmações; se for usada, corrigir com `tools/perguntas.py`.

### Mixagem e volume (vale para qualquer voz)
- **Tratamento na mixagem:** passa-altas de 80 Hz; pico da narração em 0,89; a música abaixa cerca de 55% enquanto há fala.
- **Volume final:** loudnorm I=-14 LUFS, TP=-1,5 dB; áudio AAC 192 kbps, 48 kHz.

```python
from kokoro_onnx import Kokoro
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
samples, sr = k.create(texto, voice="pf_dora", speed=1.15, lang="pt-br")
```

## Formato do vídeo

- Vertical 9:16, 1080 × 1920 px, 30 fps, H.264 (cerca de 14 Mbps), sempre com mais de 1 minuto.
- Sem apresentadores, sem avatares falando para a câmera, sem marcas d'água nem logos de terceiros.

## Identidade visual

- Animação científica cinematográfica: tons de verde, amarelo-dourado, marrom e azul-turquesa; partículas douradas; bokeh; vinheta.
- Selo da série no topo (y ≈ 260): pílula escura com folha verde e o texto "O AGRO QUE VOCÊ NÃO VÊ".
- **Legendas:** fonte Baloo 2 ExtraBold, 76 px, brancas, palavras-chave em amarelo `#ffd93b`, contorno preto, centralizadas em y ≈ 1440 (área segura), aparecendo frase a frase.
- **Identificações científicas:** caixas escuras arredondadas com fonte Nunito ExtraBold 36 px e uma linha indicativa até a estrutura.
- **Textos de impacto:** Baloo 2 ExtraBold, entrada com efeito elástico, perto de y ≈ 290–450.
- **Personagens microscópicos:** olhos e expressões discretas nas células, sem nunca transformar poros em bocas humanas (sem dentes ou lábios).
- **Encerramento:** título em duas linhas (branco e amarelo), subtítulo e botão amarelo "Siga para mais segredos do campo!".

## Arquivos

- `ep01_estomatos/` — "O segredo das pequenas bocas das plantas": arquivos-fonte (animação, texturas, legendas, áudio e narração).
- Os MP4 finais não vão para o repositório (limite de 100 MB do GitHub); guarde-os fora dele.
