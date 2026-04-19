// ==========================================
// منصة تمكين رائدات الأعمال
// ==========================================

let currentPage = 'landing';
let isLoggedIn = false;
let authMode = 'login'; // 'login' or 'register'

const profileState = {
    name: 'سارة القحطاني',
    role: 'رائدة أعمال ومؤسسة ناشئة',
    summary: 'أعمل على بناء حلول رقمية تدعم رواد الأعمال في الإقلاع بمشاريعهم. أستمتع بالتعلم المستمر والتعاون في فرق متعددة التخصصات.',
    experience: '5 سنوات',
    location: 'الرياض، المملكة العربية السعودية',
    status: 'نشط',
    email: 'sara@example.com',
    phone: '+966 5X XXX XXXX',
    social: 'LinkedIn · X · Instagram',
    tags: ['الابتكار', 'التمويل', 'الاستدامة'],
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop'
};
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your actual Google OAuth client ID
let googleIdentityInitialized = false;

// Load remembered login data
function loadRememberedData() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    
    if (rememberedEmail && rememberedPassword) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const rememberMeCheckbox = document.getElementById('rememberMe');
            
            if (emailInput) emailInput.value = rememberedEmail;
            if (passwordInput) passwordInput.value = rememberedPassword;
            if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        }
    }
}

// ==========================================
// Admin Dashboard Access
// ==========================================

// Admin credentials (you can change these)
const ADMIN_CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123'
};

// Helper function to safely set auth flag
function setAdminAuth() {
    // Try multiple storage methods for maximum compatibility
    try {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminTimestamp', Date.now().toString());
    } catch (e) {
        console.error('localStorage failed:', e);
    }
    
    try {
        sessionStorage.setItem('adminAuthenticated', 'true');
    } catch (e) {
        console.error('sessionStorage failed:', e);
    }
    
    // Also set a cookie as backup
    document.cookie = 'adminAuth=true; path=/';
}

// Helper function to check admin auth
function isAdminAuthenticated() {
    const localAuth = localStorage.getItem('adminAuthenticated') === 'true';
    const sessionAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    const cookieAuth = document.cookie.includes('adminAuth=true');
    
    return localAuth || sessionAuth || cookieAuth;
}

// Function to open admin login modal
function openAdminLogin() {
    const modal = document.createElement('div');
    modal.id = 'adminLoginModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        direction: rtl;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        ">
            <h2 style="text-align: center; margin-bottom: 1.5rem; color: #7c3aed;">🔐 تسجيل دخول لوحة التحكم</h2>
            
            <form id="adminLoginForm" onsubmit="authenticateAdmin(event)">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">البريد الإلكتروني</label>
                    <input type="email" id="adminEmail" required style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #d1d5db;
                        border-radius: 8px;
                        font-family: inherit;
                        font-size: 1rem;
                    " placeholder="admin@example.com">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">كلمة المرور</label>
                    <input type="password" id="adminPassword" required style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #d1d5db;
                        border-radius: 8px;
                        font-family: inherit;
                        font-size: 1rem;
                    " placeholder="••••••••">
                </div>
                
                <div id="adminError" style="color: #dc2626; margin-bottom: 1rem; display: none; text-align: center;"></div>
                
                <div style="display: flex; gap: 0.75rem;">
                    <button type="submit" style="
                        flex: 1;
                        padding: 0.75rem;
                        background: #7c3aed;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 1rem;
                    ">دخول</button>
                    <button type="button" onclick="closeAdminModal()" style="
                        flex: 1;
                        padding: 0.75rem;
                        background: #e5e7eb;
                        color: #374151;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 1rem;
                    ">إلغاء</button>
                </div>
            </form>
            
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
                <p style="text-align: center; color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">أو سجل الدخول باستخدام:</p>
                <div id="googleSignInBtn" style="display: flex; justify-content: center;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Render Google Sign-In button after modal is added to DOM
    setTimeout(function() {
        renderGoogleSignInButton();
    }, 100);
}

