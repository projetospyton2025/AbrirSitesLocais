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
        
        // Informações sobre o ambiente
        const isCloud = data.browser_info?.is_cloud || false;
        const browserName = data.browser_info?.name || "navegador";
        
        // Mostra informação sobre qual navegador está sendo usado
        if (data.browser_info) {
            if (isCloud) {
                browserInfoElement.innerHTML = `<strong>Modo Web</strong> - Sites abrirão no seu navegador`;
                browserInfoElement.className = 'browser-cloud';
            } else {
                browserInfoElement.innerHTML = `Usando: <strong>${browserName}</strong>`;
                browserInfoElement.className = browserName.includes('Firefox') ? 'browser-firefox' : 'browser-edge';
            }
        }

        // Adiciona botão para abrir todos os sites
        const openAllSection = document.createElement('div');
        openAllSection.className = 'open-all-section';
        openAllSection.innerHTML = `
            <p class="open-all-info">Clique no botão abaixo para abrir todos os sites ${isCloud ? 'em novas abas' : 'no ' + browserName}</p>
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
                
                // Chama a API para abrir todos os sites
                const response = await fetch('/open_all_sites');
                const result = await response.json();
                
                if (result.success) {
                    // Se estamos na nuvem ou se o navegador não abriu, abre via JavaScript
                    if (!result.browser_opened && result.urls) {
                        // Abre o primeiro site em uma nova janela
                        const firstWindow = window.open(result.urls[0], '_blank');
                        
                        // Se o bloqueador de pop-ups impediu a abertura
                        if (!firstWindow || firstWindow.closed || typeof firstWindow.closed === 'undefined') {
                            alert('Por favor, permita pop-ups para este site para abrir todos os links.');
                            // Tenta abrir só o primeiro site
                            window.open(result.urls[0], '_blank');
                        } else {
                            // Espera um pouco e abre os outros sites
                            setTimeout(() => {
                                // Abre os outros sites em novas abas
                                for (let i = 1; i < result.urls.length; i++) {
                                    window.open(result.urls[i], '_blank');
                                }
                            }, 500);
                        }
                    }
                    
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
                    <button class="open-button" onclick="openSite(${index}, '${site.url}')" data-url="${site.url}">
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

async function openSite(siteId, fallbackUrl) {
    const button = event.target;
    const originalText = button.textContent;
    
    try {
        // Desabilita o botão e mostra loading
        button.disabled = true;
        button.textContent = 'Abrindo...';
        
        // Chama a API para tentar abrir o site via backend
        const response = await fetch(`/open_site/${siteId}`);
        const result = await response.json();
        
        if (result.success) {
            // Se o backend não conseguiu abrir o navegador, abrimos via JavaScript
            if (!result.browser_opened) {
                window.open(result.url, '_blank');
            }
        } else {
            // Se houve um erro na API, usamos o fallback
            if (fallbackUrl) {
                window.open(fallbackUrl, '_blank');
            } else {
                alert(`Erro: ${result.message}`);
            }
        }
    } catch (error) {
        // Em caso de erro, tentamos o fallback
        if (fallbackUrl) {
            window.open(fallbackUrl, '_blank');
        } else {
            alert('Erro ao abrir o site');
            console.error(error);
        }
    } finally {
        // Restaura o botão ao estado original
        button.disabled = false;
        button.textContent = originalText;
    }
}