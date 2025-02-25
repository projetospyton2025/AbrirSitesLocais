document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/list_sites');
        const data = await response.json();
        
        const sitesContainer = document.getElementById('sites');
        const browserInfoElement = document.getElementById('browser-info');
        
        if (data.error) {
            sitesContainer.innerHTML = `<div class="error">${data.error}</div>`;
            return;
        }
        
        // Mostra informação sobre qual navegador está sendo usado
        if (data.browser_info) {
            browserInfoElement.innerHTML = `Usando: <strong>${data.browser_info.name}</strong>`;
            browserInfoElement.className = data.browser_info.is_firefox_dev ? 'browser-firefox' : 'browser-edge';
        }

        // Adiciona botão para abrir todos os sites
        const openAllSection = document.createElement('div');
        openAllSection.className = 'open-all-section';
        openAllSection.innerHTML = `
            <p class="open-all-info">Clique no botão abaixo para abrir todos os sites no ${data.browser_info?.name || "navegador"}</p>
            <button class="open-all-button" id="openAllButton">
                Abrir Todos os Sites
            </button>
        `;
        sitesContainer.appendChild(openAllSection);

        // Handler para o botão de abrir todos
        document.getElementById('openAllButton').addEventListener('click', async function() {
            const button = this;
            const originalText = button.textContent;
            
            try {
                // Desabilita o botão e mostra loading
                button.disabled = true;
                button.textContent = 'Abrindo todos os sites...';
                
                // Chama a API para abrir todos os sites via backend (usando webbrowser)
                const response = await fetch('/open_all_sites');
                const result = await response.json();
                
                if (result.success) {
                    button.textContent = 'Sites abertos!';
                    // Aguarda um pouco antes de restaurar o texto original
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    alert(`Erro: ${result.message}`);
                }
            } catch (error) {
                alert('Erro ao abrir os sites');
                console.error(error);
            } finally {
                // Restaura o botão ao estado original
                button.disabled = false;
                button.textContent = originalText;
            }
        });

        // Adiciona os sites
        const sitesGrid = document.createElement('div');
        sitesGrid.className = 'sites-grid';
        
        if (data.sites) {
            data.sites.forEach((site, index) => {
                const siteDiv = document.createElement('div');
                siteDiv.className = 'site';
                siteDiv.innerHTML = `
                    <div class="site-info">
                        <span class="site-name">${site.name}</span>
                        <span class="site-url">${site.url}</span>
                    </div>
                    <button class="open-button" onclick="openSite(${index})">
                        Abrir Site
                    </button>
                `;
                sitesGrid.appendChild(siteDiv);
            });
        }
        
        sitesContainer.appendChild(sitesGrid);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('sites').innerHTML = 
            `<div class="error">Erro ao carregar sites</div>`;
    }
});

async function openSite(siteId) {
    const button = event.target;
    const originalText = button.textContent;
    
    try {
        // Desabilita o botão e mostra loading
        button.disabled = true;
        button.textContent = 'Abrindo...';
        
        // Chama a API para abrir o site via backend (usando webbrowser)
        const response = await fetch(`/open_site/${siteId}`);
        const result = await response.json();
        
        if (!result.success) {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        alert('Erro ao abrir o site');
        console.error(error);
    } finally {
        // Restaura o botão ao estado original
        button.disabled = false;
        button.textContent = originalText;
    }
}