document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/list_dirs');
        const data = await response.json();
        
        const container = document.getElementById('directories');
        if (data.error) {
            container.innerHTML = `<div class="error">${data.error}</div>`;
            return;
        }

        data.directories.forEach(dir => {
            const dirDiv = document.createElement('div');
            dirDiv.className = 'directory';
            dirDiv.innerHTML = `
                <div class="dir-info">
                    <span class="dir-name">${dir.name}</span>
                    <span class="command">${dir.command}</span>
                </div>
                ${dir.has_script ? `
                    <button class="run-button" onclick="runApp('${dir.name}')">
                        Executar ${dir.command}
                    </button>
                ` : ''}
            `;
            container.appendChild(dirDiv);
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('directories').innerHTML = 
            `<div class="error">Erro ao carregar diretórios</div>`;
    }
});

async function runApp(name) {
    const button = event.target;
    const originalText = button.textContent;
    
    try {
        // Desabilita o botão e mostra loading
        button.disabled = true;
        button.textContent = 'Iniciando...';
        
        const response = await fetch(`/run_app/${name}`);
        const result = await response.json();
        
        if (result.success) {
            button.textContent = 'Abrindo navegador...';
            // Espera um pouco mais para garantir que o navegador abriu
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        alert('Erro ao executar o comando');
    } finally {
        // Restaura o botão ao estado original
        button.disabled = false;
        button.textContent = originalText;
    }
}