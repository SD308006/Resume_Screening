// Theme Management
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggle(theme);
}

function updateThemeToggle(theme) {
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    
    if (theme === 'dark') {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

// Initialize theme on page load
initializeTheme();

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeToggle(newTheme);
    }
});

// Enhanced Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (nav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        spans[1].style.opacity = '0';
        spans[1].style.transform = 'scale(0)';
        spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'scale(1)';
        spans[2].style.transform = 'none';
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'scale(1)';
        spans[2].style.transform = 'none';
    });
});

// Enhanced File Upload Functionality
const resumeUpload = document.getElementById('resumeUpload');
const resumeInput = document.getElementById('resumeInput');
const resumeStatus = document.getElementById('resumeStatus');
const jobDescription = document.getElementById('jobDescription');
const charCount = document.getElementById('charCount');
const clearJob = document.getElementById('clearJob');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisResults = document.getElementById('analysisResults');
const overallScore = document.getElementById('overallScore');
const matchingSkillsList = document.getElementById('matchingSkills');
const missingSkillsList = document.getElementById('missingSkills');
const recommendationsList = document.getElementById('recommendations');

let uploadedFile = null;
let isProcessing = false;

resumeUpload.addEventListener('click', () => resumeInput.click());

resumeUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    resumeUpload.style.borderColor = '#667eea';
    resumeUpload.style.background = 'rgba(102, 126, 234, 0.1)';
    resumeUpload.style.transform = 'scale(1.02)';
});

resumeUpload.addEventListener('dragleave', (e) => {
    e.preventDefault();
    resumeUpload.style.borderColor = 'var(--border-color)';
    resumeUpload.style.background = 'var(--bg-secondary)';
    resumeUpload.style.transform = 'scale(1)';
});

resumeUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    resumeUpload.style.borderColor = 'var(--border-color)';
    resumeUpload.style.background = 'var(--bg-secondary)';
    resumeUpload.style.transform = 'scale(1)';
    if (e.dataTransfer.files.length > 0) {
        uploadedFile = e.dataTransfer.files[0];
        resumeStatus.textContent = `Selected: ${uploadedFile.name}`;
        resumeStatus.className = 'upload-status';
        resumeStatus.style.display = 'block';
        checkAnalyzeButton();
    }
});

resumeInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        uploadedFile = e.target.files[0];
        resumeStatus.textContent = `Selected: ${uploadedFile.name}`;
        resumeStatus.className = 'upload-status';
        resumeStatus.style.display = 'block';
        checkAnalyzeButton();
    }
});

jobDescription.addEventListener('input', (e) => {
    const count = e.target.value.length;
    charCount.textContent = `${count} characters`;
    if (count > 500) charCount.style.color = '#27ca40';
    else if (count > 200) charCount.style.color = '#feca57';
    else charCount.style.color = 'var(--text-secondary)';
    checkAnalyzeButton();
});

clearJob.addEventListener('click', () => {
    jobDescription.value = '';
    charCount.textContent = '0 characters';
    charCount.style.color = 'var(--text-secondary)';
    checkAnalyzeButton();
    jobDescription.style.animation = 'clearFade 0.3s ease-out';
    setTimeout(() => jobDescription.style.animation = '', 300);
});

function checkAnalyzeButton() {
    const hasFile = uploadedFile !== null;
    const hasJobDescription = jobDescription.value.trim().length > 0;
    analyzeBtn.disabled = !(hasFile && hasJobDescription);
    if (!analyzeBtn.disabled) analyzeBtn.classList.add('pulse-on-ready');
    else analyzeBtn.classList.remove('pulse-on-ready');
}

