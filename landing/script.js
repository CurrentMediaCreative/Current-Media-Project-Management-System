document.addEventListener('DOMContentLoaded', () => {
    // Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // For now, just log the form data
            console.log('Form submitted:', formData);
            
            // Clear form
            contactForm.reset();
            
            // Show success message
            alert('Thank you for your message. We will get back to you soon!');
        });
    }

    // Toggle between landing pages
    function showMainLanding() {
        document.getElementById('main-landing').classList.remove('hidden');
        document.getElementById('coming-soon').classList.add('hidden');
    }

    function showComingSoon() {
        document.getElementById('main-landing').classList.add('hidden');
        document.getElementById('coming-soon').classList.remove('hidden');
    }

    // Expose these functions globally for easy toggling
    window.showMainLanding = showMainLanding;
    window.showComingSoon = showComingSoon;

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }

    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.about-content, .contact-form');
    const fadeOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
});
