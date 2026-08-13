// --- Supabase Database Integration Config ---
// Replace these with your actual Supabase credentials to link lead collection
const SUPABASE_URL = 'https://jgypztdvfljamqjvsnlm.supabase.co';       // e.g., 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpneXB6dGR2ZmxqYW1xanZzbmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0Njk4NzgsImV4cCI6MjEwMjA0NTg3OH0.74XypToBAH1z935Rcr5Esd_8HIeXEHLXcKUeMaA31ws';  // e.g., 'your-anon-public-key'

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle(); // Initialize theme logic first to avoid layout shift
    initHeaderScroll();
    initMobileNav();
    initSmoothScroll();
    initScrollSpy();
    initFaqAccordion();
    initFormValidation();
    initCursorTrail();
    initScrollReveal();
    initInteractive3D();
});

/* --- 1. Header Scroll Effect --- */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page starts scrolled
}

/* --- 2. Mobile Navigation Overlay --- */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');
    
    if (!toggleBtn || !overlay) return;

    const toggleMenu = () => {
        const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isOpen);
        overlay.classList.toggle('open', !isOpen);
        document.body.style.overflow = !isOpen ? 'hidden' : ''; // Prevent scroll when menu is open
    };

    toggleBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (overlay.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

/* --- 3. Smooth Scroll Navigation --- */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Offset calculation for sticky header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (headerHeight - 10);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --- 4. Scrollspy (Active Navigation Links) --- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - (headerHeight + 40);
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --- 5. FAQ Accordion --- */
function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs (optional - accordion behavior)
            questions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                    otherQuestion.nextElementSibling.setAttribute('aria-hidden', 'true');
                }
            });

            // Toggle current FAQ
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
                answer.setAttribute('aria-hidden', 'true');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

/* --- 6. Form Validation & Submission --- */
function initFormValidation() {
    const form = document.getElementById('lead-form');
    const successState = document.getElementById('form-success');
    const successPhone = document.getElementById('success-phone');
    const resetBtn = document.getElementById('success-reset-btn');
    
    if (!form || !successState) return;

    const fields = [
        { id: 'shop-name', errorId: 'shop-name-error', validate: val => val.trim() !== '' },
        { id: 'shop-type', errorId: 'shop-type-error', validate: val => val !== '' },
        { id: 'owner-name', errorId: 'owner-name-error', validate: val => val.trim() !== '' },
        { id: 'phone', errorId: 'phone-error', validate: val => {
            const digits = val.replace(/\D/g, ''); // Extract numbers only
            return digits.length === 10;
        }},
        { id: 'area', errorId: 'area-error', validate: val => val.trim() !== '' }
    ];

    // Real-time validation on blur & input
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input) return;

        const validateField = () => {
            const isValid = field.validate(input.value);
            const formGroup = input.closest('.form-group');
            if (isValid) {
                formGroup.classList.remove('has-error');
            } else {
                formGroup.classList.add('has-error');
            }
            return isValid;
        };

        input.addEventListener('blur', validateField);
        input.addEventListener('input', () => {
            // Remove error immediately when user fixes input
            if (field.validate(input.value)) {
                input.closest('.form-group').classList.remove('has-error');
            }
        });
    });

    // Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Final validation run on all fields
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const isValid = field.validate(input.value);
            const formGroup = input.closest('.form-group');
            
            if (!isValid) {
                formGroup.classList.add('has-error');
                isFormValid = false;
            } else {
                formGroup.classList.remove('has-error');
            }
        });

        if (isFormValid) {
            submitForm();
        }
    });

    // Post lead submission payload to Supabase Database
    const submitToSupabase = async (payload) => {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || 'Database submission rejected.');
        }
        return true;
    };

    const submitForm = async () => {
        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.btn-spinner');
        const phoneVal = document.getElementById('phone').value;

        // Collect fields
        const payload = {
            shop_name: document.getElementById('shop-name').value,
            shop_type: document.getElementById('shop-type').value,
            owner_name: document.getElementById('owner-name').value,
            phone: phoneVal,
            area: document.getElementById('area').value,
            challenge: document.getElementById('challenge').value
        };

        // Set Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Submitting...';
        spinner.classList.remove('hidden');

        try {
            if (SUPABASE_URL && SUPABASE_ANON_KEY) {
                // Submit directly to your Supabase instance
                await submitToSupabase(payload);
            } else {
                // Fallback simulation (if keys are blank)
                console.warn("Supabase credentials not configured. Simulating lead capture.");
                await new Promise(resolve => setTimeout(resolve, 1200));
            }

            // Show Success State
            form.classList.add('hidden');
            successState.classList.remove('hidden');
            
            // Format phone number output securely
            const cleanPhone = phoneVal.replace(/\D/g, '');
            successPhone.textContent = `+91 ${cleanPhone.slice(0,5)}-${cleanPhone.slice(5)}`;
            
            // Smooth scroll to form header
            document.getElementById('signup').scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            alert(`Unable to submit request: ${err.message || 'Connection failure'}. Please verify your API key configurations or email us at hello@zaidar.com.`);
        } finally {
            // Reset Loading State
            submitBtn.disabled = false;
            btnText.textContent = 'Submit Request';
            spinner.classList.add('hidden');
        }
    };

    // Reset Form Success State
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            
            // Clear any lingering validation errors
            fields.forEach(field => {
                const input = document.getElementById(field.id);
                if (input) {
                    input.closest('.form-group').classList.remove('has-error');
                }
            });
            
            successState.classList.add('hidden');
            form.classList.remove('hidden');
        });
    }
}

