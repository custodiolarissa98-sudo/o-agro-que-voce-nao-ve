# Monta build/index.html = head.html + legendas + core.js + scenes.js
import json, os
d=os.path.dirname(os.path.abspath(__file__)); s=json.load(open(f'{d}/subs.json'))
open(f'{d}/index.html','w').write(open(f'{d}/head.html').read()+'const SUBS='+json.dumps(s,ensure_ascii=False)+';\n'+open(f'{d}/core.js').read()+'\n'+open(f'{d}/scenes.js').read()+'</script></body></html>')
