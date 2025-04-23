// Variables globales
let students = [];
let currentStudentId = null;
let isEditing = false;

// Referencias a elementos del DOM
const studentForm = document.getElementById('studentFormElement');
const formTitle = document.getElementById('formTitle');
const addStudentBtn = document.getElementById('addStudentBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentsTableBody = document.getElementById('studentsTableBody');
const noStudents = document.getElementById('noStudents');
const studentLoader = document.getElementById('studentLoader');
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.querySelector('.close-modal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Función para cargar la lista de estudiantes
async function loadStudents() {
    try {
        toggleLoader(true);
        students = await api.students.getAll();
        renderStudentsTable();
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para renderizar la tabla de estudiantes
function renderStudentsTable() {
    studentsTableBody.innerHTML = '';
    
    if (students.length === 0) {
        noStudents.style.display = 'block';
        return;
    }
    
    noStudents.style.display = 'none';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        
        // Crear celdas para cada dato del estudiante
        const idCell = document.createElement('td');
        idCell.textContent = student.idStudent;
        
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        
        const lastnameCell = document.createElement('td');
        lastnameCell.textContent = student.lastname;
        
        const addressCell = document.createElement('td');
        addressCell.textContent = student.address || '-';
        
        const phoneCell = document.createElement('td');
        phoneCell.textContent = student.phone || '-';
        
        const emailCell = document.createElement('td');
        emailCell.textContent = student.email || '-';
        
        // Crear celda para botones de acción
        const actionCell = document.createElement('td');
        actionCell.className = 'action-buttons';
        
        // Crear botón de editar
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm edit-student';
        editButton.dataset.id = student.idStudent;
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editButton.appendChild(editIcon);
        
        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-student';
        deleteButton.dataset.id = student.idStudent;
        
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
        row.appendChild(addressCell);
        row.appendChild(phoneCell);
        row.appendChild(emailCell);
        row.appendChild(actionCell);
        
        // Agregar la fila a la tabla
        studentsTableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones de editar y eliminar
    document.querySelectorAll('.edit-student').forEach(button => {
        button.addEventListener('click', handleEditStudent);
    });
    
    document.querySelectorAll('.delete-student').forEach(button => {
        button.addEventListener('click', handleDeleteStudent);
    });
}

// Función para manejar la creación de un nuevo estudiante
function handleAddStudent() {
    resetForm();
    isEditing = false;
    formTitle.textContent = 'Agregar Nuevo Estudiante';
    scrollToForm();
}

// Función para manejar la edición de un estudiante
async function handleEditStudent(event) {
    const studentId = parseInt(event.currentTarget.dataset.id);
    currentStudentId = studentId;
    isEditing = true;
    
    try {
        toggleLoader(true);
        const student = await api.students.getById(studentId);
        
        // Llenar el formulario con los datos del estudiante
        document.getElementById('idStudent').value = student.idStudent;
        document.getElementById('name').value = student.name;
        document.getElementById('lastname').value = student.lastname;
        document.getElementById('address').value = student.address || '';
        document.getElementById('phone').value = student.phone || '';
        document.getElementById('email').value = student.email || '';
        
        formTitle.textContent = 'Editar Estudiante';
        scrollToForm();
    } catch (error) {
        console.error('Error al cargar estudiante para editar:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para manejar la eliminación de un estudiante
function handleDeleteStudent(event) {
    const studentId = parseInt(event.currentTarget.dataset.id);
    currentStudentId = studentId;
    
    // Mostrar el modal de confirmación
    deleteModal.style.display = 'block';
}

// Función para verificar si ya existe un estudiante con el mismo email
async function checkStudentEmailExists(email, excludeId = null) {
    try {
        const allStudents = await api.students.getAll();
        return allStudents.some(student => 
            student.email === email && 
            (excludeId === null || student.idStudent !== excludeId)
        );
    } catch (error) {
        console.error('Error al verificar email:', error);
        return false;
    }
}

// Función para guardar un estudiante (crear o actualizar)
async function saveStudent(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const formData = new FormData(studentForm);
    const studentData = {
        name: formData.get('name'),
        lastname: formData.get('lastname'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        email: formData.get('email')
    };
    
    // Validar el formulario
    if (!studentData.name || !studentData.lastname) {
        showAlert('Por favor complete los campos obligatorios.', 'warning');
        return;
    }
    
    // Validar el email si se proporciona
    if (studentData.email) {
        if (!isValidEmail(studentData.email)) {
            showAlert('Por favor ingrese un correo electrónico válido.', 'warning');
            return;
        }
        
        // Verificar si ya existe un estudiante con ese email
        const emailExists = await checkStudentEmailExists(
            studentData.email, 
            isEditing ? currentStudentId : null
        );
        
        if (emailExists) {
            showAlert('Ya existe un estudiante con ese correo electrónico.', 'warning');
            return;
        }
    }
    
    try {
        toggleLoader(true);
        let result;
        
        if (isEditing) {
            // Actualizar estudiante existente
            result = await api.students.update(currentStudentId, studentData);
            showAlert('Estudiante actualizado con éxito.', 'success');
        } else {
            // Crear nuevo estudiante
            result = await api.students.create(studentData);
            showAlert('Estudiante creado con éxito.', 'success');
        }
        
        // Recargar la lista de estudiantes y limpiar el formulario
        await loadStudents();
        resetForm();
    } catch (error) {
        console.error('Error al guardar estudiante:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para eliminar un estudiante
async function deleteStudent() {
    try {
        toggleLoader(true);
        await api.students.delete(currentStudentId);
        
        // Cerrar el modal y recargar la lista
        deleteModal.style.display = 'none';
        showAlert('Estudiante eliminado con éxito.', 'success');
        await loadStudents();
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para resetear el formulario
function resetForm() {
    studentForm.reset();
    document.getElementById('idStudent').value = '';
    currentStudentId = null;
    isEditing = false;
    formTitle.textContent = 'Agregar Nuevo Estudiante';
}

// Función para hacer scroll al formulario
function scrollToForm() {
    document.getElementById('studentForm').scrollIntoView({ behavior: 'smooth' });
}

// Función para alternar el estado del loader
function toggleLoader(show) {
    if (studentLoader) {
        studentLoader.style.display = show ? 'block' : 'none';
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
    // Cargar la lista de estudiantes al cargar la página
    loadStudents();
    
    // Evento para el formulario
    studentForm.addEventListener('submit', saveStudent);
    
    // Evento para el botón de agregar
    addStudentBtn.addEventListener('click', handleAddStudent);
    
    // Evento para el botón de cancelar
    cancelBtn.addEventListener('click', resetForm);
    
    // Eventos para el modal de eliminación
    confirmDeleteBtn.addEventListener('click', deleteStudent);
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