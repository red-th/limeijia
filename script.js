const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroIndicators = document.querySelector('.hero-indicators');
const counters = document.querySelectorAll('.counter');
const backToTop = document.querySelector('.back-to-top');
const productTabs = document.querySelectorAll('.product-tab');
const productPanels = document.querySelectorAll('.product-panel');

let currentSlide = 0;
let sliderTimer = null;

const initNavigation = () => {
    if (!navToggle || !siteNav) return;

    navToggle.addEventListener('click', () => {
        siteNav.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            siteNav.classList.remove('open');
            setActiveNav(link);
        });
    });
};

const setActiveNav = (activeLink) => {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
};

const initHeroSlider = () => {
    if (!heroSlides.length || !heroIndicators) return;

    heroSlides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('aria-label', `切换到第 ${index + 1} 张焦点图`);
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        heroIndicators.appendChild(indicator);
    });

    sliderTimer = setInterval(nextSlide, 6000);
};

const goToSlide = (index) => {
    heroSlides[currentSlide].classList.remove('active');
    heroIndicators.children[currentSlide].classList.remove('active');

    currentSlide = index;

    heroSlides[currentSlide].classList.add('active');
    heroIndicators.children[currentSlide].classList.add('active');

    resetSliderTimer();
};

const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    goToSlide(nextIndex);
};

const resetSliderTimer = () => {
    if (!sliderTimer) return;
    clearInterval(sliderTimer);
    sliderTimer = setInterval(nextSlide, 6000);
};

const initProductTabs = () => {
    if (!productTabs.length) return;

    productTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            productTabs.forEach(btn => btn.classList.remove('active'));
            productPanels.forEach(panel => panel.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
};

const initCounters = () => {
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
};

const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 2000;
    const start = 0;
    let startTime = null;

    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * (target - start) + start);
        counter.textContent = current;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            counter.textContent = target;
        }
    };

    window.requestAnimationFrame(step);
};

const initScrollSpy = () => {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (link) setActiveNav(link);
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
};

const initBackToTop = () => {
    if (!backToTop) return;

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 520) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroSlider();
    initProductTabs();
    initCounters();
    initScrollSpy();
    initBackToTop();
});

