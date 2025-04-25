// Authentication service

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';
// No declaramos API_BASE_URL aquí, ya que está definida en api.js

// Authentication service object
const authService = {
    /**
     * Logs in a user
     * @param {string} username - The username
     * @param {string} password - The password
     * @returns {Promise} - Promise with the login response
     */
    login: async function(username, password) {
        try {
            console.log('Intentando login a:', `${API_BASE_URL}/auth/login`);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            console.log('Respuesta de login:', response.status, response.statusText);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Credenciales incorrectas');
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            }
            
            // Intentar parsear la respuesta JSON con manejo de errores
            let data;
            try {
                const text = await response.text();
                console.log('Respuesta texto:', text);
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                throw new Error('Error al procesar la respuesta del servidor');
            }
            
            // Store the token and user info
            if (data.token) {
                this.setToken(data.token);
                this.setUser({ username });
                console.log('Token guardado correctamente');
            } else {
                console.error('No se recibió token en la respuesta');
                throw new Error('No se recibió un token válido');
            }
            
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },
    
    /**
     * Registers a new user
     * @param {Object} userData - User data for registration
     * @returns {Promise} - Promise with the registration response
     */
    register: async function(userData) {
        try {
            console.log('Intentando registro a:', `${API_BASE_URL}/auth/register`);
            
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            console.log('Respuesta de registro:', response.status, response.statusText);
            
            if (!response.ok) {
                // Intentar obtener mensaje de error del servidor
                let errorMsg = 'Error al registrar usuario';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) {
                    // Si no podemos parsear JSON, usamos el mensaje genérico
                }
                throw new Error(errorMsg);
            }
            
            // Intentar parsear la respuesta JSON con manejo de errores
            let data;
            try {
                const text = await response.text();
                console.log('Respuesta texto:', text);
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                // Si no hay JSON, consideramos que fue exitoso pero sin datos
                data = { message: 'Usuario registrado exitosamente' };
            }
            
            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },
    
    /**
     * Logs out the current user
     */
    logout: function() {
        // Remove auth data from local storage
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        
        // Redirect to login page
        window.location.href = '/Front-End/html/login.html';
    },
    
    /**
     * Sets the authentication token
     * @param {string} token - JWT token
     */
    setToken: function(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    
    /**
     * Gets the stored authentication token
     * @returns {string|null} - The stored token or null
     */
    getToken: function() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },
    
    /**
     * Sets the current user information
     * @param {Object} user - User information
     */
    setUser: function(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    
    /**
     * Gets the current user information
     * @returns {Object|null} - User information or null
     */
    getUser: function() {
        const userString = localStorage.getItem(USER_KEY);
        return userString ? JSON.parse(userString) : null;
    },
    
    /**
     * Checks if user is authenticated
     * @returns {boolean} - True if authenticated
     */
    isAuthenticated: function() {
        return this.getToken() !== null;
    },
    
    /**
     * Extracts information from JWT token
     * @param {string} token - JWT token
     * @returns {Object} - Decoded token payload
     */
    parseJwt: function(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error parsing JWT:', e);
            return null;
        }
    }
};

// Function to check authentication status and redirect if necessary
function checkAuth() {
    // Identificar páginas públicas por sus nombres de archivo
    const publicPages = ['login.html', 'register.html'];
    const currentPath = window.location.pathname.split('/').pop();
    
    const requiresAuth = !publicPages.includes(currentPath);
    const isAuthenticated = authService.isAuthenticated();
    
    console.log('Ruta actual:', currentPath);
    console.log('Requiere autenticación:', requiresAuth);
    console.log('Está autenticado:', isAuthenticated);
    
    if (requiresAuth && !isAuthenticated) {
        // Redirect to login page if not authenticated
        console.log('Redirigiendo a login (no autenticado)');
        window.location.href = '/Front-End/html/login.html';
    } else if (isAuthenticated && publicPages.includes(currentPath)) {
        // Redirect to index if already authenticated
        console.log('Redirigiendo a index (ya autenticado)');
        window.location.href = '/Front-End/html/index.html';
    }
}

