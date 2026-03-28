/**
 * ================================================================
 * PORTFÓLIO — ANA LIMA | Data Analyst & BI Developer
 * script.js — JavaScript principal
 *
 * Índice:
 * 01. Inicialização
 * 02. Page Loader
 * 03. Tema Dark / Light
 * 04. Cursor Personalizado
 * 05. Navbar — Scroll & Hamburger
 * 06. Barra de Progresso de Scroll
 * 07. Animações de Reveal (Intersection Observer)
 * 08. Barras de Habilidades Animadas
 * 09. Contador de Estatísticas (Hero)
 * 10. Scroll Suave
 * 11. Botão Voltar ao Topo
 * 12. Formulário de Contato
 * 13. Ano atual no Footer
 * 14. Navegação ativa (highlight)
 * ================================================================
 */

/* ================================================================
   01. INICIALIZAÇÃO — DOM pronto
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initCursor();
  initNavbar();
  initScrollProgress();
  initRevealAnimations();
  initSkillBars();
  initStatCounters();
  initBackToTop();
  initContactForm();
  initFooterYear();
  initActiveNav();
});

/* ================================================================
   02. PAGE LOADER
   Exibe uma tela de entrada que desaparece quando a página carrega
================================================================ */
function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  // Aguarda um mínimo de tempo para a animação ser percebida
  const minDelay = 900;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDelay - elapsed);

    setTimeout(() => {
      loader.classList.add('hidden');

      // Remove do DOM após a transição para não bloquear cliques
      loader.addEventListener('transitionend', () => {
        loader.remove();
      }, { once: true });

      // Dispara as animações iniciais do Hero após o loader sumir
      triggerHeroAnimations();
    }, remaining);
  });
}

/**
 * Dispara as animações de reveal dos elementos do Hero com delays
 */
function triggerHeroAnimations() {
  const heroItems = document.querySelectorAll('.hero .reveal-item');
  heroItems.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('is-visible');
    }, i * 120);
  });
}

/* ================================================================
   03. TEMA DARK / LIGHT
   Salva preferência no localStorage; respeita prefers-color-scheme
================================================================ */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Lê preferência salva ou usa a do sistema
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  applyTheme(initial);

  btn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);

    // Micro-animation no botão
    btn.style.transform = 'scale(0.85) rotate(20deg)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/* ================================================================
   04. CURSOR PERSONALIZADO
   Segue o mouse com um ponto e um anel de atraso
================================================================ */
function initCursor() {
  // Desativa em dispositivos touch
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let animId = null;

  // Segue o mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // O ponto segue imediatamente
    dot.style.left = `${mouseX}px`;
    dot.style.top  = `${mouseY}px`;
  });

  // O anel segue com atraso (lerp)
  function animateRing() {
    const speed = 0.14;
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;

    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;

    animId = requestAnimationFrame(animateRing);
  }
  animId = requestAnimationFrame(animateRing);

  // Estado "hover" em elementos interativos
  const interactiveSelectors = 'a, button, .project-card, .highlight-card, .skill-icon-card, .tag, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.add('cursor-hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.remove('cursor-hovering');
    }
  });

  // Estado "clique"
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-clicking'));
}

/* ================================================================
   05. NAVBAR — SCROLL & HAMBURGER
================================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');

  if (!navbar) return;

  // Adiciona classe "scrolled" ao rolar
  const handleScroll = () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Chama uma vez na inicialização

  // Hamburguer toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav?.classList.toggle('open', isOpen);
    mobileNav?.setAttribute('aria-hidden', !isOpen);

    // Bloqueia scroll do body quando menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fecha o menu mobile ao clicar em um link
  mobileNav?.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && mobileNav?.classList.contains('open')) {
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

/* ================================================================
   06. BARRA DE PROGRESSO DE SCROLL
================================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${scrollFraction}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
}

/* ================================================================
   07. ANIMAÇÕES DE REVEAL (Intersection Observer)
   Elementos com classe "reveal-item" aparecem ao entrar na viewport
   Os elementos do Hero são tratados separadamente pelo loader
================================================================ */
function initRevealAnimations() {
  // Seleciona todos os itens de reveal EXCETO os do hero (gerenciados pelo loader)
  const items = document.querySelectorAll('.section .reveal-item, .footer .reveal-item');

  if (!items.length) return;

  const options = {
    root: null,            // Usa a viewport
    rootMargin: '0px 0px -80px 0px', // Dispara um pouco antes de chegar na viewport
    threshold: 0.1,        // Pelo menos 10% visível
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Anima apenas uma vez
      }
    });
  }, options);

  items.forEach((item) => observer.observe(item));
}

