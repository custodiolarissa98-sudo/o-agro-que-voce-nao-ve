import soundfile as sf, json
from kokoro_onnx import Kokoro
k=Kokoro("kokoro-v1.0.onnx","voices-v1.0.bin")
L=["Você sabia que uma única folha pode esconder milhares de pequenas bocas? E que elas ajudam a manter a planta viva?",
"Essas pequenas estruturas são chamadas de estômatos. Elas são microscópicas e funcionam como verdadeiras portas de comunicação entre a planta e o ambiente.",
"Quando os estômatos se abrem, o gás carbônico consegue entrar na folha. Com água e energia da luz solar, a planta utiliza esse gás para produzir açúcares através da fotossíntese.",
"Mas não é só isso! Pelos estômatos também podem sair oxigênio e vapor de água. Esse processo de perda de água é chamado de transpiração e ajuda a regular a temperatura da planta.",
"E como essas pequenas portas conseguem abrir e fechar? Tudo acontece graças às células-guarda, que alteram sua pressão interna conforme ganham ou perdem água.",
"Quando falta água, sinais químicos, como o ácido abscísico, ajudam a fechar os estômatos. Isso reduz a perda de água, mas também pode limitar a fotossíntese e o crescimento da planta.",
"Na agricultura, esse equilíbrio microscópico pode influenciar diretamente o desenvolvimento das culturas e até a produtividade de uma lavoura.",
"O agro esconde um universo invisível. Siga para descobrir mais!"]
d=[]
for i,t in enumerate(L):
    s,sr=k.create(t,voice="pf_dora",speed=1.15,lang="pt-br")
    sf.write(f"n{i}.wav",s,sr); d.append(len(s)/sr)
print(json.dumps(d))
