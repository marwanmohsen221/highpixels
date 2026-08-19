document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksList = document.querySelector('.nav-links');
    
    // Create mobile menu overlay if needed or just toggle
    // For simplicity, we toggle a class on nav-links
    menuToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('mobile-active');
        menuToggle.classList.toggle('is-active');
        
        // Simple toggle logic for mobile bars
        const bars = menuToggle.querySelectorAll('.bar');
        if (menuToggle.classList.contains('is-active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            navLinksList.style.display = 'flex';
            navLinksList.style.flexDirection = 'column';
            navLinksList.style.position = 'absolute';
            navLinksList.style.top = '80px';
            navLinksList.style.left = '0';
            navLinksList.style.width = '100%';
            navLinksList.style.background = 'rgba(10, 10, 12, 0.95)';
            navLinksList.style.padding = '2rem';
            navLinksList.style.gap = '1.5rem';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            navLinksList.style.display = 'none';
        }
    });

    // 4. Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // 5. Active Link Highlighting
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 6. WhatsApp Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Build the WhatsApp message
            const waText =
                `Hello HighPixels,\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Message: ${message}`;

            const encoded = encodeURIComponent(waText);
            const waUrl   = `https://wa.me/201155934426?text=${encoded}`;

            // Animate the button briefly, then redirect
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp…';
            btn.disabled = true;

            setTimeout(() => {
                window.open(waUrl, '_blank');
                contactForm.reset();
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 800);
        });
    }

    // 7. Smooth Scroll for Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    // 8. Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-body').style.maxHeight = null;
                }
            });

            // Toggle current
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        });
    });
});
