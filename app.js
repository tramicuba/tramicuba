document.addEventListener('DOMContentLoaded', function() {
  // =========================================
  // Código para PWA
  // =========================================
  let deferredPrompt;
  const installButton = document.getElementById('installButton');
  
  // Mostrar el botón de instalación cuando sea posible
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.classList.add('show');
  });
  
  // Manejar la instalación
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      Toastify({
        text: "¡Aplicación instalada con éxito!",
        duration: 3000,
        backgroundColor: "var(--verde)",
        className: "toastify-top toastify-center",
        gravity: "top"
      }).showToast();
    }
    deferredPrompt = null;
    installButton.classList.remove('show');
  });
  
  // Ocultar el botón si la app ya está instalada
  window.addEventListener('appinstalled', () => {
    installButton.classList.remove('show');
    deferredPrompt = null;
  });
  
  // Comprobar si la app ya está instalada
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    installButton.style.display = 'none';
  }
  
  // =========================================
  // Código original de la aplicación
  // =========================================
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  
  mobileMenuBtn.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('show');
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        nav.classList.remove('show');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
  
  // Modal functionality
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
  
  // Nuevos elementos para el servicio "Otros"
  const otrosCheckbox = document.getElementById('srv-otros');
  const otrosDesc = document.getElementById('otros-desc');
  const otrosError = document.getElementById('otros-error');
  
  // Mostrar/ocultar campo de texto para servicio "Otros"
  otrosCheckbox.addEventListener('change', function() {
    if (this.checked) {
      otrosDesc.style.display = 'block';
      otrosDesc.focus();
    } else {
      otrosDesc.style.display = 'none';
      otrosError.style.display = 'none';
    }
  });
  
  // 1. Selección por clic en toda la tarjeta (incluyendo el texto)
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    // Evitar que el clic en el textarea active la tarjeta
    const textarea = card.querySelector('.other-input');
    if (textarea) {
      textarea.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
    
    // Hacer toda la tarjeta clickeable
    card.addEventListener('click', function(e) {
      // Si el clic fue en el checkbox, no hacer nada adicional
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        
        // Disparar evento change manualmente
        const event = new Event('change');
        checkbox.dispatchEvent(event);
        
        // Actualizar el estilo visual
        if (checkbox.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      }
    });
  });
  
  // 2. Manejar cambios en los checkboxes para actualizar estilo
  const serviceCheckboxes = document.querySelectorAll('.service-checkbox input');
  serviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const card = this.closest('.service-card');
      if (this.checked) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  });
  
  finalButton.addEventListener('click', function() {
    // Ocultar errores globales previos
    globalError.style.display = 'none';
    globalError.textContent = '';
    
    // Obtener todos los servicios seleccionados
    const selectedServices = [];
    let otrosValid = true;
    
    // Validar servicio "Otros" (longitud mínima de 5 caracteres)
    if (otrosCheckbox.checked) {
      if (otrosDesc.value.trim() === '' || otrosDesc.value.trim().length < 5) {
        otrosValid = false;
        otrosError.style.display = 'block';
        otrosDesc.focus();
      } else {
        otrosError.style.display = 'none';
      }
    }
    
    // Recopilar servicios seleccionados
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        const serviceName = card.querySelector('.service-content h3').textContent;
        selectedServices.push(serviceName);
      }
    });
    
    // Verificar si hay al menos un servicio seleccionado
    if (selectedServices.length === 0) {
      // Mostrar error global sin abrir modal
      globalError.textContent = 'Por favor, selecciona al menos un servicio.';
      globalError.style.display = 'block';
      return;
    }
    
    // Verificar validación de "Otros" servicios
    if (!otrosValid) {
      globalError.textContent = 'Por favor, completa la descripción del servicio "Otros" (mínimo 5 caracteres).';
      globalError.style.display = 'block';
      return;
    }
    
    // Actualizar la lista en el modal
    listaServicios.innerHTML = '';
    
    // Mostrar los servicios seleccionados con sanitización
    selectedServices.forEach(service => {
      const li = document.createElement('li');
      
      // Agregar descripción si es el servicio "Otros"
      if (service === "Otros Servicios") {
        // Sanitización básica para prevenir XSS
        const sanitizedText = otrosDesc.value
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        li.innerHTML = `Otros: ${sanitizedText}`;
      } else {
        li.textContent = service;
      }
      
      listaServicios.appendChild(li);
    });
    
    // Mostrar elementos apropiados
    noServicesMessage.style.display = 'none';
    confirmationText.style.display = 'block';
    
    // Abrir el modal
    modalConfirm.classList.add('open');
  });
  
  cancelarBtn.addEventListener('click', function() {
    modalConfirm.classList.remove('open');
  });
  
  confirmarBtn.addEventListener('click', function() {
    modalConfirm.classList.remove('open');
    modalWhatsapp.classList.add('open');
    
    // Feedback visual al enviar
    Toastify({
      text: "¡Solicitud enviada con éxito!",
      duration: 3000,
      backgroundColor: "var(--verde)",
      className: "toastify-top toastify-right",
      gravity: "top",
      position: "right"
    }).showToast();
  });
  
  wpCloseBtn.addEventListener('click', function() {
    modalWhatsapp.classList.remove('open');
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modalConfirm) {
      modalConfirm.classList.remove('open');
    }
    if (e.target === modalWhatsapp) {
      modalWhatsapp.classList.remove('open');
    }
  });
  
  // Reloj animado
  let clockInterval = null;
  
  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;
    
    document.getElementById('clock-hour').style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    document.getElementById('clock-minute').style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    document.getElementById('clock-second').style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
  }
  
  // Actualizar el reloj cada segundo
  clockInterval = setInterval(updateClock, 1000);
  updateClock(); // Inicializar inmediatamente
  
  // WhatsApp selector
  const whatsappBtn = document.getElementById('whatsappBtn');
  const whatsappSelector = document.getElementById('whatsappSelector');
  
  // Mostrar/ocultar selector de WhatsApp
  whatsappBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    whatsappSelector.style.display = 
      whatsappSelector.style.display === 'block' ? 'none' : 'block';
  });
  
  // Ocultar selector al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!whatsappSelector.contains(e.target) && e.target !== whatsappBtn) {
      whatsappSelector.style.display = 'none';
    }
  });
  
  // Ocultar selector al seleccionar una opción
  document.querySelectorAll('.whatsapp-option').forEach(option => {
    option.addEventListener('click', function() {
      whatsappSelector.style.display = 'none';
    });
  });
  
  // Función Toastify (para notificaciones)
  function Toastify(options) {
    const toast = document.createElement('div');
    toast.className = `toastify ${options.className || ''} ${options.position || 'toastify-top'} ${options.gravity || ''}`;
    toast.innerHTML = options.text;
    toast.style.cssText = `background: ${options.backgroundColor};`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('on');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('on');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 400);
    }, options.duration || 3000);
    
    return {
      showToast: () => {}
    };
  }
});