/* --- 7. Interactive Cursor Trail --- */
function initCursorTrail() {
    const dots = document.querySelectorAll('.cursor-dot');
    if (dots.length === 0) return;

    const mouse = { x: 0, y: 0 };
    const points = Array.from({ length: dots.length }, () => ({ x: 0, y: 0 }));

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const tick = () => {
        // First point matches the cursor coordinates
        points[0].x = mouse.x;
        points[0].y = mouse.y;

        // Subsesquent points drag with linear interpolation delay
        for (let i = 1; i < points.length; i++) {
            points[i].x += (points[i - 1].x - points[i].x) * 0.35;
            points[i].y += (points[i - 1].y - points[i].y) * 0.35;
        }

        // Apply transformations to DOM trail
        dots.forEach((dot, idx) => {
            const pt = points[idx];
            dot.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
            
            // Fade size and opacity down the chain
            const scale = (dots.length - idx) / dots.length;
            dot.style.opacity = idx === 0 ? '0.85' : (0.75 * scale).toString();
            
            // Prevent display on first render before pointer movements
            if (pt.x === 0 && pt.y === 0) {
                dot.style.opacity = '0';
            }
        });

        requestAnimationFrame(tick);
    };
    tick();
}

/* --- 8. Intersection Observer Scroll Reveal --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Unobserve once animation is complete to keep it lightweight
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
}

/* --- 9. Light/Dark Theme Toggle --- */
function initThemeToggle() {
    const themeCheckbox = document.getElementById('theme-checkbox');
    const mobileToggleBtn = document.getElementById('mobile-theme-toggle');
    
    // Read saved preference, default to light theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme state to DOM
    const applyTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Sync checkbox state
        if (themeCheckbox) {
            themeCheckbox.checked = theme === 'dark';
        }
        
        // Update mobile toggle button text state
        if (mobileToggleBtn) {
            const toggleText = mobileToggleBtn.querySelector('.theme-toggle-text');
            if (toggleText) {
                toggleText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
            }
        }
    };
    
    applyTheme(savedTheme);
    
    // Checkbox change listener
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', () => {
            const nextTheme = themeCheckbox.checked ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }
    
    // Mobile button click listener
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }
}

/* --- 10. Interactive Reactive 3D Parallax Movement --- */
function initInteractive3D() {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Only track mouse movement on non-mobile devices with hover capabilities
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            // Normalize coordinates between -0.5 and 0.5 relative to screen center
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        });
        
        // Easing interpolation loops
        function update() {
            // Lerp towards target position to create physical inertia (heavy floating liquid feel)
            currentX += (mouseX - currentX) * 0.035;
            currentY += (mouseY - currentY) * 0.035;
            
            const shapes = document.querySelectorAll('.visual-3d, .visual-glass-card');
            shapes.forEach(shape => {
                let depth = 32;
                
                // Adjust responsive depth translation depending on elements
                if (shape.classList.contains('visual-glass-card')) {
                    depth = 28;
                } else if (shape.classList.contains('visual-3d-torus')) {
                    depth = 38;
                }
                
                const mx = currentX * depth;
                const my = currentY * depth;
                
                shape.style.setProperty('--mx', `${mx}px`);
                shape.style.setProperty('--my', `${my}px`);
            });
            
            requestAnimationFrame(update);
        }
        
        requestAnimationFrame(update);
    }
}
