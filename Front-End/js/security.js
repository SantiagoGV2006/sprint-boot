//Script de seguridad para bloquear herramientas de desarrollo

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
    
    // Iniciar la detección de herramientas de desarrollo
    detectDevTools();
    
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
})();