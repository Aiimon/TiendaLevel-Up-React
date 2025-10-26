// src/components/CategoriaContent.jsx

import React, { useState, useEffect } from 'react';
import productosD from "../data/productos.json"; 

// --- Configuración Global ---
const LOCAL_STORAGE_KEY_PRODUCTS = 'productos_maestro';

// Función para obtener todas las categorías únicas
const getAllUniqueCategories = () => {
    // 1. Iniciar con las categorías definidas en el array 'categorias' del JSON
    const categoriesSet = new Set(productosD.categorias || []);
    
    // 2. Agregar categorías de los productos actualmente en localStorage/maestro
    const allProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS)) || productosD.productos || [];

    allProducts.forEach(p => {
        if (p.categoria && typeof p.categoria === 'string' && p.categoria.trim() !== '') {
            categoriesSet.add(p.categoria.trim());
        }
    });

    // 3. Convertir el Set a un Array de objetos para la tabla
    return Array.from(categoriesSet).map((name, index) => ({
        // El ID se mantiene internamente para manejar la edición y la clave de React
        id: name.replace(/\s/g, '').toUpperCase().substring(0, 5) + `-${index + 1}`,
        nombre: name
    }));
};


function CategoriasContent() { 
    
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setCategories(getAllUniqueCategories());
    }, []);

    // Funciones de acción simuladas
    const handleCreateCategory = () => {
        const newCatName = prompt("Introduce el nombre de la nueva categoría:");
        if (newCatName && newCatName.trim() !== '') {
            console.log(`[SIMULACIÓN] Creando nueva categoría: ${newCatName}`);
            
            const newId = newCatName.replace(/\s/g, '').toUpperCase().substring(0, 5) + `-${Date.now()}`;
            setCategories(prev => [...prev, { id: newId, nombre: newCatName.trim() }]);
            
            alert(`Simulación: Categoría "${newCatName.trim()}" agregada. (No persistente sin API/JSON de Categorías).`);
        }
    };

    const handleEditCategory = (id, currentName) => {
        const newName = prompt(`Editar categoría: ${currentName}. Introduce el nuevo nombre:`, currentName);
        
        if (newName && newName.trim() !== currentName) {
            console.log(`[SIMULACIÓN] Editando categoría ID ${id}: ${currentName} -> ${newName}`);
            
            setCategories(prev => 
                prev.map(cat => (cat.id === id ? { ...cat, nombre: newName.trim() } : cat))
            );
            
            alert(`Simulación: Categoría "${currentName}" editada a "${newName}".`);
        }
    };

    const handleDeleteCategory = (id, name) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${name}"? NOTA: Esto no eliminará los productos asociados en la simulación.`)) {
            console.log(`[SIMULACIÓN] Eliminando categoría: ${name} (ID: ${id})`);

            // Filtramos la lista para quitar la categoría
            setCategories(prev => prev.filter(cat => cat.id !== id));
            
            alert(`Simulación: Categoría "${name}" eliminada.`);
        }
    };

    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Gestión de Categorías</h1>
            <p className="text-muted mb-4">Listado de categorías extraídas de la lista maestra de productos.</p>

            {/* BARRA DE ACCIONES SUPERIOR */}
            <div className="d-flex justify-content-end align-items-center mb-4">
                
                {/* Botón Nueva Categoría */}
                <button 
                    onClick={handleCreateCategory}
                    className="btn btn-lg text-white d-flex align-items-center fw-bold"
                    style={{
                        backgroundColor: '#28a745', 
                        border: 'none',
                    }}
                >
                    <i className="fas fa-plus-circle me-2"></i> 
                    NUEVA CATEGORÍA
                </button>
            </div>

            {/* Tabla de Listado de Categorías */}
            <div className="table-responsive" style={{ backgroundColor: '#212529', borderRadius: '8px', padding: '10px' }}>
                <table className="table table-dark table-striped table-hover align-middle" style={{ backgroundColor: 'transparent' }}>
                    
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: '70%' }}>Nombre de la Categoría</th>
                            <th scope="col" style={{ width: '30%' }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat.id}> {/* Key de React usando el ID interno */}
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
                                        
                                        {/* BOTÓN BORRAR AGREGADO */}
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
                                <td colSpan="2" className="text-center text-muted p-3">
                                    No se encontraron categorías.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
           
        </div>
    );
}

export default CategoriasContent;