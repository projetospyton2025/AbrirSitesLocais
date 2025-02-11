from flask import Flask, render_template, jsonify
import os
import subprocess
import time
import webbrowser

app = Flask(__name__)

# Configuração do Firefox Developer Edition
FIREFOX_PATH = r"C:\Program Files\Firefox Developer Edition\firefox.exe"
webbrowser.register('firefox-dev', None, webbrowser.BackgroundBrowser(FIREFOX_PATH))

# Mapeamento dos diretórios, comandos e portas
DIRECTORIES = {
    'Super7': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\Super7',
        'command': 'app.py',
        'port': 5000
    },
    'Lotofacil_5Fixas': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\Lotofacil\geradorJogos',
        'command': 'GerarJogos5Fixas.py',
        'port': 5002
    },
    'Lotofacil_10Fixas': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\Lotofacil\geradorJogos',
        'command': 'GerarJogos10Fixas.py',
        'port': 5003
    },
    'Lotofacil_Normal': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\Lotofacil\geradorJogos',
        'command': 'GerarJogosNormais.py',
        'port': 5004
    },
    'DiaDeSorte': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\DiaDeSorte',
        'command': 'app.py',
        'port': 5005
    },
    'LotofacilConf': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\Conferidores\LotofacilConf',
        'command': 'app.py',
        'port': 5006
    },
    'MegaSenaConf': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\Conferidores\megasenaconferidor',
        'command': 'app.py',
        'port': 5007
    },
    'MegaSenaGerador': {
        'path': r'J:\Meu Drive\ProjetosPython\Loterias\Geradores\MegaSenaGerador',
        'command': 'app.py',
        'port': 5008
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/list_dirs')
def list_dirs():
    try:
        dirs = []
        for name, info in DIRECTORIES.items():
            script_path = os.path.join(info['path'], info['command'])
            has_script = os.path.exists(script_path)
            dirs.append({
                'name': name,
                'path': info['path'],
                'command': info['command'],
                'has_script': has_script,
                'port': info.get('port', None)
            })
        return jsonify({'directories': dirs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/run_app/<name>')
def run_app(name):
    try:
        if name in DIRECTORIES:
            info = DIRECTORIES[name]
            script_path = os.path.join(info['path'], info['command'])
            
            if os.path.exists(script_path):
                os.chdir(info['path'])
                subprocess.Popen(['python', info['command']])
                
                # Aguarda um momento para o servidor iniciar
                time.sleep(2)
                
                # Abre o Firefox Developer Edition na porta correta
                if 'port' in info:
                    url = f"http://localhost:{info['port']}"
                    webbrowser.get('firefox-dev').open(url)
                
                return jsonify({
                    'success': True, 
                    'message': f'{info["command"]} executado e aberto no Firefox'
                })
                
            return jsonify({
                'success': False, 
                'message': f'{info["command"]} não encontrado'
            })
        return jsonify({
            'success': False, 
            'message': 'Diretório não encontrado'
        })
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
