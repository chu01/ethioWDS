// Import core components
import { Modal } from './components/modal.js';
import { Select } from './components/select.js';
import { Tabs } from './components/tabs.js';
import { Accordion } from './components/accordion.js';

// Core JavaScript functionality
class EthioWDS {
  constructor(config = {}) {
    this.defaultConfig = {
      theme: 'default',
      rtl: false,
      language: 'am',
      loadCSS: true,
      loadFonts: true,
      autoInit: true,
      fonts: {
        ethiopic: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap',
        sans: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      }
    };
    this.config = { ...this.defaultConfig, ...config };
    this.components = new Map();
    
    if (this.config.autoInit) {
      this.init();
    }
  }

  init() {
    this.applyTheme();
    this.setDirection();
    if (this.config.loadCSS) this.loadCSS();
    if (this.config.loadFonts) this.loadFonts();
    this.autoInitializeComponents();
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

  // Auto-initialize all components
  autoInitializeComponents() {
    this.initModals();
    this.initSelects();
    this.initTabs();
    this.initAccordions();
    this.initSearch();
  }

  // Modal Component
  initModals() {
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
      const modal = new Modal(trigger);
      this.components.set(trigger, modal);
    });
  }

  openModal(modalId) {
    const trigger = document.querySelector(`[data-modal-target="${modalId}"]`);
    if (trigger && this.components.has(trigger)) {
      this.components.get(trigger).open();
    } else {
      // Fallback to existing method
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  closeModal(modalId) {
    const trigger = document.querySelector(`[data-modal-target="${modalId}"]`);
    if (trigger && this.components.has(trigger)) {
      this.components.get(trigger).close();
    } else {
      // Fallback to existing method
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  // Select Component
  initSelects() {
    document.querySelectorAll('select[data-custom-select]').forEach(select => {
      const customSelect = new Select(select);
      this.components.set(select, customSelect);
    });
  }

  createSelect(selectElement, options = {}) {
    const select = new Select(selectElement, options);
    this.components.set(selectElement, select);
    return select;
  }

  // Tabs Component
  initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(tabContainer => {
      const tabs = new Tabs(tabContainer);
      this.components.set(tabContainer, tabs);
    });
  }

  switchTab(tabGroup, tabId) {
    // New method using Tabs component
    const tabContainer = document.querySelector(`[data-tabs="${tabGroup}"]`);
    if (tabContainer && this.components.has(tabContainer)) {
      const tabs = this.components.get(tabContainer);
      const tabIndex = Array.from(tabContainer.querySelectorAll('[role="tab"]')).findIndex(
        tab => tab.dataset.tab === tabId || tab.textContent.trim() === tabId
      );
      if (tabIndex !== -1) {
        tabs.activateTab(tabIndex);
      }
    } else {
      // Fallback to existing method
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
  }

  // Accordion Component (Enhanced)
  initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(accordion => {
      const accordionInstance = new Accordion(accordion);
      this.components.set(accordion, accordionInstance);
    });

    // Keep legacy support for old accordion structure
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('ethio-accordion-header')) {
        this.toggleAccordion(e.target);
      }
    });
  }

  toggleAccordion(header) {
    // Try to use new Accordion component first
    const accordion = header.closest('[data-accordion]');
    if (accordion && this.components.has(accordion)) {
      const accordionInstance = this.components.get(accordion);
      accordionInstance.toggleItem(header.closest('[data-accordion-item]'));
    } else {
      // Fallback to legacy method
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
  }

  // Expand/Collapse all accordions
  expandAllAccordions() {
    this.components.forEach(component => {
      if (component instanceof Accordion && component.options.multiple) {
        component.expandAll();
      }
    });
  }

  collapseAllAccordions() {
    this.components.forEach(component => {
      if (component instanceof Accordion) {
        component.collapseAll();
      }
    });
  }

  // Search methods (unchanged)
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

  // Public API methods for manual component creation
  createModal(triggerElement, options = {}) {
    const modal = new Modal(triggerElement, options);
    this.components.set(triggerElement, modal);
    return modal;
  }

  createTabs(containerElement, options = {}) {
    const tabs = new Tabs(containerElement, options);
    this.components.set(containerElement, tabs);
    return tabs;
  }

  createAccordion(containerElement, options = {}) {
    const accordion = new Accordion(containerElement, options);
    this.components.set(containerElement, accordion);
    return accordion;
  }

  // Get component instance
  getComponent(element) {
    return this.components.get(element);
  }

  // Destroy all components
  destroy() {
    this.components.forEach(component => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components.clear();
  }

  // Utility method to get version
  static getVersion() {
    return '1.3.0'; // Updated version with enhanced JS components
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  function autoInitEthioWDS() {
    if (!window.ethioWDSInstance) {
      window.ethioWDSInstance = new EthioWDS();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitEthioWDS);
  } else {
    autoInitEthioWDS();
  }

  window.EthioWDS = EthioWDS;
  window.ethioWDS = window.ethioWDSInstance;
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EthioWDS;
}

if (typeof exports !== 'undefined') {
  exports.default = EthioWDS;
}

export default EthioWDS;