// Archivo: js/courses-search.js

// Configuración para la búsqueda de cursos
const coursesSearchConfig = {
    tableId: 'coursesTable',
    tableBodyId: 'coursesTableBody',
    noResultsId: 'noCourses',
    entityName: 'curso',
    containerId: 'courses-search-container',
    searchFields: [
        { 
            label: 'ID', 
            value: 'id', 
            columnIndex: 0
        },
        { 
            label: 'Nombre', 
            value: 'name', 
            columnIndex: 1 
        },
        { 
            label: 'Créditos', 
            value: 'credits', 
            columnIndex: 2 
        },
        { 
            label: 'Profesor', 
            value: 'professor', 
            columnIndex: 3 
        }
    ]
};

// Inicializar la búsqueda cuando el DOM esté listo
initializeSearch(coursesSearchConfig);

// Actualizar la búsqueda cuando se cargan nuevos datos
document.addEventListener('DOMContentLoaded', function() {
    // Referencia a la función original
    const originalLoadCourses = window.loadCourses;
    
    // Sobreescribir para actualizar la búsqueda
    if (typeof originalLoadCourses === 'function') {
        window.loadCourses = async function() {
            await originalLoadCourses.apply(this, arguments);
            
            // Actualizar el motor de búsqueda
            const searchContainer = document.getElementById('courses-search-container');
            if (searchContainer && window.searchEngine) {
                window.searchEngine.refreshTable();
            }
        };
    }
});