document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initMobileMenu();
    initParticles();
    
    // AOS (Animate on Scroll) Alternative - Simple Intersection Observer
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s, transform 0.8s';
        observer.observe(section);
    });
});

/* --- Countdown Logic --- */
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Target: 15th of current month
        let targetDate = new Date(currentYear, currentMonth, 15, 0, 0, 0);

        // If today is past the 15th, target next month's 15th
        if (now > targetDate) {
            targetDate = new Date(currentYear, currentMonth + 1, 15, 0, 0, 0);
        }

        const diff = targetDate - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.innerText = d.toString().padStart(2, '0');
        hoursEl.innerText = h.toString().padStart(2, '0');
        minutesEl.innerText = m.toString().padStart(2, '0');
        secondsEl.innerText = s.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(mobileToggle) mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });
}

/* --- Modal & Form Handling --- */
window.openJoinModal = function() {
    document.getElementById('join-modal').style.display = 'flex';
}

window.closeJoinModal = function() {
    document.getElementById('join-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('join-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

window.submitJoinForm = function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const location = document.getElementById('location').value;
    const language = document.getElementById('language').value;
    const mobile = document.getElementById('mobile').value;

    const message = `*New Join Request – Eagle Traders Club*
--------------------------------
*Batch:* Next 15th Start
*Name:* ${name}
*Age:* ${age}
*Location:* ${location}
*Language:* ${language}
*Mobile:* ${mobile}
--------------------------------
Please reply with joining details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919542551884?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    closeJoinModal();
}

/* --- Background Particles --- */
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];

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
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 - distance/1000})`;
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