analyzeBtn.addEventListener('click', () => {
    if (isProcessing || !uploadedFile || !jobDescription.value.trim()) {
        if (!uploadedFile || !jobDescription.value.trim()) {
            showNotification('Please upload a file and enter a job description.', 'error');
        }
        return;
    }

    isProcessing = true;
    analyzeBtn.classList.add('loading');
    analyzeBtn.disabled = true;

    const formData = new FormData();
    formData.append('resume', uploadedFile);
    formData.append('jobDescription', jobDescription.value.trim());
    formData.append('jobRole', 'software_engineer'); // Default role

    fetch('/api/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        animateScore(data.score);
        displaySkills('matchingSkills', data.matchingSkills);
        displaySkills('missingSkills', data.missingSkills);
        displayRecommendations(data.recommendations);
        analysisResults.style.display = 'block';
        setTimeout(() => {
            analysisResults.classList.add('animate');
            analysisResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        showNotification(`File "${uploadedFile.name}" analyzed successfully!`, 'success'); // Corrected line
    })
    .catch(error => {
        console.error('Analysis error:', error);
        showNotification(`Error analyzing resume: ${error.message}. Check console for details.`, 'error');
        resumeStatus.textContent = 'Upload failed. Please try again.';
        resumeStatus.className = 'upload-status error';
        resumeStatus.style.display = 'block';
    })
    .finally(() => {
        isProcessing = false;
        analyzeBtn.classList.remove('loading');
        analyzeBtn.disabled = false;
    });
});

function animateScore(targetScore) {
    let currentScore = 0;
    const increment = targetScore / 50;
    const animation = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(animation);
        }
        overallScore.textContent = `${Math.floor(currentScore)}%`;
        if (currentScore >= 80) overallScore.style.color = '#27ca40';
        else if (currentScore >= 60) overallScore.style.color = '#feca57';
        else overallScore.style.color = '#ff6b6b';
    }, 40);
}

function displaySkills(elementId, skills) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    skills.forEach((skill, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.textContent = skill.charAt(0).toUpperCase() + skill.slice(1);
            li.style.opacity = '0';
            li.style.transform = 'translateX(-20px)';
            element.appendChild(li);
            setTimeout(() => {
                li.style.transition = 'all 0.3s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
}

function displayRecommendations(recommendations) {
    recommendationsList.innerHTML = '';
    recommendations.forEach((rec, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.textContent = rec;
            li.style.opacity = '0';
            li.style.transform = 'translateY(20px)';
            recommendationsList.appendChild(li);
            setTimeout(() => {
                li.style.transition = 'all 0.4s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateY(0)';
            }, 50);
        }, index * 150);
    });
}

// Enhanced Contact Form
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    }, 2000);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #27ca40;' : 'background: #ff6b6b;'}
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Enhanced Hero Upload Button
const uploadBtn = document.getElementById('uploadBtn');
uploadBtn.addEventListener('click', () => {
    uploadBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        uploadBtn.style.transform = 'scale(1.05)';
        setTimeout(() => uploadBtn.style.transform = 'scale(1)', 100);
    }, 100);
    document.getElementById('upload').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Enhanced Header scroll effect
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
        header.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'rgba(26, 26, 31, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 20px var(--shadow-light)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'rgba(26, 26, 31, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollY = currentScrollY;
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// Enhanced active nav item detection
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section, main');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = header.offsetHeight;
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// Enhanced progress bar animation
window.addEventListener('load', () => {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) setTimeout(() => progressFill.style.width = '95%', 1500);
});

// Enhanced intersection observer for scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.parentElement.classList.contains('steps-grid') || 
                entry.target.parentElement.classList.contains('tips-grid')) {
                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.upload-card, .step-card, .tip-card, .contact-item, .result-card'
    );
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
    }
});

// Performance optimization: Debounced scroll handler
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
const debouncedScrollHandler = debounce(() => {}, 16); // Placeholder

// Add custom CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes successPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); box-shadow: 0 0 20px #27ca40; } 100% { transform: scale(1); } }
    @keyframes clearFade { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
    .notification { animation: slideInRight 0.3s ease-out; }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
`;
document.head.appendChild(styleSheet);

console.log('Enhanced Resume Screening Tool loaded successfully! 🚀');