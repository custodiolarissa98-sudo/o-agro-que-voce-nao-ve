# Narração do episódio 02 — padrão da série (CLAUDE.md): Kokoro v1.0, voz pf_dora, pt-br, speed 1.15 (máx. 1.38)
import soundfile as sf, json, sys, os
from kokoro_onnx import Kokoro
MODEL=os.environ.get('KOKORO_DIR','.')
k=Kokoro(f"{MODEL}/kokoro-v1.0.onnx",f"{MODEL}/voices-v1.0.bin")
L=["Você sabia que cada fio do cabelo do milho está ligado a um possível grão? E que sem fecundação esse grão não se forma?",
"Esses fios são chamados de estilos-estigmas. Cada um está ligado a um ovário com um óvulo e possui uma função essencial na reprodução do milho.",
"No alto da planta está o pendão, responsável pela produção do pólen. Transportados principalmente pelo vento, esses pequenos grãos precisam alcançar os cabelos receptivos das espigas.",
"Ao encontrar um cabelo receptivo, o pólen germina e forma o tubo polínico, uma estrutura que cresce pelo interior do estilo em direção ao óvulo.",
"É nesse momento que acontece a dupla fecundação, dando início à formação do embrião e do endosperma, tecido responsável por armazenar reservas para a futura planta.",
"Quando a seca ou o calor prejudicam a polinização e a fecundação, alguns grãos podem não se formar. O abortamento de grãos já fecundados também pode provocar falhas na espiga.",
"Na agricultura, esse processo microscópico é fundamental, pois influencia diretamente o número de grãos e a produtividade da lavoura.",
"Nunca mais olhe para o cabelo do milho da mesma forma!"]
SPEED=json.loads(sys.argv[1]) if len(sys.argv)>1 else [1.15]*len(L)
d=[]
for i,t in enumerate(L):
    s,sr=k.create(t,voice="pf_dora",speed=SPEED[i],lang="pt-br"); sf.write(f"n{i}.wav",s,sr); d.append(round(len(s)/sr,2))
print(json.dumps(d))
