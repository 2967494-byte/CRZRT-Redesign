document.addEventListener('DOMContentLoaded', () => {
    // Reveal functionality
    const revealElements = document.querySelectorAll('.hero-title, .hero-subtitle, .why-card, .direction-tile, .section-title, .tag, .testimonial-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        revealObserver.observe(el);
    });

    // Stats Counter
    const stats = document.querySelectorAll('.stat-value');

    const countUp = (el) => {
        const target = +el.getAttribute('data-count');
        const count = +el.innerText.replace('+', ''); // Remove + for safety
        const speed = target / 100; // Increment step

        if (count < target) {
            el.innerText = Math.ceil(count + speed) + (el.getAttribute('data-plus') ? '+' : '');
            setTimeout(() => countUp(el), 20);
        } else {
            el.innerText = target + (el.getAttribute('data-plus') ? '+' : '');
        }
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));


    // Tilt Effect for Cards
    const cards = document.querySelectorAll('.why-card, .course-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });



    // Header Blur Effect on Scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.style.backdropFilter = "blur(20px)";
            header.style.background = "var(--glass-bg)";
        } else {
            header.style.backdropFilter = "blur(20px)";
            header.style.background = "var(--glass-bg)";
        }
        lastScroll = currentScroll;
    });


    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Default to light
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Smooth Scroll for Header Nav Bar
    const navBarItems = document.querySelectorAll('.nav-bar-item');

    navBarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
