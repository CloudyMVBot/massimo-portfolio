/* Shared navigation. Runs before script.js binds its menu interactions. */
(function () {
    'use strict';
    const menu = document.getElementById('navMenu');
    if (!menu) return;
    const links = [
        ['index.html', 'Home'],
        ['spatial-storytelling.html', 'Spatial Storytelling'],
        ['content-strategy.html', 'Content Strategy'],
        ['branded-content.html', 'Branded Content'],
        ['index.html#about', 'About']
    ];
    const filename = location.pathname.split('/').pop() || 'index.html';
    const page = filename === 'viral-selects.html' ? 'content-strategy.html' :
        filename === 'exhibited-work.html' ? 'spatial-storytelling.html' : filename;
    const fragment = document.createDocumentFragment();
    links.forEach(function ([href, label]) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = href;
        link.className = 'nav-link';
        link.textContent = label;
        if (href === page) {
            link.classList.add('active');
            if (page === filename) link.setAttribute('aria-current', 'page');
        }
        item.appendChild(link);
        fragment.appendChild(item);
    });
    menu.replaceChildren(fragment);
})();
