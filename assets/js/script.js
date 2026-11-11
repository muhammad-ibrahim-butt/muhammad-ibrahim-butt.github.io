document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.getElementById('mobile-toggle');
const menu = document.getElementById('mobile-menu');
const mobile = window.matchMedia('(max-width: 767px)');
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        toggle.focus();
    }
});
document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
});
document.addEventListener('focusin', event => {
    if (!menu.contains(event.target)) menu.open = false;
});
mobile.addEventListener('change', () => { menu.open = false; });
