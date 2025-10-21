export class Select {
    constructor(selectElement, options = {}) {
      this.originalSelect = selectElement;
      this.options = {
        searchable: false,
        placeholder: 'Select an option',
        ...options
      };
      
      this.init();
    }
  
    init() {
      this.createCustomSelect();
      this.setupEventListeners();
      this.syncWithOriginal();
    }
  
    createCustomSelect() {
      this.customSelect = document.createElement('div');
      this.customSelect.className = 'eth-select';
      
      const trigger = document.createElement('button');
      trigger.className = 'eth-select__trigger';
      trigger.type = 'button';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.innerHTML = `
        <span class="eth-select__value">${this.options.placeholder}</span>
        <span class="eth-select__chevron">▼</span>
      `;
  
      const dropdown = document.createElement('div');
      dropdown.className = 'eth-select__dropdown';
      dropdown.style.display = 'none';
      dropdown.setAttribute('role', 'listbox');
      
      if (this.options.searchable) {
        const search = document.createElement('div');
        search.className = 'eth-select__search';
        search.innerHTML = '<input type="text" placeholder="Search..." class="eth-select__search-input">';
        dropdown.appendChild(search);
      }
  
      const optionsList = document.createElement('ul');
      optionsList.className = 'eth-select__options';
      
      Array.from(this.originalSelect.options).forEach(option => {
        const li = document.createElement('li');
        li.className = 'eth-select__option';
        li.textContent = option.textContent;
        li.dataset.value = option.value;
        li.setAttribute('role', 'option');
        
        if (option.selected) {
          li.classList.add('eth-select__option--selected');
          li.setAttribute('aria-selected', 'true');
          trigger.querySelector('.eth-select__value').textContent = option.textContent;
        }
        
        optionsList.appendChild(li);
      });
  
      dropdown.appendChild(optionsList);
      this.customSelect.appendChild(trigger);
      this.customSelect.appendChild(dropdown);
      
      this.originalSelect.style.display = 'none';
      this.originalSelect.parentNode.insertBefore(this.customSelect, this.originalSelect.nextSibling);
    }
  
    setupEventListeners() {
      const trigger = this.customSelect.querySelector('.eth-select__trigger');
      const dropdown = this.customSelect.querySelector('.eth-select__dropdown');
      const options = this.customSelect.querySelectorAll('.eth-select__option');
  
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
  
      options.forEach(option => {
        option.addEventListener('click', () => {
          this.selectOption(option);
        });
      });
  
      document.addEventListener('click', () => {
        this.closeDropdown();
      });
  
      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleDropdown();
        }
      });
    }
  
    toggleDropdown() {
      const dropdown = this.customSelect.querySelector('.eth-select__dropdown');
      const isOpen = dropdown.style.display === 'block';
      
      if (isOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    }
  
    openDropdown() {
      const dropdown = this.customSelect.querySelector('.eth-select__dropdown');
      const trigger = this.customSelect.querySelector('.eth-select__trigger');
      
      dropdown.style.display = 'block';
      trigger.classList.add('eth-select__trigger--open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  
    closeDropdown() {
      const dropdown = this.customSelect.querySelector('.eth-select__dropdown');
      const trigger = this.customSelect.querySelector('.eth-select__trigger');
      
      dropdown.style.display = 'none';
      trigger.classList.remove('eth-select__trigger--open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  
    selectOption(optionElement) {
      const value = optionElement.dataset.value;
      const text = optionElement.textContent;
      
      // Update UI
      this.customSelect.querySelector('.eth-select__value').textContent = text;
      
      // Remove previous selection
      this.customSelect.querySelectorAll('.eth-select__option--selected').forEach(opt => {
        opt.classList.remove('eth-select__option--selected');
        opt.setAttribute('aria-selected', 'false');
      });
      
      // Add new selection
      optionElement.classList.add('eth-select__option--selected');
      optionElement.setAttribute('aria-selected', 'true');
      
      // Update original select
      this.originalSelect.value = value;
      this.originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
      
      this.closeDropdown();
    }
  
    syncWithOriginal() {
      this.originalSelect.addEventListener('change', () => {
        const selectedOption = this.originalSelect.options[this.originalSelect.selectedIndex];
        this.customSelect.querySelector('.eth-select__value').textContent = selectedOption.textContent;
      });
    }
  
    destroy() {
      // Cleanup and restore original select
      if (this.customSelect && this.customSelect.parentNode) {
        this.customSelect.parentNode.removeChild(this.customSelect);
        this.originalSelect.style.display = '';
      }
    }
  }