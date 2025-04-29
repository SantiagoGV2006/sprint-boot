// Función para manejar el cambio de tema
function setupThemeToggle() {
    // Verificar si el elemento del toggle existe en la página
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    if (!toggleSwitch) return;
    
    // Función para cambiar el tema
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(true);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateThemeIcon(false);
        }
    }
    
    // Función para actualizar el icono según el tema
    function updateThemeIcon(isDark) {
        const themeIcon = document.querySelector('.theme-icon');
        if (!themeIcon) return;
        
        if (isDark) {
            themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Evento para el cambio de tema
    toggleSwitch.addEventListener('change', switchTheme);
    
    // Cargar preferencia guardada (si existe)
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
            updateThemeIcon(true);
        } else {
            updateThemeIcon(false);
        }
    } else {
        // Si no hay preferencia guardada, detectar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            toggleSwitch.checked = true;
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(true);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupThemeToggle);