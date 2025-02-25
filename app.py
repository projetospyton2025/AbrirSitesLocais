from flask import Flask, render_template, jsonify
import os
import time
import webbrowser

app = Flask(__name__)

# Configuração do navegador
FIREFOX_PATH = r"C:\Program Files\Firefox Developer Edition\firefox.exe"
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Verifica se o Firefox Developer está instalado
if os.path.exists(FIREFOX_PATH):
    webbrowser.register('browser', None, webbrowser.BackgroundBrowser(FIREFOX_PATH))
    BROWSER_NAME = "Firefox Developer Edition"
else:
    # Se não estiver, usa o Edge
    webbrowser.register('browser', None, webbrowser.BackgroundBrowser(EDGE_PATH))
    BROWSER_NAME = "Microsoft Edge"

# Lista de sites externos para abrir
SITES = [
    {
        'name': 'Portifólio do Maia',
        'url': 'https://portifoliodomaia.netlify.app/'
    },
    {
        'name': 'Loterias Caixa',
        'url': 'https://loteriascaixa.netlify.app/'
    },
    {
        'name': 'Estratégias para Mega Sena',
        'url': 'https://estrategiasparamegasena.netlify.app/'
    },
    {
        'name': 'Estatísticas | Resumo *',
        'url': 'https://resumomegasena.onrender.com/'
    },
    {
        'name': 'Geradores | Combinação II',
        'url': 'https://combinacao-i.onrender.com/'
    },
    {
        'name': 'Estratégias | Palpites I',
        'url': 'https://palpitesmegasena.onrender.com/'
    },
    {
        'name': 'Estratégias | Palpites II',
        'url': 'https://palpitesms.onrender.com/'
    },
    {
        'name': 'Estratégias | Colunas',
        'url': 'https://colunas.onrender.com/'
    },
    {
        'name': 'Estatísticas | Quadrantes',
        'url': 'https://estrategiasparamegasena.netlify.app/historicoderesultados/index1a'
    },
    {
        'name': 'Resultados | Todos sorteios + filtro avançado',
        'url': 'https://estrategiasparamegasena.netlify.app/historicoderesultados/index5'
    },
    {
        'name': 'Estratégias | Palpites III',
        'url': 'https://palpitesmegas.onrender.com/'
    }
]



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/list_sites')
def list_sites():
    try:
        return jsonify({
            'sites': SITES,
            'browser_info': {
                'name': BROWSER_NAME,
                'is_firefox_dev': os.path.exists(FIREFOX_PATH)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/open_site/<int:site_id>')
def open_site(site_id):
    try:
        if 0 <= site_id < len(SITES):
            site = SITES[site_id]
            # Abre o site no navegador selecionado
            webbrowser.get('browser').open(site['url'])
            return jsonify({
                'success': True,
                'message': f'Site {site["name"]} aberto no {BROWSER_NAME}'
            })
        return jsonify({
            'success': False,
            'message': 'Site não encontrado'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })

@app.route('/open_all_sites')
def open_all_sites():
    try:
        # Abre todos os sites em abas separadas
        for site in SITES:
            webbrowser.get('browser').open_new_tab(site['url'])
            # Pequena pausa para evitar sobrecarga
            time.sleep(0.5)
        
        return jsonify({
            'success': True,
            'message': f'Todos os {len(SITES)} sites foram abertos no {BROWSER_NAME}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })

"""
if __name__ == '__main__':
    app.run(debug=True, port=5001)
"""
    
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)