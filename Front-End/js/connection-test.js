// connection-test.js

/**
 * Verifica la conexión con el backend al cargar la página
 */
document.addEventListener('DOMContentLoaded', async () => {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'connection-status';
    statusIndicator.style.position = 'fixed';
    statusIndicator.style.bottom = '10px';
    statusIndicator.style.right = '10px';
    statusIndicator.style.padding = '8px 12px';
    statusIndicator.style.borderRadius = '4px';
    statusIndicator.style.fontSize = '12px';
    statusIndicator.style.zIndex = '9999';
    statusIndicator.style.display = 'none';
    
    document.body.appendChild(statusIndicator);
    
    try {
        // Intentar hacer una petición simple al backend
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // Timeout de 5 segundos
            signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
            showConnectionStatus('Conectado al servidor', 'success');
            console.log('Conexión establecida con el backend.');
        } else {
            showConnectionStatus(`Error de conexión: ${response.status}`, 'warning');
            console.warn('El servidor respondió con un error:', response.status);
        }
    } catch (error) {
        showConnectionStatus('Sin conexión al servidor', 'danger');
        console.error('No se pudo conectar con el backend:', error);
        
        if (typeof showAlert === 'function') {
            showAlert('No se pudo establecer conexión con el servidor. Verifica que el backend esté funcionando.', 'danger');
        }
    }
    
    /**
     * Muestra el estado de la conexión
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: success, warning, danger
     */
    function showConnectionStatus(message, type) {
        const statusIndicator = document.getElementById('connection-status');
        if (!statusIndicator) return;
        
        statusIndicator.textContent = message;
        statusIndicator.style.display = 'block';
        
        switch (type) {
            case 'success':
                statusIndicator.style.backgroundColor = '#d4edda';
                statusIndicator.style.color = '#155724';
                break;
            case 'warning':
                statusIndicator.style.backgroundColor = '#fff3cd';
                statusIndicator.style.color = '#856404';
                break;
            case 'danger':
                statusIndicator.style.backgroundColor = '#f8d7da';
                statusIndicator.style.color = '#721c24';
                break;
        }
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            statusIndicator.style.display = 'none';
        }, 1000);
    }
});