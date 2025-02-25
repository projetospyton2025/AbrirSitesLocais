from flask import Flask, render_template, jsonify
import os
import subprocess
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
        'name': 'Estatísticas | Resumo',
        'url': 'https://resumomegasena.onrender.com/'
    },
    {
        'name': 'Geradores | Combinação I',
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
        'name': 'Estratégias | Quadrantes',
        'url': 'https://estrategiasparamegasena.netlify.app/historicoderesultados/index1a'
    },
    {
        'name': 'Resultados | Todos Sorteios + filtro avançado',
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
        # Primeiro site abre em nova janela
        first_url = SITES[0]['url']
        webbrowser.get('browser').open(first_url)
        
        # Pequena pausa para garantir que a primeira janela abra
        time.sleep(0.5)
        
        # Resto dos sites abrem em novas abas na mesma janela
        for site in SITES[1:]:
            webbrowser.get('browser').open_new_tab(site['url'])
            # Pequena pausa para evitar sobrecarga
            time.sleep(0.3)
        
        return jsonify({
            'success': True,
            'message': f'Todos os {len(SITES)} sites foram abertos no {BROWSER_NAME}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })

if __name__ == '__main__':
    # Use a porta fornecida pelo ambiente ou 5001 como padrão
    port = int(os.environ.get('PORT', 5001))
    # No ambiente local, o host pode ser 127.0.0.1 para maior segurança
    # mas no Render precisa ser 0.0.0.0
    host = '127.0.0.1' if os.environ.get('LOCAL') else '0.0.0.0'
    app.run(host=host, port=port, debug=True)