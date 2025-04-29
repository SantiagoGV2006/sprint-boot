// Configuración base para las peticiones a la API
const API_BASE_URL = 'http://localhost:8080/api';
// Si necesitas usar una IP específica, puedes cambiar la línea anterior por:
// const API_BASE_URL = 'http://172.30.7.93:8080/api';

// Objeto global para acceder a las funciones de la API
const api = {
    /**
     * Función para realizar peticiones GET a la API
     * @param {string} endpoint - Endpoint de la API
     * @returns {Promise} - Respuesta de la API
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en GET ${endpoint}:`, error);
            showAlert(`Error al obtener datos: ${error.message}`, 'danger');
            throw error;
        }
    },
    
    /**
     * Función para realizar peticiones POST a la API
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} data - Datos a enviar en la petición
     * @returns {Promise} - Respuesta de la API
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.status === 429) {
                showAlert(`Has alcanzado el límite de creación de datos. Por favor, espera un momento.`, 'warning');
                throw new Error('Límite de creación de datos alcanzado');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en POST ${endpoint}:`, error);
            showAlert(`Error al crear: ${error.message}`, 'danger');
            throw error;
        }
    },
    
    /**
     * Función para realizar peticiones PUT a la API
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} data - Datos a enviar en la petición
     * @returns {Promise} - Respuesta de la API
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.status === 429) {
                showAlert(`Has alcanzado el límite de actualización de datos. Por favor, espera un momento.`, 'warning');
                throw new Error('Límite de actualización de datos alcanzado');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en PUT ${endpoint}:`, error);
            showAlert(`Error al actualizar: ${error.message}`, 'danger');
            throw error;
        }
    },
    
    /**
     * Función para realizar peticiones DELETE a la API
     * @param {string} endpoint - Endpoint de la API
     * @returns {Promise} - Respuesta de la API
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 429) {
                showAlert(`Has alcanzado el límite de eliminación de datos. Por favor, espera un momento.`, 'warning');
                throw new Error('Límite de eliminación de datos alcanzado');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Error en DELETE ${endpoint}:`, error);
            showAlert(`Error al eliminar: ${error.message}`, 'danger');
            throw error;
        }
    },
    
    // APIs específicas para cada entidad
    students: {
        getAll: () => api.get('students'),
        getById: (id) => api.get(`students/${id}`),
        create: (student) => api.post('students', student),
        update: (id, student) => api.put(`students/${id}`, student),
        delete: (id) => api.delete(`students/${id}`)
    },
    
    professors: {
        getAll: () => api.get('professors'),
        getById: (id) => api.get(`professors/${id}`),
        create: (professor) => api.post('professors', professor),
        update: (id, professor) => api.put(`professors/${id}`, professor),
        delete: (id) => api.delete(`professors/${id}`)
    },
    
    courses: {
        getAll: () => api.get('courses'),
        getById: (id) => api.get(`courses/${id}`),
        create: (course) => api.post('courses', course),
        update: (id, course) => api.put(`courses/${id}`, course),
        delete: (id) => api.delete(`courses/${id}`)
    },
    
    inscriptions: {
        getAll: () => api.get('inscriptions'),
        getById: (id) => api.get(`inscriptions/${id}`),
        create: (inscription) => api.post('inscriptions', inscription),
        update: (id, inscription) => api.put(`inscriptions/${id}`, inscription),
        delete: (id) => api.delete(`inscriptions/${id}`) // Corregido: era students/${id}
    },
    
    inscriptionDetails: {
        getAll: () => api.get('inscription-details'),
        getById: (id) => api.get(`inscription-details/${id}`),
        getByInscriptionId: (inscriptionId) => api.get(`inscription-details/inscription/${inscriptionId}`),
        getByInscriptionAndCourse: (inscriptionId, courseId) => 
            api.get(`inscription-details/inscription/${inscriptionId}/course/${courseId}`),
        create: (detail) => api.post('inscription-details', detail),
        update: (id, detail) => api.put(`inscription-details/${id}`, detail),
        delete: (id) => api.delete(`inscription-details/${id}`),
        deleteByInscriptionAndCourse: (inscriptionId, courseId) => 
            api.delete(`inscription-details/inscription/${inscriptionId}/course/${courseId}`)
    }
};

/**
 * Función para mostrar una alerta al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta: success, danger o warning
 */
function showAlert(message, type = 'success') {
    // Si ya existe una alerta, la eliminamos
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Creamos el elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insertamos la alerta al principio del contenedor principal
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // La alerta desaparece después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}