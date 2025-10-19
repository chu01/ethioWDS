// Core JavaScript functionality
class EthioWDS {
  constructor(config = {}) {
    this.defaultConfig = {
      theme: 'default',
      rtl: false,
      language: 'am',
      loadCSS: true,
      loadFonts: true,
      fonts: {
        ethiopic: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap',
        sans: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      }
    };
    this.config = { ...this.defaultConfig, ...config };
    this.init();
  }

  init() {
    this.applyTheme();
    this.setDirection();
    if (this.config.loadCSS) this.loadCSS();
    if (this.config.loadFonts) this.loadFonts();
    this.initAccordions();
    this.initSearch();
  }

  loadCSS() {
    if (!document.querySelector('#ethiowds-css')) {
      const link = document.createElement('link');
      link.id = 'ethiowds-css';
      link.rel = 'stylesheet';
      link.href = this.config.cssUrl || './css/ethio-wds.css';
      document.head.appendChild(link);
    }
  }

  loadFonts() {
    // Load Noto Sans Ethiopic
    if (!document.querySelector('#ethiopic-fonts')) {
      const ethiopicLink = document.createElement('link');
      ethiopicLink.id = 'ethiopic-fonts';
      ethiopicLink.rel = 'stylesheet';
      ethiopicLink.href = this.config.fonts.ethiopic;
      document.head.appendChild(ethiopicLink);
    }

    // Load Inter font
    if (!document.querySelector('#sans-fonts')) {
      const sansLink = document.createElement('link');
      sansLink.id = 'sans-fonts';
      sansLink.rel = 'stylesheet';
      sansLink.href = this.config.fonts.sans;
      document.head.appendChild(sansLink);
    }
  }

  applyTheme() {
    if (this.config.theme !== 'default') {
      document.documentElement.setAttribute('data-theme', this.config.theme);
    }
  }

  setDirection() {
    if (this.config.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }

  // Accordion methods
  initAccordions() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('ethio-accordion-header')) {
        this.toggleAccordion(e.target);
      }
    });
  }

  toggleAccordion(header) {
    const isActive = header.classList.contains('active');
    const content = header.nextElementSibling;
    const icon = header.querySelector('.ethio-accordion-icon');

    // Close all in the same group if needed
    if (header.dataset.accordionGroup) {
      const group = header.dataset.accordionGroup;
      document.querySelectorAll(`[data-accordion-group="${group}"]`).forEach(item => {
        if (item !== header && item.classList.contains('active')) {
          item.classList.remove('active');
          item.nextElementSibling.classList.remove('active');
        }
      });
    }

    header.classList.toggle('active', !isActive);
    content.classList.toggle('active', !isActive);

    if (icon) {
      icon.style.transform = !isActive ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }

  // Search methods
  initSearch() {
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('ethio-search-input')) {
        this.handleSearchInput(e.target);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('ethio-search-clear')) {
        this.clearSearch(e.target);
      }
    });
  }

  handleSearchInput(input) {
    const clearBtn = input.parentElement.querySelector('.ethio-search-clear');
    if (clearBtn) {
      clearBtn.style.display = input.value ? 'block' : 'none';
    }
  }

  clearSearch(clearBtn) {
    const input = clearBtn.parentElement.querySelector('.ethio-search-input');
    if (input) {
      input.value = '';
      input.focus();
      clearBtn.style.display = 'none';
      
      // Trigger input event for any listeners
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Modal methods
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Tab methods
  switchTab(tabGroup, tabId) {
    const tabs = document.querySelectorAll(`[data-tab-group="${tabGroup}"]`);
    const panels = document.querySelectorAll(`[data-panel-group="${tabGroup}"]`);

    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));

    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    const activePanel = document.querySelector(`[data-panel="${tabId}"]`);

    if (activeTab && activePanel) {
      activeTab.classList.add('active');
      activePanel.classList.add('active');
    }
  }

  // Utility method to get version
  static getVersion() {
    return '1.2.0'; // Updated version with new components
  }
}

// Export for different environments
if (typeof window !== 'undefined') {
  window.ethioWDS = EthioWDS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EthioWDS;
}

if (typeof exports !== 'undefined') {
  exports.default = EthioWDS;
}