/* ================================================================
   08. BARRAS DE HABILIDADES ANIMADAS
   Preenche as barras de progresso quando entram na viewport
================================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');

  if (!fills.length) return;

  const options = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');

        if (width) {
          // Pequeno delay para a animação ser percebida
          setTimeout(() => {
            fill.style.width = `${width}%`;
          }, 150);
        }

        observer.unobserve(fill);
      }
    });
  }, options);

  fills.forEach((fill) => observer.observe(fill));
}

/* ================================================================
   09. CONTADOR DE ESTATÍSTICAS (Hero)
   Anima os números de 0 até o valor alvo
================================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  counters.forEach((counter) => observer.observe(counter));
}

/**
 * Anima um contador de 0 até o valor alvo
 * @param {HTMLElement} el - Elemento com data-count
 */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1800; // ms
  const start    = performance.now();

  const easeOut = (t) => 1 - Math.pow(1 - t, 3); // Ease out cubic

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOut(progress) * target);

    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ================================================================
   10. SCROLL SUAVE
   Garante que links âncora funcionem com transição suave
   (complementa scroll-behavior: smooth do CSS)
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navbarH   = document.getElementById('navbar')?.offsetHeight || 72;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarH;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ================================================================
   11. BOTÃO VOLTAR AO TOPO
================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_THRESHOLD = 500;

  const toggleVisibility = () => {
    const visible = window.scrollY > SHOW_THRESHOLD;
    btn.classList.toggle('visible', visible);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   12. FORMULÁRIO DE CONTATO
   Validação básica e simulação de envio
================================================================ */
function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpa estados anteriores
    clearFormErrors(form);
    hideFeedback(feedback);

    // Coleta dados
    const data = {
      name:    form.inputName.value.trim(),
      email:   form.inputEmail.value.trim(),
      subject: form.inputSubject.value.trim(),
      message: form.inputMessage.value.trim(),
    };

    // Valida campos
    const errors = validateForm(data);
    if (errors.length > 0) {
      showFormErrors(form, errors);
      showFeedback(feedback, 'Por favor, corrija os campos destacados.', 'error');
      return;
    }

    // Simula envio (substitua por fetch para um backend ou serviço como EmailJS/Formspree)
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Enviando…';

    try {
      await simulateSend(data);

      showFeedback(
        feedback,
        '✓ Mensagem enviada com sucesso! Entrarei em contato em breve.',
        'success'
      );
      form.reset();

    } catch (err) {
      showFeedback(
        feedback,
        '✗ Ocorreu um erro ao enviar. Tente novamente ou use o email diretamente.',
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Enviar Mensagem';
    }
  });

  // Limpa erro ao digitar
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });
}

/**
 * Valida os dados do formulário
 * @param {Object} data
 * @returns {Array} Lista de erros [{field, message}]
 */
function validateForm(data) {
  const errors = [];

  if (!data.name || data.name.length < 2) {
    errors.push({ field: 'inputName', message: 'Nome deve ter ao menos 2 caracteres.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({ field: 'inputEmail', message: 'Informe um email válido.' });
  }

  if (!data.subject || data.subject.length < 3) {
    errors.push({ field: 'inputSubject', message: 'Informe um assunto.' });
  }

  if (!data.message || data.message.length < 10) {
    errors.push({ field: 'inputMessage', message: 'Mensagem deve ter ao menos 10 caracteres.' });
  }

  return errors;
}

/**
 * Destaca os campos com erro
 */
function showFormErrors(form, errors) {
  errors.forEach(({ field }) => {
    const el = document.getElementById(field);
    if (el) {
      el.classList.add('error');
      el.focus();
    }
  });
  // Foca no primeiro campo com erro
  const firstError = document.getElementById(errors[0]?.field);
  firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearFormErrors(form) {
  form.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
}

/**
 * Exibe mensagem de feedback do formulário
 */
function showFeedback(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = `form-feedback ${type}`;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function hideFeedback(el) {
  if (!el) return;
  el.className = 'form-feedback';
  el.textContent = '';
}

/**
 * Simula um envio assíncrono (substitua por integração real)
 * Para usar com EmailJS:   https://www.emailjs.com/
 * Para usar com Formspree: https://formspree.io/
 */
function simulateSend(data) {
  return new Promise((resolve, reject) => {
    // Simula latência de rede
    setTimeout(() => {
      // Em produção, substitua por:
      // fetch('https://formspree.io/f/SEU-ID', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      console.log('Formulário enviado (simulação):', data);
      resolve();
    }, 1500);
  });
}

/* ================================================================
   13. ANO ATUAL NO FOOTER
================================================================ */
function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ================================================================
   14. NAVEGAÇÃO ATIVA (Highlight do link atual)
   Usa Intersection Observer para detectar qual seção está visível
================================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const options = {
    root: null,
    rootMargin: `-${document.getElementById('navbar')?.offsetHeight || 72}px 0px -50% 0px`,
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  }, options);

  sections.forEach((section) => observer.observe(section));
}

/* ================================================================
   UTILITÁRIOS GERAIS
================================================================ */

/**
 * Debounce — limita a frequência de chamadas a uma função
 * @param {Function} fn
 * @param {number} delay
 */
function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle — garante que uma função seja chamada no máximo uma vez por período
 * @param {Function} fn
 * @param {number} limit
 */
function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}
