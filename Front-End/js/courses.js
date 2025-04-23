// Variables globales
let courses = [];
let professors = [];
let currentCourseId = null;
let isEditing = false;

// Referencias a elementos del DOM
const courseForm = document.getElementById('courseFormElement');
const formTitle = document.getElementById('formTitle');
const addCourseBtn = document.getElementById('addCourseBtn');
const cancelBtn = document.getElementById('cancelBtn');
const coursesTableBody = document.getElementById('coursesTableBody');
const noCourses = document.getElementById('noCourses');
const courseLoader = document.getElementById('courseLoader');
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.querySelector('.close-modal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const professorSelect = document.getElementById('idProfessor');

// Función para cargar la lista de cursos
async function loadCourses() {
    try {
        toggleLoader(true);
        courses = await api.courses.getAll();
        renderCoursesTable();
    } catch (error) {
        console.error('Error al cargar cursos:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para cargar la lista de profesores
async function loadProfessors() {
    try {
        professors = await api.professors.getAll();
        populateProfessorSelect();
    } catch (error) {
        console.error('Error al cargar profesores:', error);
        showAlert('Error al cargar la lista de profesores.', 'danger');
    }
}

// Función para llenar el select de profesores
function populateProfessorSelect() {
    // Limpiar opciones actuales excepto la primera
    while (professorSelect.options.length > 1) {
        professorSelect.remove(1);
    }
    
    // Agregar opciones de profesores
    professors.forEach(professor => {
        const option = document.createElement('option');
        option.value = professor.idProfessor;
        option.textContent = `${professor.name} ${professor.lastname}`;
        professorSelect.appendChild(option);
    });
}

// Función para renderizar la tabla de cursos
function renderCoursesTable() {
    coursesTableBody.innerHTML = '';
    
    if (courses.length === 0) {
        noCourses.style.display = 'block';
        return;
    }
    
    noCourses.style.display = 'none';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        
        // Obtener el nombre del profesor
        let professorName = 'No asignado';
        if (course.professor) {
            professorName = `${course.professor.name} ${course.professor.lastname}`;
        } else if (course.idProfessor) {
            const professor = professors.find(p => p.idProfessor === course.idProfessor);
            if (professor) {
                professorName = `${professor.name} ${professor.lastname}`;
            }
        }
        
        // Crear celdas para cada dato del curso
        const idCell = document.createElement('td');
        idCell.textContent = course.idCourse;
        
        const nameCell = document.createElement('td');
        nameCell.textContent = course.name;
        
        const creditsCell = document.createElement('td');
        creditsCell.textContent = course.credits || '-';
        
        const professorCell = document.createElement('td');
        professorCell.textContent = professorName;
        
        // Crear celda para botones de acción
        const actionCell = document.createElement('td');
        actionCell.className = 'action-buttons';
        
        // Crear botón de editar
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm edit-course';
        editButton.dataset.id = course.idCourse;
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editButton.appendChild(editIcon);
        
        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-course';
        deleteButton.dataset.id = course.idCourse;
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteButton.appendChild(deleteIcon);
        
        // Agregar botones a la celda de acciones
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        
        // Agregar todas las celdas a la fila
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(creditsCell);
        row.appendChild(professorCell);
        row.appendChild(actionCell);
        
        // Agregar la fila a la tabla
        coursesTableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones de editar y eliminar
    document.querySelectorAll('.edit-course').forEach(button => {
        button.addEventListener('click', handleEditCourse);
    });
    
    document.querySelectorAll('.delete-course').forEach(button => {
        button.addEventListener('click', handleDeleteCourse);
    });
}

// Función para manejar la creación de un nuevo curso
function handleAddCourse() {
    resetForm();
    isEditing = false;
    formTitle.textContent = 'Agregar Nuevo Curso';
    scrollToForm();
}

// Función para manejar la edición de un curso
async function handleEditCourse(event) {
    const courseId = parseInt(event.currentTarget.dataset.id);
    currentCourseId = courseId;
    isEditing = true;
    
    try {
        toggleLoader(true);
        const course = await api.courses.getById(courseId);
        
        // Llenar el formulario con los datos del curso
        document.getElementById('idCourse').value = course.idCourse;
        document.getElementById('name').value = course.name;
        document.getElementById('credits').value = course.credits || '';
        document.getElementById('idProfessor').value = course.idProfessor || '';
        
        formTitle.textContent = 'Editar Curso';
        scrollToForm();
    } catch (error) {
        console.error('Error al cargar curso para editar:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para manejar la eliminación de un curso
function handleDeleteCourse(event) {
    const courseId = parseInt(event.currentTarget.dataset.id);
    currentCourseId = courseId;
    
    // Mostrar el modal de confirmación
    deleteModal.style.display = 'block';
}

// Función para verificar si ya existe un curso con el mismo nombre
async function checkCourseNameExists(name, excludeId = null) {
    try {
        const allCourses = await api.courses.getAll();
        return allCourses.some(course => 
            course.name.toLowerCase() === name.toLowerCase() && 
            (excludeId === null || course.idCourse !== excludeId)
        );
    } catch (error) {
        console.error('Error al verificar nombre del curso:', error);
        return false;
    }
}

// Función para guardar un curso (crear o actualizar)
async function saveCourse(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const formData = new FormData(courseForm);
    const courseData = {
        name: formData.get('name'),
        credits: formData.get('credits') ? parseInt(formData.get('credits')) : null,
        idProfessor: formData.get('idProfessor') ? parseInt(formData.get('idProfessor')) : null
    };
    
    // Validar el formulario
    if (!courseData.name) {
        showAlert('Por favor ingrese el nombre del curso.', 'warning');
        return;
    }
    
    if (!courseData.idProfessor) {
        showAlert('Por favor seleccione un profesor para el curso.', 'warning');
        return;
    }
    
    // Verificar si ya existe un curso con ese nombre
    const nameExists = await checkCourseNameExists(
        courseData.name, 
        isEditing ? currentCourseId : null
    );
    
    if (nameExists) {
        showAlert('Ya existe un curso con ese nombre.', 'warning');
        return;
    }
    
    try {
        toggleLoader(true);
        let result;
        
        if (isEditing) {
            // Actualizar curso existente
            result = await api.courses.update(currentCourseId, courseData);
            showAlert('Curso actualizado con éxito.', 'success');
        } else {
            // Crear nuevo curso
            result = await api.courses.create(courseData);
            showAlert('Curso creado con éxito.', 'success');
        }
        
        // Recargar la lista de cursos y limpiar el formulario
        await loadCourses();
        resetForm();
    } catch (error) {
        console.error('Error al guardar curso:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para eliminar un curso
async function deleteCourse() {
    try {
        toggleLoader(true);
        await api.courses.delete(currentCourseId);
        
        // Cerrar el modal y recargar la lista
        deleteModal.style.display = 'none';
        showAlert('Curso eliminado con éxito.', 'success');
        await loadCourses();
    } catch (error) {
        console.error('Error al eliminar curso:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para resetear el formulario
function resetForm() {
    courseForm.reset();
    document.getElementById('idCourse').value = '';
    currentCourseId = null;
    isEditing = false;
    formTitle.textContent = 'Agregar Nuevo Curso';
}

// Función para hacer scroll al formulario
function scrollToForm() {
    document.getElementById('courseForm').scrollIntoView({ behavior: 'smooth' });
}

// Función para alternar el estado del loader
function toggleLoader(show) {
    if (courseLoader) {
        courseLoader.style.display = show ? 'block' : 'none';
    }
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
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar profesores primero, luego cursos
    await loadProfessors();
    await loadCourses();
    
    // Evento para el formulario
    courseForm.addEventListener('submit', saveCourse);
    
    // Evento para el botón de agregar
    addCourseBtn.addEventListener('click', handleAddCourse);
    
    // Evento para el botón de cancelar
    cancelBtn.addEventListener('click', resetForm);
    
    // Eventos para el modal de eliminación
    confirmDeleteBtn.addEventListener('click', deleteCourse);
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