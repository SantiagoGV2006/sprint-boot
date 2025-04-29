// Variables globales - renombradas para evitar colisiones
let inscriptionsList = [];  // Renombrado de "inscriptions" a "inscriptionsList"
let courses = [];
let details = [];
let currentInscriptionId = null;
let currentDetailId = null;

// Referencias a elementos del DOM
const inscriptionSelect = document.getElementById('inscription-select');
const inscriptionInfo = document.getElementById('inscription-info');
const detailForm = document.getElementById('detailForm');
const detailFormElement = document.getElementById('detailFormElement');
const courseSelect = document.getElementById('idCourse');
const idInscriptionInput = document.getElementById('idInscription');
const addDetailBtn = document.getElementById('addDetailBtn');
const cancelBtn = document.getElementById('cancelBtn');
const detailsTable = document.getElementById('detailsTable');
const detailsTableBody = document.getElementById('detailsTableBody');
const noDetails = document.getElementById('noDetails');
const detailLoader = document.getElementById('detailLoader');

// Modal de eliminación
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteModal = deleteModal ? deleteModal.querySelector('.close-modal') : null;

// Función para cargar inscripciones
async function loadInscriptions() {
    try {
        toggleLoader(true);
        inscriptionsList = await api.inscriptions.getAll();  // Actualizado a inscriptionsList
        populateInscriptionSelect();
    } catch (error) {
        console.error('Error al cargar inscripciones:', error);
        showAlert('Error al cargar la lista de inscripciones.', 'danger');
    } finally {
        toggleLoader(false);
    }
}

// Función para cargar cursos
async function loadCourses() {
    try {
        courses = await api.courses.getAll();
        populateCourseSelect();
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        showAlert('Error al cargar la lista de cursos.', 'danger');
    }
}

// Función para llenar el select de inscripciones
function populateInscriptionSelect() {
    // Verificar que el elemento select existe
    if (!inscriptionSelect) {
        console.error('Elemento inscriptionSelect no encontrado');
        return;
    }
    
    // Limpiar opciones actuales excepto la primera
    while (inscriptionSelect.options.length > 1) {
        inscriptionSelect.remove(1);
    }
    
    // Agregar opciones de inscripciones
    inscriptionsList.forEach(inscription => {  // Actualizado a inscriptionsList
        const option = document.createElement('option');
        option.value = inscription.idInscription;
        
        // Obtener el nombre del estudiante
        let studentName = 'Estudiante desconocido';
        if (inscription.student) {
            studentName = `${inscription.student.name} ${inscription.student.lastname}`;
        }
        
        option.textContent = `Inscripción #${inscription.idInscription} - ${studentName} (${formatDate(inscription.date)})`;
        inscriptionSelect.appendChild(option);
    });
}

// El resto del código permanece igual, solo asegúrate de reemplazar todas las referencias 
// a "inscriptions" con "inscriptionsList"

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

// Función para cargar detalles de una inscripción
async function loadInscriptionDetails(inscriptionId) {
    try {
        toggleLoader(true);
        details = await api.inscriptionDetails.getByInscriptionId(inscriptionId);
        renderDetailsTable();
    } catch (error) {
        console.error('Error al cargar detalles de inscripción:', error);
        showAlert('Error al cargar los detalles de la inscripción.', 'danger');
    } finally {
        toggleLoader(false);
    }
}

// Función para mostrar información de la inscripción seleccionada
async function showInscriptionInfo(inscriptionId) {
    try {
        const inscription = await api.inscriptions.getById(inscriptionId);
        
        // Obtener el nombre del estudiante
        let studentName = 'Estudiante desconocido';
        if (inscription.student) {
            studentName = `${inscription.student.name} ${inscription.student.lastname}`;
        }
        
        // Limpiar contenido anterior
        inscriptionInfo.innerHTML = '';
        
        // Crear elementos para la información de la inscripción
        const card = document.createElement('div');
        card.className = 'card';
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        const title = document.createElement('h3');
        title.textContent = 'Información de la Inscripción';
        
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
        
        // Construir la estructura del DOM
        cardContent.appendChild(title);
        cardContent.appendChild(idInfo);
        cardContent.appendChild(dateInfo);
        cardContent.appendChild(studentInfo);
        card.appendChild(cardContent);
        inscriptionInfo.appendChild(card);
        
        inscriptionInfo.style.display = 'block';
        detailsTable.style.display = 'block';
        
        // Cargar los detalles de la inscripción
        await loadInscriptionDetails(inscriptionId);
    } catch (error) {
        console.error('Error al cargar información de inscripción:', error);
        showAlert('Error al cargar la información de la inscripción.', 'danger');
    }
}

