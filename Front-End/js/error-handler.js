// error-handler.js

/**
 * Función para procesar las respuestas de error de la API
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise} - Promesa con el error procesado
 */
async function handleApiError(response) {
    // Intentar obtener la información de error desde JSON
    try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
            throw new Error(errorData.message);
        } else if (errorData && errorData.errors) {
            // Si hay múltiples errores de validación
            const errors = Object.values(errorData.errors).join(', ');
            throw new Error(`Errores de validación: ${errors}`);
        }
    } catch (jsonError) {
        // Si no se puede extraer como JSON, usar el statusText
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
}

/**
 * Función para mostrar mensajes de error de forma consistente
 * @param {Error} error - Objeto Error
 * @param {string} context - Contexto donde ocurrió el error
 */
function logAndShowError(error, context) {
    console.error(`Error en ${context}:`, error);
    
    // Mensaje más amigable para el usuario
    let message = 'Ha ocurrido un error al procesar tu solicitud.';
    
    if (error.message) {
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else {
            message = error.message;
        }
    }
    
    // Mostrar alerta usando la función global showAlert si está disponible
    if (typeof showAlert === 'function') {
        showAlert(message, 'danger');
    } else {
        alert(message);
    }
}
