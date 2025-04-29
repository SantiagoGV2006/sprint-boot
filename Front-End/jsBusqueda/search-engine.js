/**
 * Script para implementar funcionalidad de búsqueda en tablas de entidades
 */

class EntitySearchEngine {
    /**
     * Constructor para inicializar el motor de búsqueda
     * @param {Object} config - Configuración del motor de búsqueda
     */
    constructor(config) {
        // Configuración básica
        this.tableId = config.tableId || '';
        this.tableBodyId = config.tableBodyId || '';
        this.noResultsId = config.noResultsId || '';
        this.entityName = config.entityName || 'entidad';
        this.searchFields = config.searchFields || [];
        this.containerId = config.containerId || 'search-container';
        
        // Referencias a elementos DOM
        this.table = document.getElementById(this.tableId);
        this.tableBody = document.getElementById(this.tableBodyId);
        this.noResults = document.getElementById(this.noResultsId);
        
        // Si no se encuentran elementos críticos, salir
        if (!this.table || !this.tableBody) {
            console.error(`No se encontraron los elementos necesarios para la búsqueda: tabla=${this.tableId}, tbody=${this.tableBodyId}`);
            return;
        }
        
        // Estado de búsqueda
        this.originalRows = [];
        this.filteredRows = [];
        this.currentSearchTerm = '';
        this.currentSearchField = 'all';
        
        // Guardar referencia global para acceder desde fuera
        window.searchEngine = this;
        
        // Inicializar
        this.init();
    }
    
    /**
     * Inicializa el motor de búsqueda
     */
    init() {
        console.log(`Inicializando motor de búsqueda para ${this.entityName}`);
        
        // Capturar filas originales
        this.saveOriginalRows();
        
        // Crear la interfaz de búsqueda
        this.createSearchInterface();
        
        // Registrar eventos
        this.registerEvents();
        
        console.log(`Motor de búsqueda inicializado con ${this.originalRows.length} filas`);
    }
    
    /**
     * Guarda las filas originales para restaurarlas después
     */
    saveOriginalRows() {
        if (!this.tableBody) return;
        
        const rows = this.tableBody.querySelectorAll('tr');
        if (rows.length === 0) {
            console.log('No hay filas en la tabla para guardar');
        }
        
        this.originalRows = Array.from(rows);
        this.filteredRows = this.originalRows;
        
        console.log(`Guardadas ${this.originalRows.length} filas originales`);
    }
    