// Función para renderizar la tabla de detalles
function renderDetailsTable() {
    detailsTableBody.innerHTML = '';
    
    if (details.length === 0) {
        noDetails.style.display = 'block';
        return;
    }
    
    noDetails.style.display = 'none';
    
    details.forEach(detail => {
        const row = document.createElement('tr');
        
        // Buscar información del curso
        let courseName = 'Curso no disponible';
        let credits = '-';
        let professorName = '-';
        
        if (detail.course) {
            courseName = detail.course.name;
            credits = detail.course.credits || '-';
            
            if (detail.course.professor) {
                professorName = `${detail.course.professor.name} ${detail.course.professor.lastname}`;
            }
        } else if (detail.idCourse) {
            const course = courses.find(c => c.idCourse === detail.idCourse);
            if (course) {
                courseName = course.name;
                credits = course.credits || '-';
                
                if (course.professor) {
                    professorName = `${course.professor.name} ${course.professor.lastname}`;
                }
            }
        }
        
        // Crear celdas para cada dato
        const idCell = document.createElement('td');
        idCell.textContent = detail.id;
        
        const courseCell = document.createElement('td');
        courseCell.textContent = courseName;
        
        const creditsCell = document.createElement('td');
        creditsCell.textContent = credits;
        
        const professorCell = document.createElement('td');
        professorCell.textContent = professorName;
        
        // Crear celda para botones de acción
        const actionCell = document.createElement('td');
        actionCell.className = 'action-buttons';
        
        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-detail';
        deleteButton.dataset.id = detail.id;
        deleteButton.dataset.course = detail.idCourse;
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteButton.appendChild(deleteIcon);
        
        // Agregar botón a la celda de acciones
        actionCell.appendChild(deleteButton);
        
        // Agregar todas las celdas a la fila
        row.appendChild(idCell);
        row.appendChild(courseCell);
        row.appendChild(creditsCell);
        row.appendChild(professorCell);
        row.appendChild(actionCell);
        
        // Agregar la fila a la tabla
        detailsTableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones de eliminar
    document.querySelectorAll('.delete-detail').forEach(button => {
        button.addEventListener('click', handleDeleteDetail);
    });
}

// Función para manejar la selección de una inscripción
function handleInscriptionSelect() {
    const inscriptionId = parseInt(inscriptionSelect.value);
    
    if (!inscriptionId) {
        inscriptionInfo.style.display = 'none';
        detailForm.style.display = 'none';
        detailsTable.style.display = 'none';
        return;
    }
    
    currentInscriptionId = inscriptionId;
    idInscriptionInput.value = inscriptionId;
    
    // Mostrar información de la inscripción seleccionada
    showInscriptionInfo(inscriptionId);
}

// Función para mostrar el formulario de agregar detalle
function handleAddDetail() {
    detailForm.style.display = 'block';
    resetDetailForm();
    
    // Scroll al formulario
    detailForm.scrollIntoView({ behavior: 'smooth' });
}

// Función para manejar la eliminación de un detalle
function handleDeleteDetail(event) {
    currentDetailId = parseInt(event.currentTarget.dataset.id);
    
    // Mostrar el modal de confirmación
    deleteModal.style.display = 'block';
}

// Función para agregar un curso a la inscripción
async function addCourseToInscription(event) {
    event.preventDefault();
    
    const courseId = parseInt(courseSelect.value);
    
    if (!courseId) {
        showAlert('Por favor seleccione un curso.', 'warning');
        return;
    }
    
    // Verificar en los detalles existentes si el curso ya está en la inscripción
    const courseAlreadyAdded = details.some(detail => detail.idCourse === courseId);
    
    if (courseAlreadyAdded) {
        showAlert('Este curso ya está incluido en la inscripción.', 'warning');
        return;
    }
    
    // Crear el objeto de detalle
    const detailData = {
        idInscription: currentInscriptionId,
        idCourse: courseId
    };
    
    try {
        toggleLoader(true);
        
        // Guardar el detalle
        await api.inscriptionDetails.create(detailData);
        showAlert('Curso agregado a la inscripción con éxito.', 'success');
        
        // Recargar los detalles
        await loadInscriptionDetails(currentInscriptionId);
        
        // Resetear el formulario
        resetDetailForm();
        detailForm.style.display = 'none';
    } catch (error) {
        console.error('Error al agregar curso a la inscripción:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para eliminar un detalle de inscripción
async function deleteDetail() {
    try {
        toggleLoader(true);
        await api.inscriptionDetails.delete(currentDetailId);
        
        // Cerrar el modal y recargar la lista
        deleteModal.style.display = 'none';
        showAlert('Curso eliminado de la inscripción con éxito.', 'success');
        
        // Recargar los detalles
        await loadInscriptionDetails(currentInscriptionId);
    } catch (error) {
        console.error('Error al eliminar detalle:', error);
    } finally {
        toggleLoader(false);
    }
}

// Función para resetear el formulario de detalle
function resetDetailForm() {
    detailFormElement.reset();
    idInscriptionInput.value = currentInscriptionId;
}

// Función para dar formato a una fecha
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Función para alternar el estado del loader
function toggleLoader(show) {
    if (detailLoader) {
        detailLoader.style.display = show ? 'block' : 'none';
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
    // Verificar que todos los elementos DOM necesarios existen
    if (!inscriptionSelect) {
        console.error('Elemento inscription-select no encontrado. Esta página requiere un elemento select con id "inscription-select".');
        return;
    }
    
    // Cargar datos iniciales
    try {
        await Promise.all([loadInscriptions(), loadCourses()]);
        
        // Evento para el select de inscripciones
        inscriptionSelect.addEventListener('change', handleInscriptionSelect);
        
        // Evento para el formulario de agregar detalle
        if (detailFormElement) {
            detailFormElement.addEventListener('submit', addCourseToInscription);
        }
        
        // Evento para el botón de agregar detalle
        if (addDetailBtn) {
            addDetailBtn.addEventListener('click', handleAddDetail);
        }
        
        // Evento para el botón de cancelar
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                detailForm.style.display = 'none';
            });
        }
        
        // Eventos para el modal de eliminación
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', deleteDetail);
        }
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                deleteModal.style.display = 'none';
            });
        }
        
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => {
                deleteModal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (event) => {
            if (event.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        showAlert('Error al inicializar la página. Por favor, recarga.', 'danger');
    }
});