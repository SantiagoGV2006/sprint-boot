// Variables globales
let inscriptions = [];
let students = [];
let courses = [];
let selectedCourses = [];
let currentInscriptionId = null;
let isEditing = false;

// Referencias a elementos del DOM
const inscriptionForm = document.getElementById('inscriptionFormElement');
const formTitle = document.getElementById('formTitle');
const addInscriptionBtn = document.getElementById('addInscriptionBtn');
const cancelBtn = document.getElementById('cancelBtn');
const inscriptionsTableBody = document.getElementById('inscriptionsTableBody');
const noInscriptions = document.getElementById('noInscriptions');
const inscriptionLoader = document.getElementById('inscriptionLoader');
const studentSelect = document.getElementById('idStudent');
const dateInput = document.getElementById('date');
const selectedCoursesContainer = document.getElementById('selected-courses-container');
const addCourseToInscriptionBtn = document.getElementById('addCourseToInscription');

// Modals
const courseModal = document.getElementById('courseModal');
const courseSelect = document.getElementById('course-select');
const addCourseBtn = document.getElementById('addCourseBtn');
const cancelCourseBtn = document.getElementById('cancelCourseBtn');
const closeCourseModal = courseModal.querySelector('.close-modal');

const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteModal = deleteModal.querySelector('.close-modal');

const detailsModal = document.getElementById('detailsModal');
const inscriptionDetails = document.getElementById('inscriptionDetails');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');
const closeDetailsModal = detailsModal.querySelector('.close-modal');

