// Navigation and scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });
    
    // Initialize skill bars with width values from the style
    const skillLevels = document.querySelectorAll('.skill-level');
    skillLevels.forEach(skill => {
        const width = skill.style.width;
        skill.style.width = '0';
        skill.setAttribute('data-width', width);
    });
    
    // Animate skill bars when in viewport
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(skillBar => {
            const skillBarTop = skillBar.getBoundingClientRect().top;
            const targetWidth = skillBar.getAttribute('data-width') || skillBar.style.width;
            
            if (skillBarTop < window.innerHeight * 0.8) {
                skillBar.style.width = targetWidth;
            }
        });
    }
    
    // Animate elements when they enter the viewport
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.section-title, .about-text p, .detail, .skill-category h3, .project-card, .timeline-item, .contact-item');
        
        animatedElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementBottom = el.getBoundingClientRect().bottom;
            
            // If element is in viewport
            if (elementTop < window.innerHeight * 0.8 && elementBottom > 0) {
                if (!el.classList.contains('animated')) {
                    el.classList.add('animated');
                    
                    // For section titles
                    if (el.classList.contains('section-title')) {
                        el.style.animation = 'titleFadeIn 1s forwards';
                    }
                    
                    // For project cards
                    if (el.classList.contains('project-card')) {
                        el.style.animation = 'projectAppear 0.8s forwards';
                    }
                    
                    // For timeline items
                    if (el.classList.contains('timeline-item')) {
                        el.style.animation = 'timelineReveal 1s forwards';
                    }
                }
            }
        });
        
        // Animate skill bars
        animateSkillBars();
    }
    
    // Call on initial load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Scroll reveal animations
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 1000,
        delay: 200
    });
    
    // If ScrollReveal is defined (optionally include the library later)
    if (typeof ScrollReveal !== 'undefined') {
        sr.reveal('.hero-content, .section-title', {});
        sr.reveal('.about-text, .contact-info', { delay: 300 });
        sr.reveal('.skill-item, .timeline-item, .project-card', { interval: 200 });
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const formElements = contactForm.elements;
            let isValid = true;
            
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].hasAttribute('required') && !formElements[i].value) {
                    isValid = false;
                    formElements[i].style.borderColor = 'red';
                } else if (formElements[i].type !== 'submit') {
                    formElements[i].style.borderColor = '';
                }
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Collect form data
                const formData = new FormData(contactForm);
                
                // Send data to backend
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Reset button
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Create success message
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>${data.message || 'Your message has been sent successfully!'}</p>
                    `;
                    successMessage.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 15px;
                        background-color: #d4edda;
                        color: #155724;
                        border-radius: 8px;
                        margin-top: 20px;
                    `;
                    successMessage.querySelector('i').style.cssText = `
                        font-size: 1.5rem;
                        color: #28a745;
                    `;
                    
                    // Add message to the DOM
                    contactForm.after(successMessage);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Remove message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                })
                .catch(error => {
                    // Reset button
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.classList.add('error-message');
                    errorMessage.innerHTML = `
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Oops! Something went wrong. Please try again later.</p>
                    `;
                    errorMessage.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 15px;
                        background-color: #f8d7da;
                        color: #721c24;
                        border-radius: 8px;
                        margin-top: 20px;
                    `;
                    errorMessage.querySelector('i').style.cssText = `
                        font-size: 1.5rem;
                        color: #dc3545;
                    `;
                    
                    // Add message to the DOM
                    contactForm.after(errorMessage);
                    
                    // Remove message after 5 seconds
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 5000);
                    
                    console.error('Error:', error);
                });
            }
        });
    }
    
    // Type animation for hero section (optional)
    const typingElement = document.querySelector('.hero-text h2');
    if (typingElement && typeof Typed !== 'undefined') {
        const typed = new Typed(typingElement, {
            strings: [
                'Computer Science Engineering Student',
                'Frontend Developer',
                'Machine Learning Enthusiast',
                'Problem Solver'
            ],
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }
    
    // Project filtering (can be implemented if categories are added)
    // This is a placeholder for future enhancement
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                    } else if (!card.classList.contains(filterValue)) {
                        card.style.display = 'none';
                    } else {
                        card.style.display = 'block';
                    }
                });
            });
        });
    }
    
    // Add particle animation to hero section background
    const heroBg = document.querySelector('.hero');
    if (heroBg) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position, size and animation delay
            const size = Math.random() * 10 + 5; // Between 5-15px
            const posX = Math.random() * 100; // 0-100%
            const posY = Math.random() * 100; // 0-100%
            const delay = Math.random() * 5; // 0-5s delay
            const duration = Math.random() * 10 + 10; // 10-20s duration
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                animation: float ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                pointer-events: none;
                opacity: 0.${Math.floor(Math.random() * 8) + 1};
            `;
            
            heroBg.appendChild(particle);
        }
    }
    
    // Animate project cards on hover with 3D effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            this.style.transition = 'transform 0.5s ease';
        });
    });
});

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Dark mode toggle functionality (optional enhancement)
const darkModeToggle = document.querySelector('.dark-mode-toggle');
if (darkModeToggle) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set the initial theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.classList.add('active');
    }
    
    // Toggle theme when button is clicked
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.classList.toggle('active');
        
        // Save preference to localStorage
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Particle Background
function createParticles() {
    const container = document.querySelector('.hero');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(particle);
    }
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// 3D Card Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Dynamic Color Theme
function updateColorTheme() {
    const hue = Math.random() * 360;
    document.documentElement.style.setProperty('--primary-color', `hsl(${hue}, 70%, 50%)`);
    document.documentElement.style.setProperty('--secondary-color', `hsl(${(hue + 60) % 360}, 70%, 50%)`);
}

// Smooth Scroll
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

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateColorTheme();
    
    // Update color theme every 30 seconds
    setInterval(updateColorTheme, 30000);
});

// Enhanced Navigation
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Enhanced Form Validation
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            form.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Enhanced Skill Bars
const skillBars = document.querySelectorAll('.skill-bar');
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        bar.style.width = percentage + '%';
    });
};

// Animate skill bars when they come into view
const skillSection = document.querySelector('.skills');
if (skillSection) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillObserver.observe(skillSection);
}

// Enhanced Project Cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// Dynamic Background
const background = document.querySelector('.hero');
if (background) {
    background.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = Math.round((clientX / window.innerWidth) * 100);
        const y = Math.round((clientY / window.innerHeight) * 100);
        
        background.style.backgroundPosition = `${x}% ${y}%`;
    });
} 