// Function to authenticate admin
function authenticateAdmin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const errorDiv = document.getElementById('adminError');
    
    // Debug: log the values
    console.log('Email entered:', email);
    console.log('Password entered:', password);
    console.log('Expected Email:', ADMIN_CREDENTIALS.email);
    console.log('Expected Password:', ADMIN_CREDENTIALS.password);
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('✓ Authentication successful!');
        
        try {
            // Set authentication flag using our helper
            setAdminAuth();
            
            console.log('✓ Auth flags set, closing modal...');
            
            // Close modal
            closeAdminModal();
            
            // Use a longer delay and replace instead of href
            setTimeout(function() {
                console.log('✓ Redirecting to admin.html');
                window.location.replace('admin.html');
            }, 300);
        } catch (e) {
            console.error('Error during authentication:', e);
            errorDiv.textContent = 'خطأ في النظام. يرجى المحاولة لاحقاً';
            errorDiv.style.display = 'block';
        }
    } else {
        console.log('✗ Authentication failed - credentials mismatch');
        errorDiv.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        errorDiv.style.display = 'block';
    }
}

// Function to close admin modal
function closeAdminModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.remove();
    }
}

// ==========================================
// Google Sign-In for Admin Dashboard
// ==========================================

// Initialize Google Sign-In - SDK is loaded from index.html/admin.html
function initializeGoogleSignIn() {
    // Check if Google library is already loaded
    const checkGoogleLib = setInterval(function() {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            console.log('✓ Google library detected');
            
            // Initialize Google Sign-In
            try {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID, // Use the constant from top of file
                    callback: handleGoogleSignIn
                });
                console.log('✓ Google Sign-In initialized');
            } catch (e) {
                console.error('Error initializing Google Sign-In:', e);
            }
            
            clearInterval(checkGoogleLib);
        }
    }, 100);
    
    // Set timeout to stop checking after 5 seconds
    setTimeout(function() {
        clearInterval(checkGoogleLib);
    }, 5000);
}

// Handle Google Sign-In callback
function handleGoogleSignIn(response) {
    console.log('✓ Google Sign-In response received');
    
    if (response.credential) {
        try {
            console.log('✓ Processing credential token');
            
            // Decode the JWT to get user info (optional, for logging)
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const userInfo = JSON.parse(jsonPayload);
            console.log('✓ User Info from Google:', userInfo.email);
            
            // Store admin authentication
            setAdminAuth();
            
            console.log('✓ Google authentication successful!');
            
            // Close modal and redirect
            closeAdminModal();
            
            // Redirect to admin panel
            setTimeout(function() {
                console.log('✓ Redirecting to admin.html');
                window.location.replace('admin.html');
            }, 300);
            
        } catch (e) {
            console.error('Error processing Google sign-in:', e);
            const errorDiv = document.getElementById('adminError');
            if (errorDiv) {
                errorDiv.textContent = 'حدث خطأ في معالجة بيانات Google. يرجى المحاولة مرة أخرى.';
                errorDiv.style.display = 'block';
            }
        }
    } else {
        console.error('No credential in response');
        const errorDiv = document.getElementById('adminError');
        if (errorDiv) {
            errorDiv.textContent = 'فشل تسجيل الدخول بـ Google. يرجى المحاولة مرة أخرى.';
            errorDiv.style.display = 'block';
        }
    }
}

