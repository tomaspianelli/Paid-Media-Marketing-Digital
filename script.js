/* ============================================================
   TOMÁS PIANELLI — script.js
   ============================================================ */

/* Hamburger */
const hamburger = document.getElementById('navHamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  const abierto = mobileNav.classList.contains('open');
  hamburger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  const spans = hamburger.querySelectorAll('span');
  if (abierto) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
mobileNav.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
  });
});

/* Scroll Reveal */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.revelar').forEach(el => observer.observe(el));

/* Contador animado */
const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.val);
      const numEl = el.querySelector('.count-num');
      if (prefiereMenosMovimiento) {
        numEl.textContent = target;
        countObserver.unobserve(el);
        return;
      }
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        numEl.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 20);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-trigger').forEach(el => countObserver.observe(el));

/* ---- MODAL CERTIFICADOS ---- */
function esIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function abrirCert(ruta, tipo, titulo) {
  const fondo   = document.getElementById('certModalFondo');
  const body    = document.getElementById('certModalBody');
  const tituloEl= document.getElementById('certModalTitulo');
  const descarga= document.getElementById('certModalDescargar');

  tituloEl.textContent = titulo;
  descarga.href = ruta;

  body.innerHTML = '';
  if (tipo === 'pdf') {
    if (esIOS()) {
      // Safari en iPhone/iPad no renderiza bien los PDF embebidos en iframe
      const aviso = document.createElement('div');
      aviso.className = 'cert-modal-ios-aviso';
      aviso.innerHTML =
        '<p>Los PDF no se visualizan dentro de Safari en iPhone/iPad.</p>' +
        '<a href="' + ruta + '" target="_blank" rel="noopener" class="cert-modal-ios-link">Abrir certificado en una pestaña nueva →</a>';
      body.appendChild(aviso);
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = ruta + '#toolbar=0&navpanes=0&scrollbar=1';
      iframe.title = titulo;
      body.appendChild(iframe);
    }
  } else {
    const img = document.createElement('img');
    img.src = ruta;
    img.alt = titulo;
    body.appendChild(img);
  }

  fondo.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

document.getElementById('certModalCerrar').addEventListener('click', cerrarCert);
document.getElementById('certModalFondo').addEventListener('click', function(e) {
  if (e.target === this) cerrarCert();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') cerrarCert();
});

function cerrarCert() {
  const fondo = document.getElementById('certModalFondo');
  fondo.classList.remove('activo');
  document.getElementById('certModalBody').innerHTML = '';
  document.body.style.overflow = '';
}

/* Header scroll + Nav activo por scroll (unificados y optimizados) */
const header = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
let seccionesPos = [];
let scrollTicking = false;

function calcularPosiciones() {
  seccionesPos = Array.from(sections).map(s => ({ id: s.id, top: s.offsetTop }));
}
calcularPosiciones();
window.addEventListener('resize', calcularPosiciones);

function actualizarNavActivo() {
  header.classList.toggle('scrolled', window.scrollY > 60);
  let current = '';
  const y = window.scrollY;
  seccionesPos.forEach(s => { if (y >= s.top - 120) current = s.id; });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--azul)' : '';
  });
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(actualizarNavActivo);
    scrollTicking = true;
  }
});