import React, { useState, useEffect, useCallback } from 'react'; 
// ELIMINAMOS TODA DEPENDENCIA DE JSON Y LÓGICA OBSOLETA
// import productosD from "../data/productos.json"; 
// const LOCAL_STORAGE_KEY_PRODUCTS = 'productos_maestro';
// const getAllUniqueCategories = () => { /* ... */ };


// --- Configuración API ---
const API_BASE_URL = 'http://localhost:8080/v2/categorias'; // URL base de categorías


function CategoriasContent() { 
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. FUNCIÓN DE LECTURA (READ ALL)
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/todas`); // GET: /v2/categorias/todas
            
            if (!response.ok) {
                throw new Error("Error al obtener las categorías.");
            }
            const data = await response.json();
            
            // Asumimos que la API devuelve un array de objetos { id: ID, nombre: NOMBRE }
            setCategories(data); 
        } catch (err) {
            console.error("Error cargando categorías:", err);
            setError("No se pudo conectar al servidor para obtener las categorías.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Carga inicial
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 2. FUNCIÓN DE CREACIÓN (CREATE - POST)
    const handleCreateCategory = async () => {
        const newCatName = prompt("Introduce el nombre de la nueva categoría:");
        
        if (newCatName && newCatName.trim() !== '') {
            try {
                const response = await fetch(`${API_BASE_URL}/crear`, { // POST: /v2/categorias/crear
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // El ID se genera en el backend. Solo enviamos el nombre.
                    body: JSON.stringify({ nombre: newCatName.trim() }), 
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(`Fallo al crear la categoría: ${errorMsg}`);
                }

                const createdCategory = await response.json();

                // Actualizar la lista con la categoría recién creada (que incluye su ID real)
                setCategories(prev => [...prev, createdCategory]);
                alert(`✅ Categoría "${createdCategory.nombre}" creada con ID ${createdCategory.id}.`);

            } catch (err) {
                console.error("Error al crear categoría:", err);
                alert(`❌ Error al crear: ${err.message}`);
            }
        }
    };

    // 3. FUNCIÓN DE EDICIÓN (UPDATE - PUT)
    const handleEditCategory = async (id, currentName) => {
        const newName = prompt(`Editar categoría: ${currentName}. Introduce el nuevo nombre:`, currentName);
        
        if (newName && newName.trim() !== currentName) {
            try {
                // PUT: /v2/categorias/actualizar/{id}
                const response = await fetch(`${API_BASE_URL}/actualizar/${id}`, { 
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    // Enviamos solo el nuevo nombre en el body, el ID va en la URL.
                    body: JSON.stringify({ nombre: newName.trim() }), 
                });

                if (response.status === 404) throw new Error("Categoría no encontrada.");
                if (!response.ok) throw new Error("Fallo al actualizar la categoría.");

                const updatedCategory = await response.json();
                
                // Actualizar el estado local
                setCategories(prev => 
                    prev.map(cat => (cat.id === id ? updatedCategory : cat))
                );
                
                alert(`✅ Categoría "${currentName}" editada a "${updatedCategory.nombre}".`);

            } catch (err) {
                console.error("Error al editar categoría:", err);
                alert(`❌ Error al editar: ${err.message}`);
            }
        }
    };

    // 4. FUNCIÓN DE ELIMINACIÓN (DELETE)
    const handleDeleteCategory = async (id, name) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${name}"? Esto afectará la base de datos SQL y cualquier producto asociado.`)) {
            try {
                // DELETE: /v2/categorias/eliminar/id/{id}
                const response = await fetch(`${API_BASE_URL}/eliminar/id/${id}`, {
                    method: 'DELETE',
                });

                // Si el producto fue eliminado, el servidor devuelve un 200 OK
                if (!response.ok) {
                    const errorText = await response.text();
                    // Un error 404 (Not Found) significa que la categoría no existe.
                    throw new Error(errorText || "Fallo al eliminar la categoría. Puede estar asociada a productos.");
                }

                // Eliminamos del estado local
                setCategories(prev => prev.filter(cat => cat.id !== id));
                alert(`✅ Categoría "${name}" eliminada.`);

            } catch (err) {
                console.error("Error al eliminar categoría:", err);
                alert(`❌ Error al eliminar: ${err.message}`);
            }
        }
    };


    // 5. Renderizado
    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Gestión de Categorías</h1>
            <p className="text-muted mb-4">Gestión completa de las categorías del catálogo.</p>

            {loading && <p className="text-warning"><i className="fas fa-spinner fa-spin me-2"></i> Cargando categorías...</p>}
            {error && <p className="alert alert-danger">{error}</p>}

            {!loading && !error && (
            <>
                {/* BARRA DE ACCIONES SUPERIOR */}
                <div className="d-flex justify-content-end align-items-center mb-4">
                    <button 
                        onClick={handleCreateCategory}
                        className="btn btn-lg text-white d-flex align-items-center fw-bold"
                        style={{ backgroundColor: '#28a745', border: 'none' }}
                    >
                        <i className="fas fa-plus-circle me-2"></i> NUEVA CATEGORÍA
                    </button>
                </div>

                {/* Tabla de Listado de Categorías */}
                <div className="table-responsive" style={{ backgroundColor: '#212529', borderRadius: '8px', padding: '10px' }}>
                    <table className="table table-dark table-striped table-hover align-middle" style={{ backgroundColor: 'transparent' }}>
                        
                        <thead>
                            <tr>
                                <th scope="col" style={{ width: '10%' }}>ID</th>
                                <th scope="col" style={{ width: '60%' }}>Nombre de la Categoría</th>
                                <th scope="col" style={{ width: '30%' }}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <tr key={cat.id}> 
                                        <th>{cat.id}</th> {/* Mostramos el ID real de la base de datos */}
                                        <td>{cat.nombre}</td>
                                        
                                        {/* Columna de Acciones */}
                                        <td>
                                            <button 
                                                onClick={() => handleEditCategory(cat.id, cat.nombre)} 
                                                className="btn btn-sm btn-primary me-2"
                                                title="Editar Categoría"
                                            >
                                                <i className="fas fa-edit"></i> 
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleDeleteCategory(cat.id, cat.nombre)} 
                                                className="btn btn-sm btn-danger"
                                                title="Eliminar Categoría"
                                            >
                                                <i className="fas fa-trash-alt"></i> 
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted p-3">
                                        No se encontraron categorías.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
            )}
            
        </div>
    );
}

export default CategoriasContent;