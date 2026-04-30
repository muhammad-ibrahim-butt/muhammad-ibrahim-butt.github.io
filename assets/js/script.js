document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const nav = document.getElementById('nav');
const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
    const btn = document.getElementById('scroll-top');
    if (window.scrollY > 600) {
        btn.classList.remove('opacity-0', 'invisible');
        btn.classList.add('opacity-100', 'visible');
    } else {
        btn.classList.add('opacity-0', 'invisible');
        btn.classList.remove('opacity-100', 'visible');
    }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const setMobileMenuOpen = (open) => {
    mobileMenu?.classList.toggle('open', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
};

mobileToggle?.addEventListener('click', () => {
    setMobileMenuOpen(!mobileMenu?.classList.contains('open'));
});
mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setMobileMenuOpen(false));
});

const fadeTargets = document.querySelectorAll('.fade-in');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    fadeTargets.forEach(el => el.classList.add('visible'));
} else {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fadeTargets.forEach(el => observer.observe(el));
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        setMobileMenuOpen(false);
    }
});

document.addEventListener('click', (event) => {
    if (!mobileMenu?.classList.contains('open')) {
        return;
    }
    if (!mobileMenu.contains(event.target) && !mobileToggle?.contains(event.target)) {
        setMobileMenuOpen(false);
    }
});

document.getElementById('scroll-top')?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
});

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});