// Función para cargar la lista de inscripciones
async function loadInscriptions() {
    try {
        toggleLoader(true);
        inscriptions = await api.inscriptions.getAll();
        renderInscriptionsTable();
    } catch (error) {
        console.error('Error al cargar inscripciones:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para cargar la lista de estudiantes
async function loadStudents() {
    try {
        students = await api.students.getAll();
        populateStudentSelect();
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        showAlert('Error al cargar la lista de estudiantes.', 'danger');
    }
}

// Función para cargar la lista de cursos
async function loadCourses() {
    try {
        courses = await api.courses.getAll();
        populateCourseSelect();
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        showAlert('Error al cargar la lista de cursos.', 'danger');
    }
}

// Función para llenar el select de estudiantes
function populateStudentSelect() {
    // Limpiar opciones actuales excepto la primera
    while (studentSelect.options.length > 1) {
        studentSelect.remove(1);
    }
    
    // Agregar opciones de estudiantes
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.idStudent;
        option.textContent = `${student.name} ${student.lastname}`;
        studentSelect.appendChild(option);
    });
}

// Función para llenar el select de cursos
function populateCourseSelect() {
    // Limpiar opciones actuales excepto la primera
    while (courseSelect.options.length > 1) {
        courseSelect.remove(1);
    }
    
    // Agregar opciones de cursos
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.idCourse;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
}

// Función para renderizar la tabla de inscripciones
function renderInscriptionsTable() {
    inscriptionsTableBody.innerHTML = '';
    
    if (inscriptions.length === 0) {
        noInscriptions.style.display = 'block';
        return;
    }
    
    noInscriptions.style.display = 'none';
    
    inscriptions.forEach(inscription => {
        const row = document.createElement('tr');
        
        // Obtener el nombre del estudiante
        let studentName = 'No asignado';
        if (inscription.student) {
            studentName = `${inscription.student.name} ${inscription.student.lastname}`;
        } else if (inscription.idStudent) {
            const student = students.find(s => s.idStudent === inscription.idStudent);
            if (student) {
                studentName = `${student.name} ${student.lastname}`;
            }
        }
        
        // Obtener la cantidad de cursos
        const courseCount = inscription.details ? inscription.details.length : 0;
        
        // Crear celdas de datos
        const idCell = document.createElement('td');
        idCell.textContent = inscription.idInscription;
        
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(inscription.date);
        
        const studentCell = document.createElement('td');
        studentCell.textContent = studentName;
        
        const coursesCell = document.createElement('td');
        coursesCell.textContent = `${courseCount} curso(s)`;
        
        // Crear celda para botones de acción
        const actionCell = document.createElement('td');
        actionCell.className = 'action-buttons';
        
        // Crear botón de ver
        const viewButton = document.createElement('button');
        viewButton.className = 'btn btn-primary btn-sm view-inscription';
        viewButton.dataset.id = inscription.idInscription;
        
        const viewIcon = document.createElement('i');
        viewIcon.className = 'fas fa-eye';
        viewButton.appendChild(viewIcon);
        
        // Crear botón de editar
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm edit-inscription';
        editButton.dataset.id = inscription.idInscription;
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editButton.appendChild(editIcon);
        
        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-inscription';
        deleteButton.dataset.id = inscription.idInscription;
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteButton.appendChild(deleteIcon);
        
        // Agregar botones a la celda de acciones
        actionCell.appendChild(viewButton);
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        
        // Agregar todas las celdas a la fila
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(studentCell);
        row.appendChild(coursesCell);
        row.appendChild(actionCell);
        
        // Agregar la fila a la tabla
        inscriptionsTableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones de editar, eliminar y ver
    document.querySelectorAll('.edit-inscription').forEach(button => {
        button.addEventListener('click', handleEditInscription);
    });
    
    document.querySelectorAll('.delete-inscription').forEach(button => {
        button.addEventListener('click', handleDeleteInscription);
    });
    
    document.querySelectorAll('.view-inscription').forEach(button => {
        button.addEventListener('click', handleViewInscription);
    });
}

// Función para ver los detalles de una inscripción
async function handleViewInscription(event) {
    const inscriptionId = parseInt(event.currentTarget.dataset.id);
    
    try {
        toggleLoader(true);
        const inscription = await api.inscriptions.getById(inscriptionId);
        
        // Obtener el nombre del estudiante
        let studentName = 'No asignado';
        if (inscription.student) {
            studentName = `${inscription.student.name} ${inscription.student.lastname}`;
        } else if (inscription.idStudent) {
            const student = students.find(s => s.idStudent === inscription.idStudent);
            if (student) {
                studentName = `${student.name} ${student.lastname}`;
            }
        }
        
        // Limpiar el contenedor de detalles
        inscriptionDetails.innerHTML = '';
        
        // Crear container de detalles
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'inscription-details';
        
        // Crear párrafos de información
        const idInfo = document.createElement('p');
        const idStrong = document.createElement('strong');
        idStrong.textContent = 'ID: ';
        idInfo.appendChild(idStrong);
        idInfo.appendChild(document.createTextNode(inscription.idInscription));
        
        const dateInfo = document.createElement('p');
        const dateStrong = document.createElement('strong');
        dateStrong.textContent = 'Fecha: ';
        dateInfo.appendChild(dateStrong);
        dateInfo.appendChild(document.createTextNode(formatDate(inscription.date)));
        
        const studentInfo = document.createElement('p');
        const studentStrong = document.createElement('strong');
        studentStrong.textContent = 'Estudiante: ';
        studentInfo.appendChild(studentStrong);
        studentInfo.appendChild(document.createTextNode(studentName));
        
        // Agregar la información básica
        detailsContainer.appendChild(idInfo);
        detailsContainer.appendChild(dateInfo);
        detailsContainer.appendChild(studentInfo);
        
        // Crear título para los cursos
        const coursesTitle = document.createElement('h3');
        coursesTitle.textContent = 'Cursos inscritos:';
        detailsContainer.appendChild(coursesTitle);
        
        // Crear lista de cursos
        if (inscription.details && inscription.details.length > 0) {
            const coursesList = document.createElement('ul');
            
            for (const detail of inscription.details) {
                let courseName = 'Curso no disponible';
                if (detail.course) {
                    courseName = detail.course.name;
                } else if (detail.idCourse) {
                    const course = courses.find(c => c.idCourse === detail.idCourse);
                    if (course) {
                        courseName = course.name;
                    }
                }
                
                const courseItem = document.createElement('li');
                courseItem.textContent = courseName;
                coursesList.appendChild(courseItem);
            }
            
            detailsContainer.appendChild(coursesList);
        } else {
            const noCourses = document.createElement('p');
            noCourses.textContent = 'No hay cursos inscritos.';
            detailsContainer.appendChild(noCourses);
        }
        
        // Agregar todo al contenedor principal
        inscriptionDetails.appendChild(detailsContainer);
        
        // Mostrar el modal
        detailsModal.style.display = 'block';
    } catch (error) {
        console.error('Error al cargar detalles de inscripción:', error);
        showAlert('Error al cargar detalles de inscripción.', 'danger');
    } finally {
        toggleLoader(false);
    }
}

// Función para manejar la creación de una nueva inscripción
function handleAddInscription() {
    resetForm();
    isEditing = false;
    formTitle.textContent = 'Agregar Nueva Inscripción';
    scrollToForm();
}

// Función para manejar la edición de una inscripción
async function handleEditInscription(event) {
    const inscriptionId = parseInt(event.currentTarget.dataset.id);
    currentInscriptionId = inscriptionId;
    isEditing = true;
    
    try {
        toggleLoader(true);
        const inscription = await api.inscriptions.getById(inscriptionId);
        
        // Resetear el formulario y los cursos seleccionados
        resetForm();
        
        // Llenar el formulario con los datos de la inscripción
        document.getElementById('idInscription').value = inscription.idInscription;
        document.getElementById('date').value = formatDateForInput(inscription.date);
        document.getElementById('idStudent').value = inscription.idStudent || '';
        
        // Cargar los cursos asociados a esta inscripción
        selectedCourses = [];
        if (inscription.details && inscription.details.length > 0) {
            for (const detail of inscription.details) {
                if (detail.idCourse) {
                    // Buscar información del curso
                    const courseInfo = courses.find(c => c.idCourse === detail.idCourse);
                    if (courseInfo) {
                        selectedCourses.push({
                            idCourse: detail.idCourse,
                            name: courseInfo.name
                        });
                    } else {
                        // Si no se encuentra el curso en la lista cargada, usar información básica
                        selectedCourses.push({
                            idCourse: detail.idCourse,
                            name: detail.course ? detail.course.name : `Curso ID: ${detail.idCourse}`
                        });
                    }
                }
            }
        }
        
        // Renderizar los cursos seleccionados
        renderSelectedCourses();
        
        formTitle.textContent = 'Editar Inscripción';
        scrollToForm();
    } catch (error) {
        console.error('Error al cargar inscripción para editar:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para manejar la eliminación de una inscripción
function handleDeleteInscription(event) {
    const inscriptionId = parseInt(event.currentTarget.dataset.id);
    currentInscriptionId = inscriptionId;
    
    // Mostrar el modal de confirmación
    deleteModal.style.display = 'block';
}

// Función para renderizar los cursos seleccionados
function renderSelectedCourses() {
    selectedCoursesContainer.innerHTML = '';
    
    if (selectedCourses.length === 0) {
        const noCourses = document.createElement('p');
        noCourses.textContent = 'No hay cursos seleccionados.';
        selectedCoursesContainer.appendChild(noCourses);
        return;
    }
    
    const ul = document.createElement('ul');
    ul.className = 'selected-courses-list';
    
    selectedCourses.forEach((course, index) => {
        const li = document.createElement('li');
        
        // Crear el texto del curso
        const courseText = document.createElement('span');
        courseText.textContent = course.name;
        
        // Crear el botón para eliminar el curso
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'btn btn-danger btn-sm remove-course';
        removeButton.dataset.index = index;
        
        const removeIcon = document.createElement('i');
        removeIcon.className = 'fas fa-times';
        removeButton.appendChild(removeIcon);
        
        // Agregar elementos al li
        li.appendChild(courseText);
        li.appendChild(removeButton);
        
        // Agregar li a la lista
        ul.appendChild(li);
    });
    
    selectedCoursesContainer.appendChild(ul);
    
    // Agregar evento para eliminar cursos
    document.querySelectorAll('.remove-course').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = parseInt(event.currentTarget.dataset.index);
            selectedCourses.splice(index, 1);
            renderSelectedCourses();
        });
    });
}

// Función para formatear fecha para input type date
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Función para formatear fecha para mostrar
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Función para verificar si ya existe una inscripción para el mismo estudiante en la misma fecha
async function checkInscriptionExists(studentId, date, excludeId = null) {
    try {
        const allInscriptions = await api.inscriptions.getAll();
        return allInscriptions.some(inscription => 
            inscription.idStudent === studentId && 
            formatDateForInput(inscription.date) === formatDateForInput(date) && 
            (excludeId === null || inscription.idInscription !== excludeId)
        );
    } catch (error) {
        console.error('Error al verificar inscripción:', error);
        return false;
    }
}

// Función para guardar una inscripción (crear o actualizar)
async function saveInscription(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const formData = new FormData(inscriptionForm);
    const inscriptionData = {
        date: formData.get('date'),
        idStudent: parseInt(formData.get('idStudent')),
        details: selectedCourses.map(course => ({
            idCourse: course.idCourse
        }))
    };
    
    // Validar el formulario
    if (!inscriptionData.date) {
        showAlert('Por favor seleccione una fecha.', 'warning');
        return;
    }
    
    if (!inscriptionData.idStudent) {
        showAlert('Por favor seleccione un estudiante.', 'warning');
        return;
    }
    
    if (selectedCourses.length === 0) {
        showAlert('Por favor agregue al menos un curso a la inscripción.', 'warning');
        return;
    }
    
    // Verificar si ya existe una inscripción para el mismo estudiante en la misma fecha
    const inscriptionExists = await checkInscriptionExists(
        inscriptionData.idStudent, 
        inscriptionData.date, 
        isEditing ? currentInscriptionId : null
    );
    
    if (inscriptionExists) {
        showAlert('Ya existe una inscripción para este estudiante en la fecha seleccionada.', 'warning');
        return;
    }
    
    try {
        toggleLoader(true);
        let result;
        
        if (isEditing) {
            // Actualizar inscripción existente
            result = await api.inscriptions.update(currentInscriptionId, inscriptionData);
            showAlert('Inscripción actualizada con éxito.', 'success');
        } else {
            // Crear nueva inscripción
            result = await api.inscriptions.create(inscriptionData);
            showAlert('Inscripción creada con éxito.', 'success');
        }
        
        // Recargar la lista de inscripciones y limpiar el formulario
        await loadInscriptions();
        resetForm();
    } catch (error) {
        console.error('Error al guardar inscripción:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para eliminar una inscripción
async function deleteInscription() {
    try {
        toggleLoader(true);
        await api.inscriptions.delete(currentInscriptionId);
        
        // Cerrar el modal y recargar la lista
        deleteModal.style.display = 'none';
        showAlert('Inscripción eliminada con éxito.', 'success');
        await loadInscriptions();
    } catch (error) {
        console.error('Error al eliminar inscripción:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para resetear el formulario
function resetForm() {
    inscriptionForm.reset();
    document.getElementById('idInscription').value = '';
    
    // Establecer la fecha de hoy por defecto
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];
    
    // Limpiar cursos seleccionados
    selectedCourses = [];
    renderSelectedCourses();
    
    currentInscriptionId = null;
    isEditing = false;
    formTitle.textContent = 'Agregar Nueva Inscripción';
}

// Función para hacer scroll al formulario
function scrollToForm() {
    document.getElementById('inscriptionForm').scrollIntoView({ behavior: 'smooth' });
}

// Función para agregar un curso a la inscripción
function handleAddCourse() {
    const courseId = parseInt(courseSelect.value);
    
    if (!courseId) {
        showAlert('Por favor seleccione un curso.', 'warning');
        return;
    }
    
    // Verificar si el curso ya está seleccionado
    if (selectedCourses.some(course => course.idCourse === courseId)) {
        showAlert('El curso ya está seleccionado.', 'warning');
        return;
    }
    
    // Buscar información del curso
    const course = courses.find(c => c.idCourse === courseId);
    
    if (course) {
        selectedCourses.push({
            idCourse: course.idCourse,
            name: course.name
        });
        
        // Renderizar los cursos seleccionados
        renderSelectedCourses();
        
        // Cerrar el modal
        courseModal.style.display = 'none';
        courseSelect.value = '';
    }
}

// Función para alternar el estado del loader
function toggleLoader(show) {
    if (inscriptionLoader) {
        inscriptionLoader.style.display = show ? 'block' : 'none';
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
    // Establecer la fecha de hoy por defecto
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];
    
    // Cargar datos
    await Promise.all([loadStudents(), loadCourses()]);
    await loadInscriptions();
    
    // Renderizar cursos seleccionados iniciales
    renderSelectedCourses();
    
    // Evento para el formulario
    inscriptionForm.addEventListener('submit', saveInscription);
    
    // Evento para el botón de agregar inscripción
    addInscriptionBtn.addEventListener('click', handleAddInscription);
    
    // Evento para el botón de cancelar
    cancelBtn.addEventListener('click', resetForm);
    
    // Evento para el botón de agregar curso a la inscripción
    addCourseToInscriptionBtn.addEventListener('click', () => {
        courseModal.style.display = 'block';
    });
    
    // Eventos para el modal de cursos
    addCourseBtn.addEventListener('click', handleAddCourse);
    cancelCourseBtn.addEventListener('click', () => {
        courseModal.style.display = 'none';
    });
    closeCourseModal.addEventListener('click', () => {
        courseModal.style.display = 'none';
    });
    
    // Eventos para el modal de eliminación
    confirmDeleteBtn.addEventListener('click', deleteInscription);
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
    closeDeleteModal.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
    
    // Eventos para el modal de detalles
    closeDetailsBtn.addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });
    closeDetailsModal.addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });
    
    // Cerrar modales al hacer clic fuera de ellos
    window.addEventListener('click', (event) => {
        if (event.target === courseModal) {
            courseModal.style.display = 'none';
        }
        if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
        if (event.target === detailsModal) {
            detailsModal.style.display = 'none';
        }
    });
});