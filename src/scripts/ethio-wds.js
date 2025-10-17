// Core JavaScript functionality
class EthioWDS {
    constructor(config = {}) {
      this.defaultConfig = {
        theme: 'default',
        rtl: false,
        language: 'am',
        loadCSS: true
      };
      this.config = { ...this.defaultConfig, ...config };
      this.init();
    }
  
    init() {
      this.applyTheme();
      this.setDirection();
      this.loadFonts();
      if (this.config.loadCSS) {
        this.loadCSS();
      }
    }
  
    loadCSS() {
      // Dynamically load CSS if not already loaded
      if (!document.querySelector('#ethiowds-css')) {
        const link = document.createElement('link');
        link.id = 'ethiowds-css';
        link.rel = 'stylesheet';
        // For development, you might want to use a local path
        // For production, this would be the CDN path
        link.href = './css/ethio-wds.css';
        document.head.appendChild(link);
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
  
    loadFonts() {
      // Load Noto Sans Ethiopic if not already loaded
      if (!document.querySelector('#ethiopic-fonts')) {
        const link = document.createElement('link');
        link.id = 'ethiopic-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap';
        document.head.appendChild(link);
      }
    }
  
    // Method to update configuration
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      this.init();
    }
  
    // Utility method to get version
    static getVersion() {
      return '1.0.0';
    }
  }
  
  // Export for different environments
  if (typeof window !== 'undefined') {
    window.ethioWDS = EthioWDS;
  }
  
  // For CommonJS (Node.js)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthioWDS;
  }
  
  // For ES6 modules
  if (typeof exports !== 'undefined') {
    exports.default = EthioWDS;
  }