// Archivo: js/inscriptions-search.js

// Configuración para la búsqueda de inscripciones
const inscriptionsSearchConfig = {
    tableId: 'inscriptionsTable',
    tableBodyId: 'inscriptionsTableBody',
    noResultsId: 'noInscriptions',
    entityName: 'inscripción',
    containerId: 'inscriptions-search-container',
    searchFields: [
        { 
            label: 'ID', 
            value: 'id', 
            columnIndex: 0
        },
        { 
            label: 'Fecha', 
            value: 'date', 
            columnIndex: 1 
        },
        { 
            label: 'Estudiante', 
            value: 'student', 
            columnIndex: 2 
        },
        { 
            label: 'Cursos', 
            value: 'courses', 
            columnIndex: 3 
        }
    ]
};

// Inicializar la búsqueda cuando el DOM esté listo
initializeSearch(inscriptionsSearchConfig);

// Actualizar la búsqueda cuando se cargan nuevos datos
document.addEventListener('DOMContentLoaded', function() {
    // Referencia a la función original
    const originalLoadInscriptions = window.loadInscriptions;
    
    // Sobreescribir para actualizar la búsqueda
    if (typeof originalLoadInscriptions === 'function') {
        window.loadInscriptions = async function() {
            await originalLoadInscriptions.apply(this, arguments);
            
            // Actualizar el motor de búsqueda
            const searchContainer = document.getElementById('inscriptions-search-container');
            if (searchContainer && window.searchEngine) {
                window.searchEngine.refreshTable();
            }
        };
    }
});