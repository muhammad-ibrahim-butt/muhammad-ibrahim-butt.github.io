document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.getElementById('mobile-toggle');
const menu = document.getElementById('mobile-menu');
const mobile = window.matchMedia('(max-width: 767px)');
const setMenuOpen = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
};
const syncNavigation = () => {
    toggle.hidden = !mobile.matches;
    setMenuOpen(false);
};
toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
    }
});
document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false);
});
mobile.addEventListener('change', syncNavigation);
syncNavigation();
document.documentElement.classList.add('js');
