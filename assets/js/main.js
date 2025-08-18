import { initPWA } from './modules/pwa.js';
import { setupServices } from './modules/services.js';
import { initModals } from './modules/modals.js';

document.addEventListener('DOMContentLoaded', () => {
  initPWA();
  setupServices();
  initModals();
}); 
