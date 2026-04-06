export function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navMenu = nav ? nav.querySelector('.nav-menu') : null;

    if (!hamburger || !navMenu) {
        console.error('Navigation elements not found');
        return;
    }

    hamburger.addEventListener('click', () => {
        toggleMenu(hamburger, navMenu);
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeMenu(hamburger, navMenu);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu(hamburger, navMenu);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMenu(hamburger, navMenu);
        }
    });

    setupWayfinding();
}

function toggleMenu(hamburger, menu) {
    const isActive = hamburger.classList.toggle('active');
    menu.classList.toggle('active');

    hamburger.setAttribute('aria-expanded', isActive);

    if (isActive && window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMenu(hamburger, menu) {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function setupWayfinding() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');


        link.classList.remove('active');
        link.removeAttribute('aria-current');


        if (
            (currentPage === 'index.html' || currentPage === '') &&
            (href === 'index.html' || href === '/')
        ) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else if (currentPage === href || currentPage.includes(href.replace('.html', ''))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page || 'index.html';
}

export function scrollToSection(targetId) {
    const target = document.getElementById(targetId);

    if (!target) return;

    const headerHeight = document.querySelector('header').offsetHeight;
    const navHeight = document.querySelector('nav').offsetHeight;
    const totalOffset = headerHeight + navHeight + 20;

    const targetPosition = target.offsetTop - totalOffset;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

export function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#' || href === '#video') return;

            e.preventDefault();
            const targetId = href.substring(1);
            scrollToSection(targetId);
        });
    });
}

export default {
    initNavigation,
    scrollToSection,
    initSmoothScroll
};
