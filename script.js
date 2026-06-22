/* ============================================================
   Jayul Patel — Resume Website Scripts
   Features: particles, typing, scroll reveal, skill bars,
             sticky nav, smooth scroll, mobile menu
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const typingEl = document.getElementById('typing-text');
  const canvas = document.getElementById('particles');
  const revealEls = document.querySelectorAll('.reveal');
  const skillCards = document.querySelector('.skills-grid');
  const downloadBtn = document.getElementById('download-cv');

  /* ---------- Typing Animation ---------- */
  const roles = [
    'Web Developer',
    'UI Enthusiast',
    'Front-End Learner',
    'Creative Coder'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000;
      }
    } else {
      typingEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
      }
    }

    setTimeout(typeEffect, typeSpeed);
  }

  /* ---------- Particle Background ---------- */
  function initParticles() {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles(count) {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p, i) {
        /* Move particle */
        p.x += p.speedX;
        p.y += p.speedY;

        /* Wrap around edges */
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        /* Draw dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 255, 218, ' + p.opacity + ')';
        ctx.fill();

        /* Draw connection lines to nearby particles */
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(100, 255, 218, ' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles(Math.min(80, Math.floor(window.innerWidth / 15)));
    drawParticles();

    window.addEventListener('resize', function () {
      resize();
      createParticles(Math.min(80, Math.floor(window.innerWidth / 15)));
    });

    return function cleanup() {
      cancelAnimationFrame(animationId);
    };
  }

  /* ---------- Sticky Navbar Scroll Effect ---------- */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ---------- Active Nav Link on Scroll ---------- */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + varNavHeight() + 20;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function varNavHeight() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
  }

  /* ---------- Scroll Reveal (Intersection Observer) ---------- */
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Animated Skill Bars ---------- */
  function initSkillBars() {
    if (!skillCards) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const fills = entry.target.querySelectorAll('.skill-fill');
          const percents = entry.target.querySelectorAll('.skill-percent');

          fills.forEach(function (fill, i) {
            const width = fill.getAttribute('data-width');
            setTimeout(function () {
              fill.style.width = width + '%';
            }, i * 120);

            /* Animate percentage counter */
            const percentEl = percents[i];
            const target = parseInt(percentEl.getAttribute('data-target'), 10);
            animateCounter(percentEl, target);
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(skillCards);
  }

  function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current + '%';
    }, 30);
  }

  /* ---------- Mobile Navigation Toggle ---------- */
  function initMobileNav() {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- Download CV Placeholder ---------- */
  function initDownloadCV() {
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('CV download will be available soon! Add your PDF to assets/ and link it here.');
    });
  }

  /* ---------- Initialize Everything ---------- */
  function init() {
    typeEffect();
    initParticles();
    initScrollReveal();
    initSkillBars();
    initMobileNav();
    initSmoothScroll();
    initDownloadCV();

    window.addEventListener('scroll', function () {
      handleNavbarScroll();
      updateActiveNavLink();
    });

    handleNavbarScroll();
    updateActiveNavLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
