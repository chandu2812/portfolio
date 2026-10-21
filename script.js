/* ============================================
   Chandu — Data Engineer Portfolio
   Lightweight JS: menu, scroll, canvas, terminal
   ============================================ */

// --- Mobile Menu Logic ---
const sidemenu = document.getElementById('sidemenu');

function openmenu() {
    sidemenu.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closemenu() {
    sidemenu.classList.remove('open');
    document.body.style.overflow = '';
}

document.querySelectorAll('#sidemenu .nav-link').forEach(link => {
    link.addEventListener('click', closemenu);
});

// --- Scroll Progress & Active Nav ---
const progressBar = document.getElementById('scrollProgress');

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
}

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

updateProgress();
updateActiveNav();

// --- Reveal Animation Observer ---
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    }
);

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// --- Interactive Terminal Logic ---
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const terminalBody = document.getElementById('terminalBody');

const commands = {
    help: "Available commands: whoami, skills, projects, contact, clear",
    whoami: "Chandu - Data Engineer. I build scalable pipelines and modern data platforms.",
    skills: "Python, SQL, Airflow, dbt, Spark, AWS, Snowflake.",
    projects: "Check out my 'Cancer Prediction Pipeline' and 'Udyog DBMS Portal' below!",
    contact: "Email: venkatchandu106@gmail.com | GitHub: chandu2812",
    clear: "CLEAR"
};

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            if (inputVal === '') return;

            // Echo command
            const cmdLine = document.createElement('div');
            cmdLine.className = 'output-line';
            cmdLine.innerHTML = `<span class="prompt">➜ ~</span> ${inputVal}`;
            terminalOutput.appendChild(cmdLine);

            // Process command
            if (commands[inputVal]) {
                if (commands[inputVal] === "CLEAR") {
                    terminalOutput.innerHTML = '';
                } else {
                    const resLine = document.createElement('div');
                    resLine.className = 'output-line';
                    resLine.style.color = 'var(--accent)';
                    resLine.textContent = commands[inputVal];
                    terminalOutput.appendChild(resLine);
                }
            } else {
                const errLine = document.createElement('div');
                errLine.className = 'output-line output-error';
                errLine.textContent = `Command not found: ${inputVal}. Type 'help' for options.`;
                terminalOutput.appendChild(errLine);
            }

            // Scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

// --- Data Nodes Canvas Background ---
const canvas = document.getElementById('dataCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 50;
    const connectionDistance = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(245, 158, 11, 0.6)'; // Accent color
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(245, 158, 11, ${1 - dist / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}