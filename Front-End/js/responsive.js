// Código para manejar el menú móvil
document.addEventListener('DOMContentLoaded', function() {
    // Crear el botón de menú móvil si no existe
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Verificar si el botón ya existe
    let menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle && navMenu) {
        // Crear el botón del menú
        menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        menuToggle.setAttribute('type', 'button');
        
        // Insertar el botón después del logo
        const navBrand = navbar.querySelector('.nav-brand');
        if (navBrand) {
            navBrand.parentNode.insertBefore(menuToggle, navBrand.nextSibling);
        } else {
            // Si no hay logo, insertar al principio
            navbar.insertBefore(menuToggle, navbar.firstChild);
        }
        
        // Añadir evento de clic al botón
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Cambiar el ícono
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                this.setAttribute('aria-label', 'Cerrar menú');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                this.setAttribute('aria-label', 'Abrir menú');
            }
        });
        
        // Cerrar el menú cuando se hace clic en un enlace
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    if (icon && icon.classList.contains('fa-times')) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                        menuToggle.setAttribute('aria-label', 'Abrir menú');
                    }
                }
            });
        });
        
        // Cerrar el menú cuando se hace clic fuera de él
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && 
                !menuToggle.contains(event.target) && 
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                }
            }
        });
    }
    
    // Agregar clase para dispositivos móviles
    function updateMobileClass() {
        if (window.innerWidth <= 767) {
            document.body.classList.add('mobile-view');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                }
            }
        } else {
            document.body.classList.remove('mobile-view');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    }
    
    // Actualizar al cargar y al cambiar el tamaño de la ventana
    updateMobileClass();
    window.addEventListener('resize', updateMobileClass);
});

// Función para hacer responsivas las tablas
document.addEventListener('DOMContentLoaded', function() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Evitar envolver tablas que ya están dentro de un contenedor responsive
        if (!table.closest('.table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
    
    // Añadir clase a los botones de acciones para mejor visualización en móvil
    const actionButtons = document.querySelectorAll('.action-buttons');
    actionButtons.forEach(actionBtn => {
        if (window.innerWidth <= 767) {
            actionBtn.classList.add('action-buttons-stacked');
        }
    });
    
    // Actualizar al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        actionButtons.forEach(actionBtn => {
            if (window.innerWidth <= 767) {
                actionBtn.classList.add('action-buttons-stacked');
            } else {
                actionBtn.classList.remove('action-buttons-stacked');
            }
        });
    });
});

// Ajustar altura de tarjetas para que sean iguales en cada fila
document.addEventListener('DOMContentLoaded', function() {
    function equalizeCardHeights() {
        // Solo aplicar en pantallas más grandes que móviles
        if (window.innerWidth > 767) {
            const cards = document.querySelectorAll('.card');
            // Agrupar tarjetas por filas basadas en posición vertical
            const rows = {};
            
            // Resetear alturas
            cards.forEach(card => card.style.height = 'auto');
            
            // Obtener posición Y de cada tarjeta y agrupar
            cards.forEach(card => {
                const top = card.getBoundingClientRect().top;
                if (!rows[top]) rows[top] = [];
                rows[top].push(card);
            });
            
            // Para cada fila, encontrar la altura máxima y aplicarla a todas
            Object.values(rows).forEach(rowCards => {
                let maxHeight = 0;
                rowCards.forEach(card => {
                    maxHeight = Math.max(maxHeight, card.offsetHeight);
                });
                rowCards.forEach(card => {
                    card.style.height = `${maxHeight}px`;
                });
            });
        } else {
            // En móviles, dejar altura automática
            document.querySelectorAll('.card').forEach(card => {
                card.style.height = 'auto';
            });
        }
    }
    
    // Ejecutar después de que las imágenes y recursos carguen
    window.addEventListener('load', equalizeCardHeights);
    window.addEventListener('resize', equalizeCardHeights);
    
    // También ejecutar después de un breve retraso para asegurar carga completa
    setTimeout(equalizeCardHeights, 500);
});

// Mejorar accesibilidad en formularios
document.addEventListener('DOMContentLoaded', function() {
    // Añadir atributos aria a campos requeridos
    document.querySelectorAll('[required]').forEach(field => {
        field.setAttribute('aria-required', 'true');
        
        // Añadir asterisco visual para campos requeridos
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label && !label.innerHTML.includes('*')) {
            label.innerHTML += '<span class="required" aria-hidden="true">*</span>';
        }
    });
    
    // Mejorar contraste para campos enfocados
    document.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('field-focused');
        });
        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('field-focused');
        });
    });
});

// Ajustar visualización en dispositivos de alta densidad de píxeles
document.addEventListener('DOMContentLoaded', function() {
    if (window.devicePixelRatio > 1) {
        document.body.classList.add('high-dpi');
    }
});