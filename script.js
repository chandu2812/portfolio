/* ============================================
   Chandu — Data Engineer Portfolio
   Lightweight JS: menu, scroll progress, reveal
   ============================================ */

// Mobile menu
const sidemenu = document.getElementById('sidemenu');

function openmenu() {
    sidemenu.classList.add('open');w
    document.body.style.overflow = 'hidden';
}

function closemenu() {
    sidemenu.classList.remove('open');
    document.body.style.overflow = '';
}

// Close menu when a nav link is clicked
document.querySelectorAll('#sidemenu .nav-link').forEach(link => {
    link.addEventListener('click', closemenu);
});

// Scroll progress bar
const progressBar = document.getElementById('scrollProgress');

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
}

// Reveal on scroll (Intersection Observer — performant)
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after reveal for slightly less work
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    }
);

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id], #header');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Throttled scroll handler (requestAnimationFrame)
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateProgress();
            updateActiveNav();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Initial call
updateProgress();
updateActiveNav();

// Contact form — basic success feedback (works with Google Sheets script if you add it)
const form = document.querySelector('form[name="submit-to-google-sheet"]');
if (form) {
    form.addEventListener('submit', (e) => {
        // Keep default if you have a real endpoint; otherwise prevent and show message
        // e.preventDefault();
        // Optional: add success toast here later
    });
}