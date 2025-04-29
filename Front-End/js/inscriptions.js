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
const closeCourseModal = courseModal ? courseModal.querySelector('.close-modal') : null;

const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteModal = deleteModal ? deleteModal.querySelector('.close-modal') : null;

const detailsModal = document.getElementById('detailsModal');
const inscriptionDetails = document.getElementById('inscriptionDetails');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');
const closeDetailsModal = detailsModal ? detailsModal.querySelector('.close-modal') : null;

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
    // Verificar que el elemento select existe
    if (!studentSelect) {
        console.error('Elemento studentSelect no encontrado');
        return;
    }
    
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
    // Verificar que el elemento select existe
    if (!courseSelect) {
        console.error('Elemento courseSelect no encontrado');
        return;
    }
    
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
    // Verificar que el elemento table body existe
    if (!inscriptionsTableBody) {
        console.error('Elemento inscriptionsTableBody no encontrado');
        return;
    }
    
    inscriptionsTableBody.innerHTML = '';
    
    if (!noInscriptions) {
        console.error('Elemento noInscriptions no encontrado');
    } else {
        if (inscriptions.length === 0) {
            noInscriptions.style.display = 'block';
            return;
        }
        
        noInscriptions.style.display = 'none';
    }
    
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
        
        // Verificar que el elemento inscriptionDetails existe
        if (!inscriptionDetails) {
            console.error('Elemento inscriptionDetails no encontrado');
            toggleLoader(false);
            return;
        }
        
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
        if (detailsModal) {
            detailsModal.style.display = 'block';
        } else {
            console.error('Elemento detailsModal no encontrado');
        }
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
    
    if (formTitle) {
        formTitle.textContent = 'Agregar Nueva Inscripción';
    }
    
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
        const idInscriptionInput = document.getElementById('idInscription');
        if (idInscriptionInput) {
            idInscriptionInput.value = inscription.idInscription;
        }
        
        if (dateInput) {
            dateInput.value = formatDateForInput(inscription.date);
        }
        
        if (studentSelect) {
            studentSelect.value = inscription.idStudent || '';
        }
        
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
        
        if (formTitle) {
            formTitle.textContent = 'Editar Inscripción';
        }
        
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
    if (deleteModal) {
        deleteModal.style.display = 'block';
    } else {
        console.error('Elemento deleteModal no encontrado');
    }
}

// Función para renderizar los cursos seleccionados
function renderSelectedCourses() {
    // Verificar que el elemento container existe
    if (!selectedCoursesContainer) {
        console.error('Elemento selectedCoursesContainer no encontrado');
        return;
    }
    
    selectedCoursesContainer.innerHTML = '';
    
    if (selectedCourses.length === 0) {
        // Solo mostrar alert si no estamos en la inicialización
        if (isEditing || document.getElementById('idInscription')?.value) {
            showAlert('Debe agregar al menos un curso.', 'warning');
        }
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
    
    // Verificar que el formulario existe
    if (!inscriptionForm) {
        console.error('Elemento inscriptionForm no encontrado');
        return;
    }
    
    // Validar que haya al menos un curso seleccionado
    if (selectedCourses.length === 0) {
        showAlert('Debe agregar al menos un curso a la inscripción.', 'warning');
        return;
    }
    
    // Obtener los datos del formulario
    const formData = new FormData(inscriptionForm);
    
    // Construir objeto de inscripción
    const inscriptionData = {
        date: formData.get('date'),
        idStudent: parseInt(formData.get('idStudent')),
        // La propiedad idCourse ahora es opcional en el modelo pero requerida por el API
        // Usamos el id del primer curso como curso principal
        idCourse: selectedCourses[0]?.idCourse || null,
        // Importante: Incluir los detalles de cursos
        details: selectedCourses.map(course => ({
            idCourse: course.idCourse
        }))
    };
    
    // Validar los datos requeridos
    if (!inscriptionData.date) {
        showAlert('Por favor seleccione una fecha.', 'warning');
        return;
    }
    
    if (!inscriptionData.idStudent) {
        showAlert('Por favor seleccione un estudiante.', 'warning');
        return;
    }
    
    if (!inscriptionData.idCourse) {
        showAlert('Debe agregar al menos un curso como curso principal.', 'warning');
        return;
    }
    
    try {
        console.log('Enviando datos de inscripción:', JSON.stringify(inscriptionData, null, 2));
        
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
        showAlert('Error al guardar la inscripción: ' + (error.message || 'Error desconocido'), 'danger');
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
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }
        
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
    if (!inscriptionForm) {
        console.error('Elemento inscriptionForm no encontrado');
        return;
    }
    
    inscriptionForm.reset();
    
    const idInscriptionInput = document.getElementById('idInscription');
    if (idInscriptionInput) {
        idInscriptionInput.value = '';
    }
    
    // Establecer la fecha de hoy por defecto
    if (dateInput) {
        const today = new Date();
        dateInput.value = today.toISOString().split('T')[0];
    }
    
    // Limpiar cursos seleccionados
    selectedCourses = [];
    renderSelectedCourses();
    
    currentInscriptionId = null;
    isEditing = false;
    
    if (formTitle) {
        formTitle.textContent = 'Agregar Nueva Inscripción';
    }
}

// Función para hacer scroll al formulario
function scrollToForm() {
    const formElement = document.getElementById('inscriptionForm');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('Elemento inscriptionForm no encontrado');
    }
}

