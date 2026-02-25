let currentPage = 'landing';
let isLoggedIn = false;
let authMode = 'login'; // 'login' or 'register'

// ==========================================
// Page Navigation
// ==========================================

function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Close mobile menu if open
        closeMobileMenu();
        
        // Update navigation
        updateNavigation();
    }
}

function updateNavigation() {
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update navbar for logged in state
    if (isLoggedIn) {
        updateLoggedInNav();
    }
}

function updateLoggedInNav() {
    const navLinks = document.getElementById('navLinks');
    const navActions = document.getElementById('navActions');
    
    if (navLinks && navActions) {
        navLinks.innerHTML = `
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">لوحة التحكم</a>
            <a href="#" class="nav-link" onclick="showPage('courses'); return false;">الدورات التدريبية</a>
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">المستثمرون</a>
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">متابعة التقدم</a>
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">الملف الشخصي</a>
        `;
        
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">
                تسجيل الخروج
            </button>
        `;
    }
}

function logout() {
    isLoggedIn = false;
    showPage('landing');
    
    // Reset navigation
    const navLinks = document.getElementById('navLinks');
    const navActions = document.getElementById('navActions');
    
    if (navLinks && navActions) {
        navLinks.innerHTML = `
            <a href="#" class="nav-link active" data-page="landing" onclick="showPage('landing'); return false;">الرئيسية</a>
            <a href="#" class="nav-link" data-page="about">من نحن</a>
            <a href="#" class="nav-link" data-page="contact">تواصل معنا</a>
        `;
        
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="showPage('auth')">تسجيل الدخول</button>
            <button class="btn btn-primary" onclick="showPage('auth')">ابدئي الآن</button>
        `;
    }
}

// ==========================================
// Mobile Menu
// ==========================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

function closeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.getAttribute('data-page');
        if (page) {
            e.preventDefault();
            showPage(page);
        }
    });
});

// ==========================================
// Auth Forms
// ==========================================

function switchAuthTab(mode) {
    authMode = mode;
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const authTabs = document.querySelectorAll('.auth-tab');
    
    // Update tabs
    authTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.textContent = 'أهلاً بعودتك!';
        authTabs[1].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.textContent = 'ابدئي رحلتك معنا';
        authTabs[0].classList.add('active');
    }
}

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate login
        isLoggedIn = true;
        showPage('dashboard');
        
        // Show success message
        showToast('تم تسجيل الدخول بنجاح! 🎉', 'success');
    });
}

// Handle Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate registration
        isLoggedIn = true;
        showPage('dashboard');
        
        // Show success message
        showToast('تم إنشاء حسابك بنجاح! مرحباً بك في منصة تمكين 🎉', 'success');
    });
}

// ==========================================
// Toast Notifications
// ==========================================

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 5rem;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#7c3aed'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Scroll Effects
// ==========================================

let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow to navbar on scroll
    if (currentScroll > 10) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// Form Validation
// ==========================================

// Add real-time validation to form inputs
const formInputs = document.querySelectorAll('input[required]');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#dc2626';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#7c3aed';
    });
});

// ==========================================
// Image Lazy Loading
// ==========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// Statistics Counter Animation
// ==========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            if (statValue && !statValue.dataset.animated) {
                const value = parseInt(statValue.textContent.replace(/[^0-9]/g, ''));
                statValue.dataset.animated = 'true';
                // animateCounter(statValue, value);
            }
        }
    });
}, { threshold: 0.5 });

const stats = document.querySelectorAll('.stat');
stats.forEach(stat => statsObserver.observe(stat));

// ==========================================
// Initialize
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('منصة تمكين رائدات الأعمال - تم تحميل الموقع بنجاح ✅');
    
    // Show landing page by default
    showPage('landing');
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '1';
    }, 100);
});

// ==========================================
// Keyboard Navigation
// ==========================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && mobileMenu) {
        closeMobileMenu();
    }
});

// ==========================================
// Performance Monitoring
// ==========================================

if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log(`وقت تحميل الصفحة: ${entry.loadEventEnd - entry.fetchStart}ms`);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// ==========================================
// Export functions for global use
// ==========================================

window.showPage = showPage;
window.switchAuthTab = switchAuthTab;
window.logout = logout;
window.showToast = showToast;
