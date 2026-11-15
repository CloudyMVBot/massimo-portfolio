/* Shared navigation accessibility and on-scroll growth charts. */
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const mobile = window.matchMedia('(max-width: 900px)');

    function syncExpanded() {
        toggle.setAttribute('aria-expanded', String(menu.classList.contains('active')));
    }

    // Shared navigation runs first; reflect its state for assistive technology.
    toggle.addEventListener('click', syncExpanded);
    menu.addEventListener('click', syncExpanded);
    document.addEventListener('keydown', function (event) {
        if (!mobile.matches || !menu.classList.contains('active')) return;
        if (event.key === 'Escape') {
            toggle.click();
            toggle.focus();
        }
        if (event.key === 'Tab') {
            const links = menu.querySelectorAll('a[href]');
            const last = links[links.length - 1];
            if (event.shiftKey && document.activeElement === toggle) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                toggle.focus();
            }
        }
    });
    mobile.addEventListener('change', function () {
        if (menu.classList.contains('active')) toggle.click();
    });
    syncExpanded();

    const charts = document.querySelectorAll('.growth-chart');
    if (charts.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('charts-ready');
        const chartObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        charts.forEach(function (chart) { chartObserver.observe(chart); });
    } else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        charts.forEach(function (chart) { chart.classList.add('is-visible'); });
    }

    // Keep small signal loops local to visible surfaces and honor motion preferences.
    const pulseSurfaces = document.querySelectorAll('[data-pulse-surface]');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visibleSurfaces = new Set();
    function syncSignalMotion() {
        pulseSurfaces.forEach(function (surface) {
            const group = surface.closest('[data-signal-group]');
            const paused = group && group.dataset.signalsPaused === 'true';
            surface.classList.toggle('motion-active', visibleSurfaces.has(surface) && !document.hidden && !motionPreference.matches && !paused);
        });
        document.querySelectorAll('[data-signal-toggle]').forEach(function (button) {
            button.disabled = motionPreference.matches;
        });
    }
    document.querySelectorAll('[data-signal-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            const group = button.closest('[data-signal-group]');
            const paused = group.dataset.signalsPaused !== 'true';
            group.dataset.signalsPaused = String(paused);
            button.setAttribute('aria-pressed', String(paused));
            button.textContent = paused ? 'Resume signals' : 'Pause signals';
            syncSignalMotion();
        });
    });
    if (pulseSurfaces.length && 'IntersectionObserver' in window) {
        const signalObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) visibleSurfaces.add(entry.target);
                else visibleSurfaces.delete(entry.target);
            });
            syncSignalMotion();
        }, { threshold: 0.1 });
        pulseSurfaces.forEach(function (surface) { signalObserver.observe(surface); });
        document.addEventListener('visibilitychange', syncSignalMotion);
        motionPreference.addEventListener('change', syncSignalMotion);
    }
});
