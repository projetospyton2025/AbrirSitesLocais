document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/list_sites');
        const data = await response.json();
        
        const sitesContainer = document.getElementById('sites');
        
        if (data.error) {
            sitesContainer.innerHTML = `<div class="error">${data.error}</div>`;
            return;
        }

        // Adiciona botão para abrir todos os sites
        const openAllSection = document.createElement('div');
        openAllSection.className = 'open-all-section';
        openAllSection.innerHTML = `
            <p class="open-all-info">Clique no botão abaixo para abrir todos os sites em novas abas</p>
            <button class="open-all-button" id="openAllButton">
                Abrir Todos os Sites
            </button>
        `;
        sitesContainer.appendChild(openAllSection);

        // Handler para o botão de abrir todos
        document.getElementById('openAllButton').addEventListener('click', function() {
            data.sites.forEach(site => {
                window.open(site.url, '_blank');
            });
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
                    <a href="${site.url}" target="_blank" class="open-button">
                        Abrir Site
                    </a>
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