document.addEventListener('DOMContentLoaded', function () {
    const viewport = document.querySelector('.map-viewport');
    if (!viewport) return;
    const markers = document.querySelectorAll('.map-marker');
    const places = document.querySelectorAll('.exhibition-place');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function selectPlace(key) {
        const place = Array.from(places).find(function (item) { return item.dataset.place === key; });
        const marker = Array.from(markers).find(function (item) { return item.dataset.place === key; });
        if (!place || !marker) return;
        document.querySelectorAll('[data-place]').forEach(function (item) {
            const selected = item.dataset.place === key;
            item.classList.toggle('is-selected', selected);
            item.setAttribute('aria-pressed', String(selected));
        });
        document.getElementById('map-selected-city').textContent = place.dataset.city;
        document.getElementById('map-selected-venue').textContent = place.dataset.venue;
        document.getElementById('map-selected-coordinates').textContent = place.dataset.coordinates;
        if (viewport.scrollWidth > viewport.clientWidth) {
            const svg = viewport.querySelector('svg');
            const x = Number(marker.dataset.mapX) / 1120 * svg.getBoundingClientRect().width;
            viewport.scrollTo({ left: x - viewport.clientWidth / 2, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
        }
    }

    document.querySelectorAll('[data-place]').forEach(function (control) {
        control.addEventListener('click', function () { selectPlace(control.dataset.place); });
        if (control.classList.contains('map-marker')) {
            control.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectPlace(control.dataset.place);
                }
            });
        }
    });
});
