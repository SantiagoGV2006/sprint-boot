// Archivo: js/students-search.js (Corregido para búsqueda por ID)

// Configuración para la búsqueda de estudiantes
const studentsSearchConfig = {
    tableId: 'studentsTable',
    tableBodyId: 'studentsTableBody',
    noResultsId: 'noStudents',
    entityName: 'estudiante',
    containerId: 'students-search-container',
    searchFields: [
        { 
            label: 'ID', 
            value: 'id', 
            columnIndex: 0,  // Índice de la columna en la tabla
            type: 'number'   // Especificar que es un número
        },
        { 
            label: 'Nombre', 
            value: 'name', 
            columnIndex: 1 
        },
        { 
            label: 'Apellido', 
            value: 'lastname', 
            columnIndex: 2 
        },
        { 
            label: 'Dirección', 
            value: 'address', 
            columnIndex: 3 
        },
        { 
            label: 'Teléfono', 
            value: 'phone', 
            columnIndex: 4 
        },
        { 
            label: 'Email', 
            value: 'email', 
            columnIndex: 5 
        }
    ]
};

// Inicializar la búsqueda cuando el DOM esté listo
initializeSearch(studentsSearchConfig);

// Función para actualizar la búsqueda después de cargar estudiantes
function updateStudentSearch() {
    console.log("Actualizando motor de búsqueda para estudiantes");
    if (window.searchEngine) {
        window.searchEngine.refreshTable();
    }
}

// Modificar la función loadStudents existente para actualizar la búsqueda
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un momento para asegurarse de que todo esté cargado
    setTimeout(function() {
        // Verificar si la función loadStudents existe
        if (typeof window.loadStudents === 'function') {
            console.log("Sobreescribiendo loadStudents para integrar búsqueda");
            
            // Guardar la versión original
            const originalLoadStudents = window.loadStudents;
            
            // Sobreescribir con nuestra versión
            window.loadStudents = async function() {
                // Llamar a la versión original
                await originalLoadStudents.apply(this, arguments);
                
                // Actualizar la búsqueda
                updateStudentSearch();
            };
        } else {
            console.warn("No se encontró la función loadStudents para sobrescribir");
        }
    }, 500);
    
    // Agregar evento de cambio al selector de campos para manejar casos especiales
    setTimeout(function() {
        const searchField = document.getElementById('search-field');
        const searchInput = document.getElementById('search-term');
        
        if (searchField && searchInput) {
            searchField.addEventListener('change', function(e) {
                // Si se selecciona búsqueda por ID, cambiar el tipo de input
                if (e.target.value === 'id') {
                    searchInput.setAttribute('inputmode', 'numeric');
                    searchInput.setAttribute('placeholder', 'Buscar por ID...');
                } else {
                    searchInput.removeAttribute('inputmode');
                    searchInput.setAttribute('placeholder', 'Buscar...');
                }
            });
        }
    }, 600);
});