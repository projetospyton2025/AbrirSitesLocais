from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

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
        return jsonify({'sites': SITES})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rota especial para redirecionamento
@app.route('/redirect/<int:site_id>')
def redirect_to_site(site_id):
    if 0 <= site_id < len(SITES):
        return render_template('redirect.html', site=SITES[site_id])
    return "Site não encontrado", 404



if __name__ == '__main__':
    # Use a porta fornecida pelo ambiente (importante para o Render)
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)