// debug-helper.js
// Herramienta para ayudar a diagnosticar problemas de conexión con el backend

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Activar flag de debugging
    const DEBUG = true;
    
    // Solo ejecutar si DEBUG está activado
    if (!DEBUG) return;
    
    // Verificar que API_BASE_URL existe, si no, usar un valor predeterminado
    const apiBaseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8080/api';
    
    // Crear panel de debugging
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.position = 'fixed';
    debugPanel.style.bottom = '10px';
    debugPanel.style.left = '10px';
    debugPanel.style.width = '300px';
    debugPanel.style.maxHeight = '200px';
    debugPanel.style.overflow = 'auto';
    debugPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    debugPanel.style.color = '#00ff00';
    debugPanel.style.padding = '10px';
    debugPanel.style.fontFamily = 'monospace';
    debugPanel.style.fontSize = '12px';
    debugPanel.style.zIndex = '10000';
    debugPanel.style.borderRadius = '5px';
    debugPanel.style.display = 'none'; // Inicialmente oculto
    
    // Botón para mostrar/ocultar el panel
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Debug';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '10001';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.backgroundColor = '#333';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.cursor = 'pointer';
    
    // Agregar elementos al DOM
    document.body.appendChild(debugPanel);
    document.body.appendChild(toggleButton);
    
    // Agregar evento para mostrar/ocultar el panel
    toggleButton.addEventListener('click', () => {
        debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
    });
    
    // Función para agregar mensaje al panel
    function logDebug(message, type = 'info') {
        const entry = document.createElement('div');
        entry.style.marginBottom = '5px';
        entry.style.borderLeft = '3px solid';
        entry.style.paddingLeft = '5px';
        
        // Colorear según el tipo de mensaje
        switch (type) {
            case 'error':
                entry.style.borderColor = '#ff5555';
                break;
            case 'warning':
                entry.style.borderColor = '#ffff55';
                break;
            case 'success':
                entry.style.borderColor = '#55ff55';
                break;
            default:
                entry.style.borderColor = '#5555ff';
        }
        
        // Agregar timestamp
        const timestamp = new Date().toLocaleTimeString();
        entry.textContent = `[${timestamp}] ${message}`;
        
        // Agregar al panel y hacer scroll
        debugPanel.appendChild(entry);
        debugPanel.scrollTop = debugPanel.scrollHeight;
    }
    
    // Interceptar todas las peticiones fetch para debugging
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const url = args[0];
        const options = args[1] || {};
        
        logDebug(`Petición: ${options.method || 'GET'} ${url}`, 'info');
        
        if (options.body) {
            try {
                // Intentar formatear el cuerpo JSON
                const body = JSON.parse(options.body);
                logDebug(`Enviando: ${JSON.stringify(body, null, 2)}`, 'info');
            } catch (e) {
                // Si no es JSON, mostrar como texto
                logDebug(`Enviando datos no-JSON`, 'info');
            }
        }
        
        try {
            const response = await originalFetch(...args);
            
            // Clonar la respuesta para no consumirla
            const clonedResponse = response.clone();
            
            // Intentar obtener el cuerpo como JSON
            try {
                const responseBody = await clonedResponse.json();
                logDebug(`Respuesta: ${response.status} ${response.statusText}`, 
                    response.ok ? 'success' : 'error');
                    
                if (!response.ok) {
                    logDebug(`Error: ${JSON.stringify(responseBody, null, 2)}`, 'error');
                }
            } catch (e) {
                // Si no es JSON
                logDebug(`Respuesta no-JSON: ${response.status} ${response.statusText}`, 
                    response.ok ? 'success' : 'error');
            }
            
            return response;
        } catch (error) {
            logDebug(`Error de red: ${error.message}`, 'error');
            throw error;
        }
    };
    
    // Interceptar console.log
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        logDebug(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '), 'info');
    };
    
    console.error = function(...args) {
        originalConsoleError.apply(console, args);
        logDebug(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '), 'error');
    };
    
    console.warn = function(...args) {
        originalConsoleWarn.apply(console, args);
        logDebug(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '), 'warning');
    };
    
    // Mensaje inicial
    logDebug(`Debugging activado (API: ${apiBaseUrl})`, 'info');
});