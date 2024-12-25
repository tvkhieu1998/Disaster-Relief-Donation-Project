// includeHeaderFooter.js
async function loadComponent(componentId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Failed to load component');
        const componentHTML = await response.text();
        document.getElementById(componentId).innerHTML = componentHTML;
    } catch (error) {
        console.error(error);
    }
}

loadComponent('header-placeholder', '/Pages/Framework/header.html');
loadComponent('footer-placeholder', '/Pages/Framework/footer.html');