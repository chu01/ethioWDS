export class Modal {
    constructor(triggerElement, options = {}) {
      this.trigger = triggerElement;
      this.modalId = this.trigger.dataset.modalTarget;
      this.modal = document.getElementById(this.modalId);
      this.options = {
        closeOnBackdrop: true,
        closeOnEscape: true,
        ...options
      };
      
      this.init();
    }
  
    init() {
      if (!this.modal) {
        console.warn(`Modal with ID ${this.modalId} not found`);
        return;
      }
  
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      this.trigger.addEventListener('click', () => this.open());
  
      const closeButtons = this.modal.querySelectorAll('[data-modal-close]');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });
  
      if (this.options.closeOnBackdrop) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) {
            this.close();
          }
        });
      }
  
      if (this.options.closeOnEscape) {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isOpen()) {
            this.close();
          }
        });
      }
    }
  
    open() {
      this.modal.classList.add('eth-modal--active');
      document.body.style.overflow = 'hidden';
      this.trigger.setAttribute('aria-expanded', 'true');
      this.trapFocus();
      this.modal.dispatchEvent(new CustomEvent('modal:open', { bubbles: true }));
    }
  
    close() {
      this.modal.classList.remove('eth-modal--active');
      document.body.style.overflow = '';
      this.trigger.setAttribute('aria-expanded', 'false');
      this.trigger.focus();
      this.modal.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));
    }
  
    isOpen() {
      return this.modal.classList.contains('eth-modal--active');
    }
  
    trapFocus() {
      const focusableElements = this.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  
    destroy() {
      // Cleanup event listeners if needed
    }
  }