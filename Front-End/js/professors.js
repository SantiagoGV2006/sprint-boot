// Variables globales
let professors = [];
let currentProfessorId = null;
let isEditing = false;

// Referencias a elementos del DOM
const professorForm = document.getElementById('professorFormElement');
const formTitle = document.getElementById('formTitle');
const addProfessorBtn = document.getElementById('addProfessorBtn');
const cancelBtn = document.getElementById('cancelBtn');
const professorsTableBody = document.getElementById('professorsTableBody');
const noProfessors = document.getElementById('noProfessors');
const professorLoader = document.getElementById('professorLoader');
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.querySelector('.close-modal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Función para cargar la lista de profesores
async function loadProfessors() {
    try {
        toggleLoader(true);
        professors = await api.professors.getAll();
        renderProfessorsTable();
    } catch (error) {
        console.error('Error al cargar profesores:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para renderizar la tabla de profesores
function renderProfessorsTable() {
    professorsTableBody.innerHTML = '';
    
    if (professors.length === 0) {
        noProfessors.style.display = 'block';
        return;
    }
    
    noProfessors.style.display = 'none';
    
    professors.forEach(professor => {
        const row = document.createElement('tr');
        
        // Crear celdas para cada dato del profesor
        const idCell = document.createElement('td');
        idCell.textContent = professor.idProfessor;
        
        const nameCell = document.createElement('td');
        nameCell.textContent = professor.name;
        
        const lastnameCell = document.createElement('td');
        lastnameCell.textContent = professor.lastname;
        
        const specialityCell = document.createElement('td');
        specialityCell.textContent = professor.speciality || '-';
        
        const phoneCell = document.createElement('td');
        phoneCell.textContent = professor.phone || '-';
        
        const emailCell = document.createElement('td');
        emailCell.textContent = professor.email || '-';
        
        // Crear celda para botones de acción
        const actionCell = document.createElement('td');
        actionCell.className = 'action-buttons';
        
        // Crear botón de editar
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm edit-professor';
        editButton.dataset.id = professor.idProfessor;
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editButton.appendChild(editIcon);
        
        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-professor';
        deleteButton.dataset.id = professor.idProfessor;
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteButton.appendChild(deleteIcon);
        
        // Agregar botones a la celda de acciones
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        
        // Agregar todas las celdas a la fila
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(lastnameCell);
        row.appendChild(specialityCell);
        row.appendChild(phoneCell);
        row.appendChild(emailCell);
        row.appendChild(actionCell);
        
        // Agregar la fila a la tabla
        professorsTableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones de editar y eliminar
    document.querySelectorAll('.edit-professor').forEach(button => {
        button.addEventListener('click', handleEditProfessor);
    });
    
    document.querySelectorAll('.delete-professor').forEach(button => {
        button.addEventListener('click', handleDeleteProfessor);
    });
}

// Función para manejar la creación de un nuevo profesor
function handleAddProfessor() {
    resetForm();
    isEditing = false;
    formTitle.textContent = 'Agregar Nuevo Profesor';
    scrollToForm();
}

// Función para manejar la edición de un profesor
async function handleEditProfessor(event) {
    const professorId = parseInt(event.currentTarget.dataset.id);
    currentProfessorId = professorId;
    isEditing = true;
    
    try {
        toggleLoader(true);
        const professor = await api.professors.getById(professorId);
        
        // Llenar el formulario con los datos del profesor
        document.getElementById('idProfessor').value = professor.idProfessor;
        document.getElementById('name').value = professor.name;
        document.getElementById('lastname').value = professor.lastname;
        document.getElementById('speciality').value = professor.speciality || '';
        document.getElementById('phone').value = professor.phone || '';
        document.getElementById('email').value = professor.email || '';
        
        formTitle.textContent = 'Editar Profesor';
        scrollToForm();
    } catch (error) {
        console.error('Error al cargar profesor para editar:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para manejar la eliminación de un profesor
function handleDeleteProfessor(event) {
    const professorId = parseInt(event.currentTarget.dataset.id);
    currentProfessorId = professorId;
    
    // Mostrar el modal de confirmación
    deleteModal.style.display = 'block';
}

// Función para verificar si ya existe un profesor con el mismo email
async function checkProfessorEmailExists(email, excludeId = null) {
    try {
        const allProfessors = await api.professors.getAll();
        return allProfessors.some(professor => 
            professor.email === email && 
            (excludeId === null || professor.idProfessor !== excludeId)
        );
    } catch (error) {
        console.error('Error al verificar email:', error);
        return false;
    }
}

// Función para guardar un profesor (crear o actualizar)
async function saveProfessor(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const formData = new FormData(professorForm);
    const professorData = {
        name: formData.get('name'),
        lastname: formData.get('lastname'),
        speciality: formData.get('speciality'),
        phone: formData.get('phone'),
        email: formData.get('email')
    };
    
    // Validar el formulario
    if (!professorData.name || !professorData.lastname) {
        showAlert('Por favor complete los campos obligatorios.', 'warning');
        return;
    }
    
    // Validar el email si se proporciona
    if (professorData.email) {
        if (!isValidEmail(professorData.email)) {
            showAlert('Por favor ingrese un correo electrónico válido.', 'warning');
            return;
        }
        
        // Verificar si ya existe un profesor con ese email
        const emailExists = await checkProfessorEmailExists(
            professorData.email, 
            isEditing ? currentProfessorId : null
        );
        
        if (emailExists) {
            showAlert('Ya existe un profesor con ese correo electrónico.', 'warning');
            return;
        }
    }
    
    try {
        toggleLoader(true);
        let result;
        
        if (isEditing) {
            // Actualizar profesor existente
            result = await api.professors.update(currentProfessorId, professorData);
            showAlert('Profesor actualizado con éxito.', 'success');
        } else {
            // Crear nuevo profesor
            result = await api.professors.create(professorData);
            showAlert('Profesor creado con éxito.', 'success');
        }
        
        // Recargar la lista de profesores y limpiar el formulario
        await loadProfessors();
        resetForm();
    } catch (error) {
        console.error('Error al guardar profesor:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para eliminar un profesor
async function deleteProfessor() {
    try {
        toggleLoader(true);
        await api.professors.delete(currentProfessorId);
        
        // Cerrar el modal y recargar la lista
        deleteModal.style.display = 'none';
        showAlert('Profesor eliminado con éxito.', 'success');
        await loadProfessors();
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para resetear el formulario
function resetForm() {
    professorForm.reset();
    document.getElementById('idProfessor').value = '';
    currentProfessorId = null;
    isEditing = false;
    formTitle.textContent = 'Agregar Nuevo Profesor';
}

// Función para hacer scroll al formulario
function scrollToForm() {
    document.getElementById('professorForm').scrollIntoView({ behavior: 'smooth' });
}

// Función para alternar el estado del loader
function toggleLoader(show) {
    if (professorLoader) {
        professorLoader.style.display = show ? 'block' : 'none';
    }
}

// Función para validar el formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar alertas
function showAlert(message, type) {
    // Crear elemento de alerta
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
    
    // Establecer color según el tipo
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
    
    // Añadir al cuerpo del documento
    document.body.appendChild(alertElement);
    
    // Animar entrada
    alertElement.style.transition = 'opacity 0.5s, transform 0.5s';
    alertElement.style.opacity = '0';
    alertElement.style.transform = 'translateY(-20px)';
    
    // Forzar el reflow para que la transición funcione
    alertElement.offsetHeight;
    
    // Mostrar alerta
    alertElement.style.opacity = '1';
    alertElement.style.transform = 'translateY(0)';
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        alertElement.style.opacity = '0';
        alertElement.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            document.body.removeChild(alertElement);
        }, 500);
    }, 3000);
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    // Cargar la lista de profesores al cargar la página
    loadProfessors();
    
    // Evento para el formulario
    professorForm.addEventListener('submit', saveProfessor);
    
    // Evento para el botón de agregar
    addProfessorBtn.addEventListener('click', handleAddProfessor);
    
    // Evento para el botón de cancelar
    cancelBtn.addEventListener('click', resetForm);
    
    // Eventos para el modal de eliminación
    confirmDeleteBtn.addEventListener('click', deleteProfessor);
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
    closeModal.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
});