    /**
     * Crea la interfaz de búsqueda
     */
    createSearchInterface() {
        // Crear contenedor si no existe
        let container = document.getElementById(this.containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = this.containerId;
            container.className = 'search-container';
            
            // Insertar antes de la tabla
            if (this.table.parentNode) {
                this.table.parentNode.insertBefore(container, this.table);
            }
        }
        
        // Construir HTML para la interfaz de búsqueda
        container.innerHTML = `
            <h3>Buscar ${this.entityName}</h3>
            <div class="search-row">
                <div class="search-input">
                    <i class="fas fa-search"></i>
                    <input type="text" id="search-term" placeholder="Buscar..." aria-label="Término de búsqueda">
                </div>
                <div class="search-field-select">
                    <select id="search-field" aria-label="Campo de búsqueda">
                        <option value="all">Todos los campos</option>
                        ${this.searchFields.map(field => 
                            `<option value="${field.value}">${field.label}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="search-actions">
                    <button type="button" id="search-btn" class="search-btn">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                    <button type="button" id="reset-btn" class="reset-btn">
                        <i class="fas fa-times"></i> Limpiar
                    </button>
                </div>
            </div>
            <div class="search-results" id="search-results"></div>
            <button type="button" class="toggle-advanced" id="toggle-advanced">
                Filtros avanzados <i class="fas fa-chevron-down"></i>
            </button>
            <div class="advanced-filters" id="advanced-filters">
                <div class="filter-row">
                    ${this.buildAdvancedFilters()}
                </div>
            </div>
        `;
    }
    
    /**
     * Construye los filtros avanzados basados en los campos de búsqueda
     */
    buildAdvancedFilters() {
        // Mostrar máximo 3 filtros avanzados (los más relevantes)
        const advancedFields = this.searchFields.slice(0, 3);
        
        return advancedFields.map(field => {
            if (field.type === 'select' && field.options) {
                return `
                    <div class="filter-group">
                        <label for="filter-${field.value}">${field.label}:</label>
                        <select id="filter-${field.value}" class="advanced-filter" data-field="${field.value}">
                            <option value="">Todos</option>
                            ${field.options.map(opt => 
                                `<option value="${opt.value}">${opt.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
            } else {
                return `
                    <div class="filter-group">
                        <label for="filter-${field.value}">${field.label}:</label>
                        <input type="text" id="filter-${field.value}" class="advanced-filter" data-field="${field.value}">
                    </div>
                `;
            }
        }).join('');
    }
    
    /**
     * Registra los eventos para la búsqueda
     */
    registerEvents() {
        // Obtener referencias a los elementos
        const searchInput = document.getElementById('search-term');
        const searchField = document.getElementById('search-field');
        const searchBtn = document.getElementById('search-btn');
        const resetBtn = document.getElementById('reset-btn');
        const toggleAdvanced = document.getElementById('toggle-advanced');
        const advancedFilters = document.getElementById('advanced-filters');
        
        if (!searchInput || !searchField || !searchBtn || !resetBtn) {
            console.error('No se encontraron los elementos necesarios para registrar eventos');
            return;
        }
        
        // Evento para botón de búsqueda
        searchBtn.addEventListener('click', () => {
            this.performSearch();
        });
        
        // Evento para tecla Enter en el input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        // Evento de input (búsqueda en tiempo real)
        searchInput.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch();
            }, 300);
        });
        
        // Evento para botón de reset
        resetBtn.addEventListener('click', () => {
            this.resetSearch();
        });
        
        // Evento para toggle de filtros avanzados
        if (toggleAdvanced && advancedFilters) {
            toggleAdvanced.addEventListener('click', () => {
                advancedFilters.classList.toggle('active');
                toggleAdvanced.classList.toggle('active');
            });
        }
        
        // Eventos para filtros avanzados
        const advancedInputs = document.querySelectorAll('.advanced-filter');
        advancedInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.applyAdvancedFilters();
            });
            
            // Para inputs de texto, aplicar después de escribir
            if (input.tagName === 'INPUT') {
                input.addEventListener('input', () => {
                    // Pequeño retraso para mejor rendimiento
                    clearTimeout(this.filterTimeout);
                    this.filterTimeout = setTimeout(() => {
                        this.applyAdvancedFilters();
                    }, 300);
                });
            }
        });
    }
    
    /**
     * Realiza la búsqueda basada en el término y campo seleccionados
     */
    performSearch() {
        // Si no hay filas originales, intentar cargarlas nuevamente
        if (this.originalRows.length === 0) {
            this.saveOriginalRows();
            if (this.originalRows.length === 0) {
                console.log('No hay datos en la tabla para buscar');
                return;
            }
        }
        
        const searchTerm = document.getElementById('search-term').value.trim();
        const searchField = document.getElementById('search-field').value;
        
        console.log(`Realizando búsqueda: campo=${searchField}, término="${searchTerm}"`);
        
        this.currentSearchTerm = searchTerm;
        this.currentSearchField = searchField;
        
        if (!searchTerm) {
            this.resetSearch();
            return;
        }
        
        // Búsqueda especial para IDs (que pueden ser números)
        const isIdSearch = searchField === 'id';
        const searchTermLower = searchTerm.toLowerCase();
        
        // Filtrar las filas originales
        const filteredRows = this.originalRows.filter(row => {
            // Validar que la fila tenga celdas
            if (!row.cells || row.cells.length === 0) {
                return false;
            }
            
            // Si el campo es "all", buscar en todas las celdas
            if (searchField === 'all') {
                return Array.from(row.cells).some(cell => {
                    const cellText = cell.textContent || '';
                    return cellText.toLowerCase().includes(searchTermLower);
                });
            } else {
                // Buscar en el índice de columna específico
                const fieldIndex = this.getFieldColumnIndex(searchField);
                
                if (fieldIndex >= 0 && row.cells.length > fieldIndex) {
                    const cellText = row.cells[fieldIndex].textContent || '';
                    
                    // Para búsqueda de IDs, podemos hacer una comparación exacta o parcial
                    if (isIdSearch) {
                        // Intentar comparación exacta primero
                        if (cellText === searchTerm) {
                            return true;
                        }
                        // Luego intentar comparación parcial (si contiene)
                        return cellText.includes(searchTerm);
                    }
                    
                    // Para otros campos, comparación normal
                    return cellText.toLowerCase().includes(searchTermLower);
                }
                return false;
            }
        });
        
        console.log(`Resultados encontrados: ${filteredRows.length}`);
        
        this.updateTable(filteredRows);
        this.updateSearchResults(filteredRows.length);
        this.highlightMatches(searchTerm);
    }    
    /**
     * Aplica los filtros avanzados a los resultados
     */
    applyAdvancedFilters() {
        // Obtener todos los filtros avanzados activos
        const advancedInputs = document.querySelectorAll('.advanced-filter');
        let activeFilters = [];
        
        advancedInputs.forEach(input => {
            const value = input.value.trim().toLowerCase();
            if (value) {
                activeFilters.push({
                    field: input.dataset.field,
                    value: value
                });
            }
        });
        
        // Si no hay filtros activos, mostrar todo (o los resultados de la búsqueda normal)
        if (activeFilters.length === 0) {
            if (this.currentSearchTerm) {
                this.performSearch(); // Volver a aplicar solo la búsqueda normal
            } else {
                this.resetSearch();
            }
            return;
        }
        
        // Comenzar con las filas ya filtradas por búsqueda simple o todas si no hay búsqueda
        let startingRows = this.currentSearchTerm ? this.filteredRows : this.originalRows;
        
        // Aplicar cada filtro activo
        activeFilters.forEach(filter => {
            const fieldIndex = this.getFieldColumnIndex(filter.field);
            
            if (fieldIndex >= 0) {
                startingRows = startingRows.filter(row => {
                    if (row.cells && row.cells.length > fieldIndex) {
                        const cellText = row.cells[fieldIndex].textContent || '';
                        return cellText.toLowerCase().includes(filter.value);
                    }
                    return false;
                });
            }
        });
        
        this.updateTable(startingRows);
        this.updateSearchResults(startingRows.length, true);
        
        // Si hay un término de búsqueda, mantener el resaltado
        if (this.currentSearchTerm) {
            this.highlightMatches(this.currentSearchTerm);
        }
    }
    
    /**
     * Reestablece la búsqueda y muestra todas las filas
     */
    resetSearch() {
        console.log('Restableciendo búsqueda y mostrando todas las filas');
        
        // Limpiar input y selector
        const searchInput = document.getElementById('search-term');
        const searchField = document.getElementById('search-field');
        
        if (searchInput) searchInput.value = '';
        if (searchField) searchField.value = 'all';
        
        // Limpiar filtros avanzados
        document.querySelectorAll('.advanced-filter').forEach(input => {
            input.value = '';
        });
        
        // Restablecer estado
        this.currentSearchTerm = '';
        this.currentSearchField = 'all';
        this.filteredRows = this.originalRows;
        
        // Actualizar tabla y mensajes
        this.updateTable(this.originalRows);
        this.updateSearchResults(0, false);
        
        // Si hay algún resultado destacado, quitarlo
        this.removeHighlights();
    }
    
    /**
     * Actualiza la tabla con las filas filtradas
     * @param {Array} filteredRows - Filas que cumplen con el filtro
     */
    updateTable(filteredRows) {
        if (!this.tableBody) {
            console.error('No se encontró el cuerpo de la tabla para actualizar');
            return;
        }
        
        // Guardar las filas filtradas en el estado
        this.filteredRows = filteredRows;
        
        // Limpiar tabla
        this.tableBody.innerHTML = '';
        
        // Si no hay resultados
        if (filteredRows.length === 0) {
            if (this.noResults) {
                this.noResults.style.display = 'block';
            }
            return;
        }
        
        // Ocultar mensaje de no resultados si está visible
        if (this.noResults) {
            this.noResults.style.display = 'none';
        }
        
        // Agregar filas filtradas
        filteredRows.forEach(row => {
            this.tableBody.appendChild(row.cloneNode(true));
        });
        
        // Reactivar eventos en las filas
        this.reattachRowEvents();
    }
    
    /**
     * Actualiza el mensaje con los resultados de la búsqueda
     * @param {number} count - Cantidad de resultados
     * @param {boolean} isAdvanced - Si es búsqueda avanzada
     */
    updateSearchResults(count, isAdvanced = false) {
        const resultsElement = document.getElementById('search-results');
        if (!resultsElement) return;
        
        if (this.currentSearchTerm || isAdvanced) {
            const filterText = isAdvanced ? 'filtro' : 'búsqueda';
            
            if (count === 0) {
                resultsElement.innerHTML = `No se encontraron resultados para su ${filterText}.`;
            } else {
                const plural = count === 1 ? '' : 's';
                resultsElement.innerHTML = `Se encontró ${count} resultado${plural} para su ${filterText}.`;
            }
            resultsElement.style.display = 'block';
        } else {
            resultsElement.innerHTML = '';
            resultsElement.style.display = 'none';
        }
    }
    
    /**
     * Resalta las coincidencias en la tabla
     * @param {string} searchTerm - Término a resaltar
     */
    highlightMatches(searchTerm) {
        if (!searchTerm || !this.tableBody) return;
        
        // Obtener todas las celdas visibles
        const cells = this.tableBody.querySelectorAll('td');
        
        cells.forEach(cell => {
            // Obtener el texto original
            const originalText = cell.textContent || '';
            
            // Verificar si el texto contiene el término de búsqueda (ignorando mayúsculas/minúsculas)
            if (originalText.toLowerCase().includes(searchTerm.toLowerCase())) {
                // Crear una expresión regular para identificar el término (preservando mayúsculas/minúsculas)
                const searchTermEscaped = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp(`(${searchTermEscaped})`, 'gi');
                
                // Reemplazar con el término resaltado
                cell.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
            }
        });
    }
    
    /**
     * Elimina todos los resaltados de la tabla
     */
    removeHighlights() {
        if (!this.tableBody) return;
        
        const cells = this.tableBody.querySelectorAll('td');
        
        cells.forEach(cell => {
            // Solo procesar si contiene resaltados
            if (cell.querySelector('.highlight')) {
                cell.innerHTML = cell.textContent;
            }
        });
    }
    
    /**
     * Reactivar los eventos en las filas después de filtrar
     */
    reattachRowEvents() {
        const entityName = this.entityName.toLowerCase();
        const capitalizedEntityName = this.capitalizeFirstLetter(this.entityName);
        
        try {
            // Reactivar evento de editar
            const editButtons = document.querySelectorAll(`.edit-${entityName}`);
            const editHandler = window[`handle${capitalizedEntityName}Edit`];
            
            if (typeof editHandler === 'function') {
                editButtons.forEach(button => {
                    button.addEventListener('click', editHandler);
                });
                console.log(`Reactivados ${editButtons.length} botones de editar`);
            }
            
            // Reactivar evento de eliminar
            const deleteButtons = document.querySelectorAll(`.delete-${entityName}`);
            const deleteHandler = window[`handle${capitalizedEntityName}Delete`];
            
            if (typeof deleteHandler === 'function') {
                deleteButtons.forEach(button => {
                    button.addEventListener('click', deleteHandler);
                });
                console.log(`Reactivados ${deleteButtons.length} botones de eliminar`);
            }
            
            // Reactivar evento de ver (si existe)
            const viewButtons = document.querySelectorAll(`.view-${entityName}`);
            const viewHandler = window[`handle${capitalizedEntityName}View`];
            
            if (typeof viewHandler === 'function') {
                viewButtons.forEach(button => {
                    button.addEventListener('click', viewHandler);
                });
                console.log(`Reactivados ${viewButtons.length} botones de ver`);
            }
        } catch (error) {
            console.warn(`Error al reactivar eventos: ${error.message}`);
        }
    }
    
    /**
     * Obtiene el índice de columna para un campo específico
     * @param {string} fieldId - ID del campo de búsqueda
     * @returns {number} Índice de la columna o -1 si no se encuentra
     */
    getFieldColumnIndex(fieldId) {
        for (let i = 0; i < this.searchFields.length; i++) {
            if (this.searchFields[i].value === fieldId) {
                return this.searchFields[i].columnIndex || -1;
            }
        }
        return -1;
    }
    
    /**
     * Utilidad para convertir primera letra a mayúscula
     * @param {string} string - Cadena a convertir
     * @returns {string} Cadena con primera letra en mayúscula
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * Actualiza la tabla con nuevos datos (por ejemplo, después de cargar más datos)
     */
    refreshTable() {
        console.log('Actualizando tabla con nuevos datos');
        
        // Guardar las filas actualizadas
        this.saveOriginalRows();
        
        // Si hay una búsqueda activa, volver a aplicarla
        if (this.currentSearchTerm) {
            this.performSearch();
        } else {
            // Asegurarse de que todas las filas estén visibles
            this.updateTable(this.originalRows);
        }
    }
}

// Función de ayuda para crear una instancia de búsqueda
function initializeSearch(config) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log(`Inicializando búsqueda para ${config.entityName}`);
        window.searchEngine = new EntitySearchEngine(config);
    });
}