// Handler for login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Intentando login con usuario:', username);
    
    authService.login(username, password)
        .then(() => {
            showAlert('Inicio de sesión exitoso', 'success');
            setTimeout(() => {
                window.location.href = '/Front-End/html/index.html';
            }, 1000);
        })
        .catch(error => {
            showAlert(`Error: ${error.message}`, 'danger');
        });
}

// Handler for registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate password match
    if (password !== confirmPassword) {
        showAlert('Las contraseñas no coinciden', 'warning');
        return;
    }
    
    // Create registration data
    const userData = {
        username,
        email,
        password,
        role: 'USER' // Default role
    };
    
    console.log('Intentando registrar usuario:', username);
    
    authService.register(userData)
        .then(() => {
            showAlert('Registro exitoso, ahora puedes iniciar sesión', 'success');
            setTimeout(() => {
                window.location.href = '/Front-End/html/login.html';
            }, 1500);
        })
        .catch(error => {
            showAlert(`Error: ${error.message}`, 'danger');
        });
}

// Function to show alerts
function showAlert(message, type) {
    // Create element of alert
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    alertElement.style.position = 'fixed';
    alertElement.style.top = '20px';
    alertElement.style.right = '20px';
    alertElement.style.zIndex = '9999';
    alertElement.style.padding = '15px';
    alertElement.style.borderRadius = '5px';
    alertElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    // Set color according to type
    switch (type) {
        case 'success':
            alertElement.style.backgroundColor = '#d4edda';
            alertElement.style.color = '#155724';
            alertElement.style.border = '1px solid #c3e6cb';
            break;
        case 'warning':
            alertElement.style.backgroundColor = '#fff3cd';
            alertElement.style.color = '#856404';
            alertElement.style.border = '1px solid #ffeeba';
            break;
        case 'danger':
            alertElement.style.backgroundColor = '#f8d7da';
            alertElement.style.color = '#721c24';
            alertElement.style.border = '1px solid #f5c6cb';
            break;
        default:
            alertElement.style.backgroundColor = '#cce5ff';
            alertElement.style.color = '#004085';
            alertElement.style.border = '1px solid #b8daff';
    }
    
    // Add to document body
    document.body.appendChild(alertElement);
    
    // Animate entry
    alertElement.style.transition = 'opacity 0.5s, transform 0.5s';
    alertElement.style.opacity = '0';
    alertElement.style.transform = 'translateY(-20px)';
    
    // Force reflow for transition to work
    alertElement.offsetHeight;
    
    // Show alert
    alertElement.style.opacity = '1';
    alertElement.style.transform = 'translateY(0)';
    
    // Remove after 3 seconds
    setTimeout(() => {
        alertElement.style.opacity = '0';
        alertElement.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            document.body.removeChild(alertElement);
        }, 500);
    }, 3000);
}

// Add logout functionality to the page
function addLogoutButton() {
    if (authService.isAuthenticated()) {
        // Get the nav menu
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu) {
            // Create logout button
            const logoutLi = document.createElement('li');
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                authService.logout();
            });
            
            logoutLi.appendChild(logoutLink);
            navMenu.appendChild(logoutLi);
            
            // Add username display
            const user = authService.getUser();
            if (user && user.username) {
                const userLi = document.createElement('li');
                userLi.innerHTML = `<span style="color: white; margin-right: 15px;"><i class="fas fa-user"></i> ${user.username}</span>`;
                navMenu.appendChild(userLi);
            }
        }
    }
}

// Event listeners and init
document.addEventListener('DOMContentLoaded', function() {
    console.log('Documento cargado, verificando autenticación...');
    
    // Check if user is authenticated
    checkAuth();
    
    // Initialize login form if present
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Formulario de login encontrado, añadiendo event listener');
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Initialize register form if present
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Formulario de registro encontrado, añadiendo event listener');
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Add logout button if on authenticated pages
    addLogoutButton();
});