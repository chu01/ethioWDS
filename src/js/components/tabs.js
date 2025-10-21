export class Tabs {
    constructor(containerElement, options = {}) {
      this.container = containerElement;
      this.options = {
        defaultTab: 0,
        ...options
      };
      
      this.tablist = this.container.querySelector('[role="tablist"]');
      this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
      this.tabpanels = Array.from(this.container.querySelectorAll('[role="tabpanel"]'));
      
      this.init();
    }
  
    init() {
      if (!this.tablist || this.tabs.length === 0) {
        console.warn('Tab structure not found');
        return;
      }
  
      this.setupTabs();
      this.setupEventListeners();
      this.activateTab(this.options.defaultTab);
    }
  
    setupTabs() {
      this.tabs.forEach((tab, index) => {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
        
        const tabpanel = this.tabpanels[index];
        if (tabpanel) {
          tabpanel.setAttribute('aria-labelledby', tab.id || `tab-${index}`);
          tabpanel.hidden = true;
        }
      });
    }
  
    setupEventListeners() {
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => this.activateTab(index));
        
        tab.addEventListener('keydown', (e) => {
          switch(e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              this.focusPreviousTab();
              break;
            case 'ArrowRight':
              e.preventDefault();
              this.focusNextTab();
              break;
            case 'Home':
              e.preventDefault();
              this.focusFirstTab();
              break;
            case 'End':
              e.preventDefault();
              this.focusLastTab();
              break;
          }
        });
      });
    }
  
    activateTab(index) {
      // Deactivate all tabs
      this.tabs.forEach(tab => {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      });
      
      this.tabpanels.forEach(panel => {
        panel.hidden = true;
      });
      
      // Activate selected tab
      const selectedTab = this.tabs[index];
      const selectedPanel = this.tabpanels[index];
      
      if (selectedTab && selectedPanel) {
        selectedTab.setAttribute('aria-selected', 'true');
        selectedTab.setAttribute('tabindex', '0');
        selectedTab.focus();
        selectedPanel.hidden = false;
        
        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('tabs:change', { 
          detail: { index, tab: selectedTab, panel: selectedPanel },
          bubbles: true 
        }));
      }
    }
  
    focusPreviousTab() {
      const currentIndex = this.tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      const previousIndex = currentIndex <= 0 ? this.tabs.length - 1 : currentIndex - 1;
      this.tabs[previousIndex].focus();
    }
  
    focusNextTab() {
      const currentIndex = this.tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      const nextIndex = currentIndex >= this.tabs.length - 1 ? 0 : currentIndex + 1;
      this.tabs[nextIndex].focus();
    }
  
    focusFirstTab() {
      this.tabs[0].focus();
    }
  
    focusLastTab() {
      this.tabs[this.tabs.length - 1].focus();
    }
  
    destroy() {
      // Cleanup event listeners if needed
    }
  }