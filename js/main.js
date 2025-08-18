document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // INSTALACI�N PWA
  // =========================
  let deferredPrompt;
  const installButton = document.getElementById('installButton');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.classList.add('show');
  });

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast("�Aplicaci�n instalada con �xito!");
    }
    deferredPrompt = null;
    installButton.classList.remove('show');
  });

  window.addEventListener('appinstalled', () => {
    installButton.classList.remove('show');
    deferredPrompt = null;
  });

  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    installButton.style.display = 'none';
  }

  // =========================
  // MEN� M�VIL
  // =========================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');

  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('show');
  });

  // =========================
  // SCROLL SUAVE
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        nav.classList.remove('show');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // =========================
  // TARJETAS DE SERVICIO
  // =========================
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceCheckboxes = document.querySelectorAll('.service-checkbox input');
  const otrosCheckbox = document.getElementById('srv-otros');
  const otrosDesc = document.getElementById('otros-desc');
  const otrosError = document.getElementById('otros-error');

  serviceCards.forEach(card => {
    const textarea = card.querySelector('.other-input');
    if (textarea) {
      textarea.addEventListener('click', e => e.stopPropagation());
    }

    card.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });

  serviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const card = checkbox.closest('.service-card');
      card.classList.toggle('selected', checkbox.checked);
      if (checkbox === otrosCheckbox) {
        otrosDesc.style.display = checkbox.checked ? 'block' : 'none';
        otrosError.style.display = 'none';
      }
    });
  });

  // =========================
  // MODAL DE CONFIRMACI�N
  // =========================
  const finalButton = document.getElementById('finalButton');
  const modalConfirm = document.getElementById('modalConfirm');
  const modalWhatsapp = document.getElementById('modalWhatsapp');
  const cancelarBtn = document.getElementById('cancelarBtn');
  const confirmarBtn = document.getElementById('confirmarBtn');
  const wpCloseBtn = document.getElementById('wpCloseBtn');
  const listaServicios = document.getElementById('listaServicios');
  const noServicesMessage = document.getElementById('noServicesMessage');
  const confirmationText = document.getElementById('confirmationText');
  const globalError = document.getElementById('global-error');

  finalButton.addEventListener('click', () => {
    globalError.style.display = 'none';
    globalError.textContent = '';
    const selectedServices = [];
    let otrosValid = true;

    if (otrosCheckbox.checked) {
      const desc = otrosDesc.value.trim();
      if (desc.length < 5) {
        otrosValid = false;
        otrosError.style.display = 'block';
        otrosDesc.focus();
        globalError.textContent = 'Por favor, completa la descripci�n del servicio "Otros" (m�nimo 5 caracteres).';
        globalError.style.display = 'block';
        return;
      } else {
        otrosError.style.display = 'none';
      }
    }

    serviceCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        const serviceName = card.querySelector('.service-content h3').textContent;
        selectedServices.push(serviceName);
      }
    });

    if (selectedServices.length === 0) {
      globalError.textContent = 'Por favor, selecciona al menos un servicio.';
      globalError.style.display = 'block';
      return;
    }

    listaServicios.innerHTML = '';
    selectedServices.forEach(service => {
      const li = document.createElement('li');
      if (service === "Otros Servicios") {
        const sanitizedText = otrosDesc.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        li.innerHTML = `Otros: ${sanitizedText}`;
      } else {
        li.textContent = service;
      }
      listaServicios.appendChild(li);
    });

    noServicesMessage.style.display = 'none';
    confirmationText.style.display = 'block';
    modalConfirm.classList.add('open');
  });

  cancelarBtn.addEventListener('click', () => {
    modalConfirm.classList.remove('open');
  });

  confirmarBtn.addEventListener('click', () => {
    modalConfirm.classList.remove('open');
    modalWhatsapp.classList.add('open');
    showToast("�Solicitud enviada con �xito!");
  });

  wpCloseBtn.addEventListener('click', () => {
    modalWhatsapp.classList.remove('open');
  });

  window.addEventListener('click', e => {
    if (e.target === modalConfirm) modalConfirm.classList.remove('open');
    if (e.target === modalWhatsapp) modalWhatsapp.classList.remove('open');
  });

  // =========================
  // RELOJ ANIMADO
  // =========================
  function updateClock() {
    const now = new Date();
    const hourDeg = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
    const minuteDeg = now.getMinutes() * 6;
    const secondDeg = now.getSeconds() * 6;

    document.getElementById('clock-hour').style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    document.getElementById('clock-minute').style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    document.getElementById('clock-second').style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  // =========================
  // SELECTOR WHATSAPP
  // =========================
  const whatsappBtn = document.getElementById('whatsappBtn');
  const whatsappSelector = document.getElementById('whatsappSelector');

  whatsappBtn.addEventListener('click', e => {
    e.stopPropagation();
    whatsappSelector.style.display = whatsappSelector.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', e => {
    if (!whatsappSelector.contains(e.target) && e.target !== whatsappBtn) {
      whatsappSelector.style.display = 'none';
    }
  });

  document.querySelectorAll('.whatsapp-option').forEach(option => {
    option.addEventListener('click', () => {
      whatsappSelector.style.display = 'none';
    });
  });

  // =========================
  // TOASTIFY
  // =========================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = "toastify toastify-top toastify-right toastify-rounded";
    toast.textContent = message;
    toast.style.background = "var(--verde)";
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('on'), 100);
    setTimeout(() => {
      toast.classList.remove('on');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
});