// Render Google Sign-In button in the modal
function renderGoogleSignInButton() {
    const container = document.getElementById('googleSignInBtn');
    
    if (!container) {
        console.warn('Google button container not found');
        return;
    }
    
    // Check if Client ID is configured properly
    if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
        console.warn('⚠️ Google Client ID not configured');
        container.innerHTML = `
            <div style="
                background: #fef3c7;
                border: 1px solid #fcd34d;
                border-radius: 8px;
                padding: 0.75rem;
                text-align: center;
                color: #92400e;
                font-size: 0.875rem;
            ">
                ⚠️ تسجيل الدخول بـ Google غير مفعل حالياً<br>
                <small>تحتاج إلى إضافة Google Client ID في script.js</small>
            </div>
        `;
        return;
    }
    
    // Check if Google library is loaded
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.warn('Google library not loaded yet, retrying...');
        setTimeout(renderGoogleSignInButton, 500);
        return;
    }
    
    try {
        // Clear previous render
        container.innerHTML = '';
        
        // Render the button
        google.accounts.id.renderButton(
            container,
            {
                theme: 'outline',
                size: 'large',
                width: '100%',
                locale: 'ar',
                text: 'signin_with'
            }
        );
        
        console.log('✓ Google Sign-In button rendered successfully');
    } catch (e) {
        console.error('Error rendering Google button:', e);
        container.innerHTML = `
            <div style="
                background: #fee2e2;
                border: 1px solid #fca5a5;
                border-radius: 8px;
                padding: 0.75rem;
                text-align: center;
                color: #7f1d1d;
                font-size: 0.875rem;
            ">
                ❌ فشل تحميل زر جوجل
            </div>
        `;
    }
}

// Initialize Google Sign-In when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeGoogleSignIn();
    });
} else {
    initializeGoogleSignIn();
}

// Function to logout from admin
function logoutAdmin() {
    console.log('Logging out admin...');
    
    // Clear all storage methods
    try {
        sessionStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminTimestamp');
        localStorage.removeItem('adminLastLogin');
    } catch (e) {
        console.error('Error clearing storage:', e);
    }
    
    // Clear cookie
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    
    console.log('✓ Auth flags cleared, redirecting to index.html');
    window.location.replace('index.html');
}

// Click outside modal to close
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('adminLoginModal');
        if (modal && event.target === modal) {
            closeAdminModal();
        }
    });
});

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
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (navLinks && navActions) {
        navLinks.innerHTML = `
            <a href="#" class="nav-link" onclick="showPage('landing'); return false;">الرئيسية</a>
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">لوحة التحكم</a>
            <a href="#" class="nav-link" onclick="showPage('courses'); return false;">الدورات التدريبية</a>
            <a href="#" class="nav-link" onclick="showPage('investors'); return false;">المستثمرون</a>
            <a href="#" class="nav-link" onclick="showPage('dashboard'); return false;">متابعة التقدم</a>
            <a href="#" class="nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
        `;
        
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">
                تسجيل الخروج
            </button>
        `;
    }
    
    if (mobileMenu) {
        mobileMenu.innerHTML = `
            <a href="#" class="mobile-nav-link" onclick="showPage('landing'); return false;">الرئيسية</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('dashboard'); return false;">لوحة التحكم</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('courses'); return false;">الدورات التدريبية</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('investors'); return false;">المستثمرون</a>
            <a href="#" class="mobile-nav-link" onclick="showPage('dashboard'); return false;">متابعة التقدم</a>
            <a href="#" class="mobile-nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
            <div class="mobile-nav-actions">
                <button class="btn btn-outline btn-block" onclick="logout()">تسجيل الخروج</button>
            </div>
        `;
    }
}

function logout() {
    isLoggedIn = false;
    showPage('landing');
    
    // Reset navigation
    const navLinks = document.getElementById('navLinks');
    const navActions = document.getElementById('navActions');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (navLinks && navActions) {
        navLinks.innerHTML = `
            <a href="#" class="nav-link active" data-page="landing" onclick="showPage('landing'); return false;">الرئيسية</a>
            <a href="#" class="nav-link" data-page="about" onclick="showPage('about'); return false;">من نحن</a>
            <a href="#" class="nav-link" data-page="contact" onclick="showPage('contact'); return false;">تواصل معنا</a>
            <a href="#" class="nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
        `;
        
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="showPage('auth')">تسجيل الدخول</button>
            <button class="btn btn-primary" onclick="showPage('auth')">ابدئي الآن</button>
        `;
    }
    
    if (mobileMenu) {
        mobileMenu.innerHTML = `
            <a href="#" class="mobile-nav-link" data-page="landing">الرئيسية</a>
            <a href="#" class="mobile-nav-link" data-page="about">من نحن</a>
            <a href="#" class="mobile-nav-link" data-page="contact">تواصل معنا</a>
            <a href="#" class="mobile-nav-link" onclick="showProfile(); return false;">الملف الشخصي</a>
            <div class="mobile-nav-actions">
                <button class="btn btn-outline btn-block" onclick="showPage('auth')">تسجيل الدخول</button>
                <button class="btn btn-primary btn-block" onclick="showPage('auth')">ابدئي الآن</button>
            </div>
        `;
    }
}

