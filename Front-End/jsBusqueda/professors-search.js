// Archivo: js/professors-search.js

// Configuración para la búsqueda de profesores
const professorsSearchConfig = {
    tableId: 'professorsTable',
    tableBodyId: 'professorsTableBody',
    noResultsId: 'noProfessors',
    entityName: 'profesor',
    containerId: 'professors-search-container',
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
            label: 'Apellido', 
            value: 'lastname', 
            columnIndex: 2 
        },
        { 
            label: 'Especialidad', 
            value: 'speciality', 
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
initializeSearch(professorsSearchConfig);

// Actualizar la búsqueda cuando se cargan nuevos datos
document.addEventListener('DOMContentLoaded', function() {
    // Referencia a la función original
    const originalLoadProfessors = window.loadProfessors;
    
    // Sobreescribir para actualizar la búsqueda
    if (typeof originalLoadProfessors === 'function') {
        window.loadProfessors = async function() {
            await originalLoadProfessors.apply(this, arguments);
            
            // Actualizar el motor de búsqueda
            const searchContainer = document.getElementById('professors-search-container');
            if (searchContainer && window.searchEngine) {
                window.searchEngine.refreshTable();
            }
        };
    }
});