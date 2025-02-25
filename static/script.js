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
        const openAllButton = document.createElement('button');
        openAllButton.className = 'open-all-button';
        openAllButton.innerHTML = 'Abrir Todos';
        openAllButton.onclick = openAllSites;
        sitesContainer.appendChild(openAllButton);

        // Adiciona os sites
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
                        Abrir
                    </button>
                `;
                sitesContainer.appendChild(siteDiv);
            });
        }
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

async function openAllSites() {
    const button = event.target;
    const originalText = button.textContent;
    
    try {
        // Desabilita o botão e mostra loading
        button.disabled = true;
        button.textContent = 'Abrindo todos os sites...';
        
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
}