function showProfile() {
    if (isLoggedIn) {
        showPage('profile');
    } else {
        showPage('auth');
    }
}

function waitForGoogleAccounts(callback) {
    if (window.google && window.google.accounts && window.google.accounts.id) {
        callback();
        return;
    }

    let poller = null;
    const timeout = setTimeout(() => {
        if (poller) {
            clearInterval(poller);
        }
    }, 10000);

    poller = setInterval(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            clearInterval(poller);
            clearTimeout(timeout);
            callback();
        }
    }, 250);
}

function initGoogleIdentity() {
    if (googleIdentityInitialized || !window.google || !window.google.accounts || !window.google.accounts.id) {
        return;
    }

    const googleButton = document.getElementById('googleSignInButton');
    if (!googleButton) {
        return;
    }

    googleIdentityInitialized = true;

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        ux_mode: 'popup'
    });

    googleButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
            showToast('من فضلك استبدل GOOGLE_CLIENT_ID في script.js بمعرف العميل الخاص بك من Google.', 'info');
        }

        google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                console.warn('Google Identity prompt لم يظهر:', notification);
            }
        });
    });
}

function handleGoogleCredential(response) {
    if (!response || !response.credential) {
        showToast('تعذر إكمال تسجيل الدخول عبر Google.', 'error');
        return;
    }

    const payload = parseJwt(response.credential);
    profileState.name = payload.name || profileState.name;
    profileState.summary = payload.locale ? `مسجلة بـ ${payload.locale}` : profileState.summary;
    profileState.email = payload.email || profileState.email;
    profileState.avatar = payload.picture || profileState.avatar;
    if (payload.hd) {
        profileState.tags = [payload.hd, ...profileState.tags];
    }

    renderProfileData();
    fillProfileForm();

    isLoggedIn = true;
    showPage('dashboard');
    showToast('تم تسجيل الدخول عبر Google بنجاح!', 'success');
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
        return {};
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`;
    }).join(''));

    try {
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error('فشل تحليل JWT من Google:', err);
        return {};
    }
}

function renderProfileData() {
    const avatar = document.getElementById('profileAvatar');
    const nameEl = document.getElementById('profileNameDisplay');
    const roleEl = document.getElementById('profileRoleDisplay');
    const summaryEl = document.getElementById('profileSummary');
    const experienceEl = document.getElementById('profileExperience');
    const locationEl = document.getElementById('profileLocation');
    const statusEl = document.getElementById('profileStatus');
    const emailEl = document.getElementById('profileEmail');
    const phoneEl = document.getElementById('profilePhone');
    const socialEl = document.getElementById('profileSocial');

    if (avatar) {
        avatar.src = profileState.avatar;
    }
    if (nameEl) {
        nameEl.textContent = profileState.name;
    }
    if (roleEl) {
        roleEl.textContent = profileState.role;
    }
    if (summaryEl) {
        summaryEl.textContent = profileState.summary;
    }
    if (experienceEl) {
        experienceEl.textContent = profileState.experience;
    }
    if (locationEl) {
        locationEl.textContent = profileState.location;
    }
    if (statusEl) {
        statusEl.textContent = profileState.status;
    }
    if (emailEl) {
        emailEl.textContent = profileState.email;
    }
    if (phoneEl) {
        phoneEl.textContent = profileState.phone;
    }
    if (socialEl) {
        socialEl.textContent = profileState.social;
    }

    updateProfileTags();
}

function updateProfileTags() {
    const tagsContainer = document.getElementById('profileTags');
    if (!tagsContainer) return;

    tagsContainer.innerHTML = '';
    profileState.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });
}

function fillProfileForm() {
    const fields = [
        { id: 'profileNameInput', value: profileState.name },
        { id: 'profileRoleInput', value: profileState.role },
        { id: 'profileExperienceInput', value: profileState.experience },
        { id: 'profileLocationInput', value: profileState.location },
        { id: 'profileStatusInput', value: profileState.status },
        { id: 'profileEmailInput', value: profileState.email },
        { id: 'profilePhoneInput', value: profileState.phone },
        { id: 'profileSocialInput', value: profileState.social },
        { id: 'profileSummaryInput', value: profileState.summary },
        { id: 'profileTagsInput', value: profileState.tags.join(', ') }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.value = field.value;
        }
    });
}

function handleProfileEditSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('profileNameInput');
    const roleInput = document.getElementById('profileRoleInput');
    const experienceInput = document.getElementById('profileExperienceInput');
    const locationInput = document.getElementById('profileLocationInput');
    const statusInput = document.getElementById('profileStatusInput');
    const emailInput = document.getElementById('profileEmailInput');
    const phoneInput = document.getElementById('profilePhoneInput');
    const socialInput = document.getElementById('profileSocialInput');
    const summaryInput = document.getElementById('profileSummaryInput');
    const tagsInput = document.getElementById('profileTagsInput');

    if (nameInput) profileState.name = nameInput.value.trim() || profileState.name;
    if (roleInput) profileState.role = roleInput.value.trim() || profileState.role;
    if (experienceInput) profileState.experience = experienceInput.value.trim() || profileState.experience;
    if (locationInput) profileState.location = locationInput.value.trim() || profileState.location;
    if (statusInput) profileState.status = statusInput.value.trim() || profileState.status;
    if (emailInput) profileState.email = emailInput.value.trim() || profileState.email;
    if (phoneInput) profileState.phone = phoneInput.value.trim() || profileState.phone;
    if (socialInput) profileState.social = socialInput.value.trim() || profileState.social;
    if (summaryInput) profileState.summary = summaryInput.value.trim() || profileState.summary;
    if (tagsInput) {
        const parsedTags = tagsInput.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        profileState.tags = parsedTags.length ? parsedTags : profileState.tags;
    }

    renderProfileData();
    showToast('تم حفظ معلومات الملف الشخصي بنجاح', 'success');
}

function handleProfileImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        profileState.avatar = reader.result;
        renderProfileData();
    };
    reader.readAsDataURL(file);
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

// Handle desktop nav links
const desktopNavLinks = document.querySelectorAll('.nav-link');
desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.getAttribute('data-page');
        if (page) {
            e.preventDefault();
            showPage(page);
        }
    });
});

// ==========================================
// Course Search
// ==========================================

const courseSearch = document.getElementById('courseSearch');
if (courseSearch) {
    courseSearch.addEventListener('input', filterCourses);
}

function filterCourses() {
    const searchTerm = courseSearch.value.toLowerCase();
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add click handlers to course register buttons
const courseRegisterButtons = document.querySelectorAll('#coursesPage .btn-primary');
courseRegisterButtons.forEach(button => {
    button.addEventListener('click', () => {
        showPage('auth');
    });
});

// ==========================================
// FAQ Toggle
// ==========================================

function toggleFaq(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

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
        
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Simulate login
        isLoggedIn = true;
        showPage('dashboard');
        
        // Save login data if remember me is checked
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }
        
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
    
    // Load remembered login data
    loadRememberedData();
    
    // Show landing page by default
    showPage('landing');

    renderProfileData();
    fillProfileForm();

    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', handleProfileEditSubmit);
    }

    const profileImageInput = document.getElementById('profileImageInput');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', handleProfileImageChange);
    }

    const profileResetBtn = document.getElementById('profileResetBtn');
    if (profileResetBtn) {
        profileResetBtn.addEventListener('click', (event) => {
            event.preventDefault();
            fillProfileForm();
            showToast('تم إعادة بيانات النموذج إلى آخر حالة محفوظة.', 'success');
        });
    }

    waitForGoogleAccounts(initGoogleIdentity);
    
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
