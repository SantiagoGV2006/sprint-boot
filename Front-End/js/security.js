//Script de seguridad para bloquear herramientas de desarrollo y proteger navegación

(function() {
    // Función para mostrar una notificación temporal
    function showTemporaryNotification(message) {
        // Crear el elemento de notificación
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#f44336';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.textAlign = 'center';
        notification.style.fontWeight = 'bold';
        notification.innerText = message;
        
        // Añadir al DOM
        document.body.appendChild(notification);
        
        // Eliminar después de 1 segundo
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 1000);
    }
    
    // Bloquear clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showTemporaryNotification('Acción no permitida');
        return false;
    }, true);
    
    // Bloquear teclas relacionadas con DevTools
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
        if (
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I, J, C
            (e.ctrlKey && e.keyCode === 85) // Ctrl+U
        ) {
            e.preventDefault();
            showTemporaryNotification('Acción no permitida');
            return false;
        }
    }, true);
    
    // Detectar y bloquear cuando se abren las herramientas de desarrollo
    function detectDevTools() {
        function handleDevTools(isOpen) {
            if (isOpen) {
                // Bloqueamos la página
                document.body.innerHTML = '<div style="text-align: center; margin-top: 50px;"><h1>Acceso bloqueado</h1><p>No está permitido el uso de herramientas de desarrollo en esta aplicación.</p></div>';
            }
        }
        
        // Método 1: Detección por tamaño de la ventana
        const threshold = 160;
        const checkDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            if (widthThreshold || heightThreshold) {
                handleDevTools(true);
            }
        };
        
        // Método 2: Detección usando console.log
        const div = document.createElement('div');
        Object.defineProperty(div, 'id', {
            get: function() {
                handleDevTools(true);
                return 'id';
            }
        });
        
        // Método 3: Detección con debugger
        setInterval(function() {
            checkDevTools();
            
            const startTime = new Date();
            debugger;
            const endTime = new Date();
            
            if (endTime - startTime > 100) {
                handleDevTools(true);
            }
        }, 1000);
        
        // Comprobar continuamente
        window.addEventListener('resize', checkDevTools);
        setInterval(checkDevTools, 1000);
        console.log(div);
    }
    
    // Deshabilitar selección de texto para evitar copiar el código
    document.onselectstart = function() {
        return false;
    };
    
    // Deshabilitar arrastrar y soltar
    document.ondragstart = function() {
        return false;
    };
    
    // Definir todos los eventos que queremos bloquear
    const events = ['copy', 'cut', 'paste', 'select', 'selectstart', 'dragstart', 'contextmenu'];
    events.forEach(function(event) {
        document.addEventListener(event, function(e) {
            e.preventDefault();
            if (event === 'contextmenu' || event === 'copy' || event === 'cut' || event === 'paste') {
                showTemporaryNotification('Acción no permitida');
            }
            return false;
        }, true);
    });
    
    // Sobreescribir funciones de consola
    (function() {
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
            debug: console.debug,
            clear: console.clear
        };
        
        function blockConsole(type) {
            console[type] = function() {
                // No hacemos nada, efectivamente bloqueando la función
            };
        }
        
        // Bloquear todas las funciones de la consola
        Object.keys(originalConsole).forEach(blockConsole);
    })();
    
    /**
     * Módulo mejorado de protección de navegación.
     * Previene acceso directo a páginas y listado de directorios.
     */
    (function() {
        // Archivo principal de la aplicación
        const INDEX_FILE = '/html/index.html';
        
        // Clave para almacenar estado de navegación
        const SESSION_KEY = 'authenticated_navigation';
        
        // Páginas permitidas (rutas relativas desde la raíz)
        const VALID_PAGES = [
            '/html/index.html',
            '/html/students.html',
            '/html/professors.html',
            '/html/courses.html',
            '/html/inscriptions.html',
            '/html/inscription-details.html'
        ];
        
        // Tiempo de expiración (30 minutos)
        const SESSION_TIMEOUT = 30 * 60 * 1000;
        
        /**
         * Función principal que inicializa la protección
         */
        function initNavProtection() {
            // Comprobar si estamos en un directorio sin archivo específico
            if (isDirectoryListing()) {
                redirectToIndex();
                return;
            }
            
            const currentPath = getRelativePath();
            
            // Si estamos en el inicio, establecer como navegación válida
            if (isIndexPage(currentPath)) {
                setAuthState();
                return;
            }
            
            // Verificar si la ruta actual es válida y la navegación está autenticada
            const isValidPath = VALID_PAGES.some(page => currentPath === page);
            
            if (!isValidPath || !isAuthValid()) {
                redirectToIndex();
            } else {
                // Actualizar timestamp de navegación válida
                updateAuthState();
            }
        }
        
        /**
         * Verifica si la URL actual es un listado de directorio
         */
        function isDirectoryListing() {
            const path = window.location.pathname;
            // URLs que terminan en / o no tienen extensión suelen ser listados de directorios
            return path.endsWith('/') || !path.includes('.html');
        }
        
        /**
         * Verifica si estamos en la página de inicio
         */
        function isIndexPage(path) {
            return path === INDEX_FILE;
        }
        
        /**
         * Obtiene la ruta relativa desde la raíz del sitio
         */
        function getRelativePath() {
            // Obtener la ruta actual
            const fullPath = window.location.pathname;
            
            // En localhost podemos tener algo como /project/html/page.html
            // Queremos convertirlo a /html/page.html
            
            // Detectar si hay una ruta base (por ejemplo, /project/)
            const baseUrl = detectBaseUrl(fullPath);
            
            // Eliminar la ruta base del inicio si existe
            return fullPath.replace(baseUrl, '');
        }
        
        /**
         * Detecta la base URL si existe
         * Por ejemplo, si la URL es /project/html/index.html, devuelve /project/
         */
        function detectBaseUrl(path) {
            // Localizar el primer directorio 'html' en la ruta
            const htmlIndex = path.indexOf('/html/');
            
            if (htmlIndex > 0) {
                // Si el directorio 'html' no está en la raíz, hay una ruta base
                return path.substring(0, htmlIndex);
            }
            
            return '';
        }
        
        /**
         * Redirecciona a la página de inicio
         */
        function redirectToIndex() {
            // Detectar la ruta base (si existe)
            const baseUrl = detectBaseUrl(window.location.pathname);
            
            // Construir la URL completa al índice
            const indexUrl = baseUrl + INDEX_FILE;
            
            // Redirigir
            window.location.href = indexUrl;
        }
        
        /**
         * Establece el estado de navegación autenticada
         */
        function setAuthState() {
            const authData = {
                timestamp: Date.now(),
                authenticated: true
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(authData));
        }
        
        /**
         * Actualiza la timestamp de autenticación
         */
        function updateAuthState() {
            const authData = JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {};
            authData.timestamp = Date.now();
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(authData));
        }
        
        /**
         * Verifica si la autenticación de navegación es válida
         */
        function isAuthValid() {
            const authData = JSON.parse(sessionStorage.getItem(SESSION_KEY));
            if (!authData || !authData.authenticated) {
                return false;
            }
            
            // Comprobar si ha expirado
            const isExpired = (Date.now() - authData.timestamp) > SESSION_TIMEOUT;
            return !isExpired;
        }
        
        /**
         * Configura eventos de navegación interna
         */
        function setupNavLinks() {
            // Marcar como navegación válida cuando se hace clic en enlaces del menú
            document.querySelectorAll('.nav-menu a, .card').forEach(link => {
                link.addEventListener('click', setAuthState);
            });
        }
        
        // Ejecutar de inmediato para proteger durante la carga
        initNavProtection();
        
        // Configurar enlaces cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', setupNavLinks);
        
        // También, atrapamos cualquier intento de volver atrás en el historial del navegador
        window.addEventListener('popstate', function() {
            // Verificar si la navegación es válida
            setTimeout(initNavProtection, 100);
        });
    })();
    
    // Prevenir que la página sea cargada dentro de un iframe
    if (window.self !== window.top) {
        window.top.location.href = window.self.location.href;
    }
    
})();