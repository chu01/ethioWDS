export class Accordion {
    constructor(containerElement, options = {}) {
      this.container = containerElement;
      this.options = {
        multiple: false,
        ...options
      };
      
      this.items = Array.from(this.container.querySelectorAll('[data-accordion-item]'));
      this.init();
    }
  
    init() {
      if (this.items.length === 0) {
        console.warn('No accordion items found');
        return;
      }
  
      this.setupAccordionItems();
      this.setupEventListeners();
    }
  
    setupAccordionItems() {
      this.items.forEach((item, index) => {
        const trigger = item.querySelector('[data-accordion-trigger]');
        const content = item.querySelector('[data-accordion-content]');
        
        if (trigger && content) {
          trigger.setAttribute('aria-expanded', 'false');
          trigger.setAttribute('aria-controls', `accordion-content-${index}`);
          content.id = `accordion-content-${index}`;
          content.hidden = true;
        }
      });
    }
  
    setupEventListeners() {
      this.items.forEach(item => {
        const trigger = item.querySelector('[data-accordion-trigger]');
        if (trigger) {
          trigger.addEventListener('click', () => this.toggleItem(item));
          
          trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.toggleItem(item);
            }
          });
        }
      });
    }
  
    toggleItem(item) {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');
      
      if (!trigger || !content) return;
      
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        this.collapseItem(item);
      } else {
        this.expandItem(item);
      }
    }
  
    expandItem(item) {
      if (!this.options.multiple) {
        // Collapse all other items if not multiple
        this.items.forEach(otherItem => {
          if (otherItem !== item) {
            this.collapseItem(otherItem);
          }
        });
      }
      
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');
      
      if (trigger && content) {
        trigger.setAttribute('aria-expanded', 'true');
        content.hidden = false;
        
        item.classList.add('eth-accordion__item--active');
        
        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('accordion:expand', { 
          detail: { item, trigger, content },
          bubbles: true 
        }));
      }
    }
  
    collapseItem(item) {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');
      
      if (trigger && content) {
        trigger.setAttribute('aria-expanded', 'false');
        content.hidden = true;
        
        item.classList.remove('eth-accordion__item--active');
        
        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('accordion:collapse', { 
          detail: { item, trigger, content },
          bubbles: true 
        }));
      }
    }
  
    expandAll() {
      if (this.options.multiple) {
        this.items.forEach(item => this.expandItem(item));
      }
    }
  
    collapseAll() {
      this.items.forEach(item => this.collapseItem(item));
    }
  
    destroy() {
      // Cleanup event listeners if needed
    }
  }