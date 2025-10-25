// src/pages/Productosadmin.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from "../components/SidebarAdmin"; 
import Footer from "../components/Footer"; 
import productosD from "../data/productos.json"; 

// --- Configuración de Estilos y Lógica ---
const STOCK_CRITICO = 5; 
const GREEN_LIGHT = '#39FF14'; // Color para el efecto neon
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };

// --- Componente de Contenido (Tabla de Productos) ---
const ProductContent = () => {
    
    const productosArray = productosD.productos;
    const [filter, setFilter] = useState('todos'); 
    const [isNewButtonHovered, setIsNewButtonHovered] = useState(false); 

    // 1. Lógica de Filtrado
    const filteredProducts = productosArray.filter(producto => {
        if (filter === 'critico') {
            return producto.stock <= STOCK_CRITICO;
        }
        return true; 
    });

    // Funciones de acción de ejemplo (simuladas)
    const handleDelete = (id) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto ID: ${id}?`)) {
            console.log(`Producto ID ${id} eliminado (simulado).`);
            // Lógica real de eliminación aquí
        }
    };

    const handleViewReports = (id) => {
        console.log(`Navegando a reportes del producto ID ${id} (simulado).`);
        // Lógica real de navegación a reportes aquí
    };


    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Productos</h1>
            <p className="text-muted mb-4">Listado y gestión completa del catálogo de productos.</p>

            {/* BARRA DE ACCIONES SUPERIOR (Nuevo Producto y Filtro) */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                
                {/* Botón Nuevo Producto (con efecto neon verde) */}
                <Link 
                    to="/productosadmin/nuevo"
                    className="btn btn-lg text-white d-flex align-items-center fw-bold"
                    style={{
                        backgroundColor: '#28a745', 
                        border: 'none',
                        ...hoverStyle,
                        boxShadow: isNewButtonHovered ? `0 0 15px ${GREEN_LIGHT}, 0 0 5px ${GREEN_LIGHT}` : 'none'
                    }}
                    onMouseEnter={() => setIsNewButtonHovered(true)}
                    onMouseLeave={() => setIsNewButtonHovered(false)}
                >
                    <i className="fas fa-plus-circle me-2"></i> 
                    NUEVO PRODUCTO
                </Link>

                {/* Filtro de Stock */}
                <div className="btn-group" role="group">
                    <button 
                        type="button" 
                        className={`btn ${filter === 'todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setFilter('todos')}
                    >
                        Todos
                    </button>
                    <button 
                        type="button" 
                        className={`btn ${filter === 'critico' ? 'btn-danger' : 'btn-outline-secondary'}`}
                        onClick={() => setFilter('critico')}
                    >
                        Solo Stock Crítico
                    </button>
                </div>
            </div>

            {/* Tabla de Listado de Productos */}
            <div className="table-responsive" style={{ backgroundColor: '#212529', borderRadius: '8px', padding: '10px' }}>
                <table className="table table-dark table-striped table-hover align-middle" style={{ backgroundColor: 'transparent' }}>
                    
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Categoría</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Estado</th>
                            <th scope="col" style={{ width: '200px' }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((producto) => {
                            const isCritico = producto.stock <= STOCK_CRITICO;
                            
                            return (
                                <tr key={producto.id}>
                                    <th scope="row">{producto.id}</th>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.categoria}</td>
                                    <td>${producto.precio.toLocaleString('es-CL')}</td>
                                    <td>{producto.rating} <i className="fas fa-star text-warning"></i></td>
                                    <td>{producto.stock}</td>
                                    
                                    <td>
                                        <span 
                                            className={`badge ${isCritico ? 'bg-danger' : 'bg-success'}`}
                                            title={`Umbral: ${STOCK_CRITICO}`}
                                        >
                                            {isCritico ? 'CRÍTICO' : 'Normal'}
                                        </span>
                                    </td>
                                    
                                    {/* Columna de Acciones con íconos característicos */}
                                    <td>
                                        {/* 1. Editar (Lápiz) */}
                                        <Link 
                                            to={`/productosadmin/editar/${producto.id}`} 
                                            className="btn btn-sm btn-primary me-1"
                                            title="Editar Producto"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Link>
                                        
                                        {/* 2. Eliminar (Basurero) */}
                                        <button 
                                            onClick={() => handleDelete(producto.id)} 
                                            className="btn btn-sm btn-danger me-1"
                                            title="Eliminar Producto"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                        
                                        {/* 3. Ver Reportes (Gráfico de línea) */}
                                        <button 
                                            onClick={() => handleViewReports(producto.id)} 
                                            className="btn btn-sm btn-info"
                                            title="Ver Reportes"
                                        >
                                            <i className="fas fa-chart-line"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <p className="text-center text-muted p-3">No hay productos que coincidan con el filtro seleccionado.</p>
                )}
            </div>
            
            
        </div>
    );
}


function Productosadmin() {
    return (
        <>
            <SidebarAdmin>
                <ProductContent />
            </SidebarAdmin>
            <Footer />
        </>
        
    );
}

export default Productosadmin;