// Función para agregar un curso a la inscripción
function handleAddCourse() {
    // Verificar que el elemento select existe
    if (!courseSelect) {
        console.error('Elemento courseSelect no encontrado');
        return;
    }
    
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
        if (courseModal) {
            courseModal.style.display = 'none';
        }
        
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

// Manejador principal cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar que los elementos existen antes de usarlos
    if (!inscriptionForm) {
        console.error('Elemento inscriptionFormElement no encontrado. Asegúrate de que el ID es correcto en el HTML.');
    }
    
    if (!studentSelect) {
        console.error('Elemento idStudent no encontrado. Asegúrate de que el ID es correcto en el HTML.');
    }
    
    if (!courseSelect) {
        console.error('Elemento course-select no encontrado. Asegúrate de que el ID es correcto en el HTML.');
    }
    
    // Establecer la fecha de hoy por defecto
    if (dateInput) {
        const today = new Date();
        dateInput.value = today.toISOString().split('T')[0];
    }
    
    try {
        // Cargar datos (con manejo de errores para cada llamada)
        try {
            await loadStudents();
        } catch (err) {
            console.error('Error en loadStudents:', err);
        }
        
        try {
            await loadCourses();
        } catch (err) {
            console.error('Error en loadCourses:', err);
        }
        
        try {
            await loadInscriptions();
        } catch (err) {
            console.error('Error en loadInscriptions:', err);
        }
        
        // Renderizar cursos seleccionados iniciales
        renderSelectedCourses();
        
        // Asignar eventos solo si los elementos existen
        if (inscriptionForm) {
            inscriptionForm.addEventListener('submit', saveInscription);
        }
        
        if (addInscriptionBtn) {
            addInscriptionBtn.addEventListener('click', handleAddInscription);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', resetForm);
        }
        
        if (addCourseToInscriptionBtn) {
            addCourseToInscriptionBtn.addEventListener('click', () => {
                if (courseModal) {
                    courseModal.style.display = 'block';
                }
            });
        }
        
        // Eventos para el modal de cursos
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', handleAddCourse);
        }
        
        if (cancelCourseBtn) {
            cancelCourseBtn.addEventListener('click', () => {
                if (courseModal) {
                    courseModal.style.display = 'none';
                }
            });
        }
        
        if (closeCourseModal) {
            closeCourseModal.addEventListener('click', () => {
                if (courseModal) {
                    courseModal.style.display = 'none';
                }
            });
        }
        
        // Eventos para el modal de eliminación
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', deleteInscription);
        }
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                if (deleteModal) {
                    deleteModal.style.display = 'none';
                }
            });
        }        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => {
                if (deleteModal) {
                    deleteModal.style.display = 'none';
                }
            });
        }
        
        // Eventos para el modal de detalles
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                if (detailsModal) {
                    detailsModal.style.display = 'none';
                }
            });
        }
        
        if (closeDetailsModal) {
            closeDetailsModal.addEventListener('click', () => {
                if (detailsModal) {
                    detailsModal.style.display = 'none';
                }
            });
        }
        
        // Cerrar modales al hacer clic fuera de ellos
        window.addEventListener('click', (event) => {
            if (courseModal && event.target === courseModal) {
                courseModal.style.display = 'none';
            }
            if (deleteModal && event.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
            if (detailsModal && event.target === detailsModal) {
                detailsModal.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        showAlert('Ocurrió un error al inicializar la aplicación. Por favor, recarga la página.', 'danger');
    }
});