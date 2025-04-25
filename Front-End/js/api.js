
const API_BASE_URL = 'http://172.30.7.93:8080/api'; // Asegúrate que esta URL es correcta

const api = {
    /**
     * @returns {string|null}
     */
    getAuthToken: function() {
        return localStorage.getItem('auth_token');
    },
    
    /**
     * @param {string} endpoint 
     * @returns {Promise} 
     */
    async get(endpoint) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'GET',
                headers: headers
            });
            
            if (response.status === 401) {
                window.location.href = '../html/login.html';
                throw new Error('Sesión expirada o no autorizada');
            }
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en GET ${endpoint}:`, error);
            showAlert(`Error al obtener datos: ${error.message}`, 'danger');
            throw error;
        }
    },
    
    /**
     * @param {string} endpoint 
     * @param {Object} data 
     * @returns {Promise} 
     */
    async post(endpoint, data) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (response.status === 401) {
                window.location.href = '../html/login.html';
                throw new Error('Sesión expirada o no autorizada');
            }
            
            if (response.status === 429) {
                showAlert(`Has alcanzado el límite de creación de datos. Por favor, espera un momento.`, 'warning');
                throw new Error('Límite de creación de datos alcanzado');
            }
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en POST ${endpoint}:`, error);
            showAlert(`Error al crear: ${error.message}`, 'danger');
            throw error;
        }
    },
    
    /**
     * @param {string} endpoint 
     * @param {Object} data 
     * @returns {Promise} 
     */
    async put(endpoint, data) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (response.status === 401) {
                window.location.href = '../html/login.html';
                throw new Error('Sesión expirada o no autorizada');
            }
            
            if (response.status === 429) {
                showAlert(`Has alcanzado el límite de actualización de datos. Por favor, espera un momento.`, 'warning');
                throw new Error('Límite de actualización de datos alcanzado');
            }
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error en PUT ${endpoint}:`, error);
            showAlert(`Error al actualizar: ${error.message}`, 'danger');
            throw error;
        }
    },
    
    /**
     * @param {string} endpoint 
     * @returns {Promise} 
     */
    async delete(endpoint) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'DELETE',
                headers: headers
            });
            
            if (response.status === 401) {
                window.location.href = '../html/login.html';
                throw new Error('Sesión expirada o no autorizada');
            }
            
            if (response.status === 429) {
                showAlert(`Has alcanzado el límite de eliminación de datos. Por favor, espera un momento.`, 'warning');
                throw new Error('Límite de eliminación de datos alcanzado');
            }
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Error en DELETE ${endpoint}:`, error);
            showAlert(`Error al eliminar: ${error.message}`, 'danger');
            throw error;
        }
    },
    
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
        delete: (id) => api.delete(`inscriptions/${id}`)
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
    },
    
    auth: {
        login: (credentials) => api.post('auth/login', credentials),
        register: (userData) => api.post('auth/register', userData)
    }
};

/**
 * @param {string} message 
 * @param {string} type 
 */
function showAlert(message, type = 'success') {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
    } else {
        document.body.appendChild(alertDiv);
    }
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

/**
 * @param {boolean} show 
 */
function toggleLoader(show = true) {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    loader.style.display = show ? 'block' : 'none';
}

/**
 * @param {string} dateString 
 * @returns {string} 
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

/**
 * @param {string} email 
 * @returns {boolean} 
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * @param {string} message 
 * @returns {boolean} 
 */
function confirmAction(message = '¿Está seguro de realizar esta acción?') {
    return confirm(message);
}