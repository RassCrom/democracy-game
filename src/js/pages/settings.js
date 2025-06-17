document.title = "⚙️ Settings";

document.addEventListener('click', function(event) {
    if (!event.target.closest('.setting-dropdown')) {
    closeAllDropdowns();
    }
});

function toggleDropdown(button) {
    const dropdown = button.nextElementSibling;
    const isActive = dropdown.classList.contains('active');
    
    closeAllDropdowns();
    
    if (!isActive) {
        dropdown.classList.add('active');
        button.classList.add('active');
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.classList.remove('active');
    });
}

function selectOption(option, value) {
    const dropdown = option.closest('.setting-dropdown');
    const button = dropdown.querySelector('.dropdown-button span:first-child');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    button.textContent = value;
    menu.classList.remove('active');
    dropdown.querySelector('.dropdown-button').classList.remove('active');
    
    option.style.background = 'rgba(71, 225, 141, 0.2)';
    setTimeout(() => {
    option.style.background = '';
    }, 200);
}

let settings = {
    'Game Mode': 'Political System',
    'Difficulty': 'Normal',
    'Timer': '1 minute',
    'Continent': 'all',
    'Organizations': 'All',
    'Distance Unit': 'Kilometers'
};

function initialSettings() {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    
    console.log('Settings saved:', settings);
}

function saveSettings() {
    document.querySelectorAll('.setting-group').forEach(group => {
        const label = group.querySelector('.setting-label').textContent;
        const value = group.querySelector('.dropdown-button span:first-child').textContent;
        settings[label] = value;
    });
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    
    console.log('Settings saved:', settings);
    // alert('Settings saved successfully!');
}

function resetSettings() {
    const defaults = {
        'Game Mode': 'Political System',
        'Difficulty': 'Normal',
        'Timer': '2 minutes',
        'Region': 'World Map',
        'Organizations': 'All',
        'Distance Unit': 'Kilometers'
    };
    
    document.querySelectorAll('.setting-group').forEach(group => {
    const label = group.querySelector('.setting-label').textContent;
    const button = group.querySelector('.dropdown-button span:first-child');
    if (defaults[label]) {
        button.textContent = defaults[label];
    }
    });
    
    alert('Settings reset to defaults');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown-button').forEach(button => {
    button.addEventListener('click', () => toggleDropdown(button));
  });

  document.querySelectorAll('.dropdown-option').forEach(option => {
    option.addEventListener('click', () => {
      const value = option.textContent;
      selectOption(option, value);
    });
  });

  const saveBtn = document.querySelector('.btn-primary');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => saveSettings());
  }

  const resetBtn = document.querySelector('.btn-secondary');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => resetSettings());
  }
});