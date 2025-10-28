import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from "../components/SidebarAdmin"; 
import productosD from "../data/productos.json"; 
import Notiadmn from '../components/Notiadmn';
import ProductosReport from '../components/ProductosReport'; // <-- IMPORTACIÓN ACTUALIZADA

// --- Configuración Global ---
const STOCK_CRITICO_DEFAULT = 5; 
const GREEN_LIGHT = '#39FF14'; 
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };
const LOCAL_STORAGE_KEY = 'productos_maestro';

const getAllProducts = () => {
    // ... (lógica para leer de localStorage o JSON) ...
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let products = storedData ? JSON.parse(storedData) : [];
        if (!products || products.length === 0) products = productosD.productos || [];
        if (!Array.isArray(products)) return [];
        return products;
    } catch (error) {
        console.error("Error loading products:", error);
        return productosD.productos || []; 
    }
};

// --- Componente de Contenido (Tabla de Productos) ---
const ProductContent = () => {
    
    const initialProducts = getAllProducts(); 
    const [productosArray, setProductosArray] = useState(initialProducts);
    const [filter, setFilter] = useState('todos'); 
    const [isNewButtonHovered, setIsNewButtonHovered] = useState(false); 

    // Estados para el modal de reportes
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedProductForReport, setSelectedProductForReport] = useState(null);

    // Lógica de Filtrado
    const filteredProducts = productosArray.filter(producto => {
        const productStockCritico = producto.stockCritico || STOCK_CRITICO_DEFAULT;
        if (filter === 'critico') return producto.stock <= productStockCritico;
        return true; 
    });

    // Lógica para Borrar
    const handleDelete = (id) => {
        if (window.confirm(`¿Eliminar producto ID: ${id}?`)) {
            const updatedProducts = productosArray.filter(p => p.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
            setProductosArray(updatedProducts);
        }
    };

    // Abre el modal con el producto seleccionado
    const handleViewReports = (product) => {
        setSelectedProductForReport(product); 
        setShowReportModal(true); 
    };

    // Cierra el modal
    const handleCloseReportModal = () => {
        setShowReportModal(false); 
        setSelectedProductForReport(null); 
    };


    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Productos</h1>
            <p className="text-muted mb-4">Listado y gestión completa del catálogo.</p>

            {/* BARRA DE ACCIONES SUPERIOR */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Botón Nuevo Producto */}
                <Link 
                    to="/nuevoproducto"
                    className="btn btn-lg text-white d-flex align-items-center fw-bold"
                    style={{ backgroundColor: '#28a745', border: 'none', ...hoverStyle, boxShadow: isNewButtonHovered ? `0 0 15px ${GREEN_LIGHT}, 0 0 5px ${GREEN_LIGHT}` : 'none' }}
                    onMouseEnter={() => setIsNewButtonHovered(true)}
                    onMouseLeave={() => setIsNewButtonHovered(false)}
                >
                    <i className="fas fa-plus-circle me-2"></i> NUEVO PRODUCTO
                </Link>
                {/* Filtro de Stock */}
                <div className="btn-group" role="group">
                    <button type="button" className={`btn ${filter === 'todos' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('todos')}>Todos</button>
                    <button type="button" className={`btn ${filter === 'critico' ? 'btn-danger' : 'btn-outline-secondary'}`} onClick={() => setFilter('critico')}>Solo Stock Crítico</button>
                </div>
            </div>

            {/* Tabla de Listado de Productos */}
            <div className="table-responsive" style={{ backgroundColor: '#212529', borderRadius: '8px', padding: '10px' }}>
                <table className="table table-dark table-striped table-hover align-middle" style={{ backgroundColor: 'transparent' }}>
                    <thead>
                        <tr>
                            <th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Rating</th> 
                            <th>Stock</th><th>Estado</th><th style={{ width: '200px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((producto) => {
                            const productStockCritico = producto.stockCritico || STOCK_CRITICO_DEFAULT;
                            const isCritico = producto.stock <= productStockCritico;
                            const ratingValue = producto.rating || 0; 
                            return (
                                <tr key={producto.id}>
                                    <th>{producto.id}</th><td>{producto.nombre}</td><td>{producto.categoria}</td>
                                    <td>${(producto.precio || 0).toLocaleString('es-CL')}</td>
                                    <td>{ratingValue.toFixed(1)} <i className="fas fa-star text-warning"></i></td>
                                    <td>{producto.stock}</td>
                                    <td><span className={`badge ${isCritico ? 'bg-danger' : 'bg-success'}`}>{isCritico ? 'CRÍTICO' : 'Normal'}</span></td>
                                    <td>
                                        <Link to={`/productosadmin/editar/${producto.id}`} className="btn btn-sm btn-primary me-1" title="Editar"><i className="fas fa-edit"></i></Link>
                                        <button onClick={() => handleDelete(producto.id)} className="btn btn-sm btn-danger me-1" title="Eliminar"><i className="fas fa-trash-alt"></i></button>
                                        {/* Botón para abrir el modal de Reportes */}
                                        <button onClick={() => handleViewReports(producto)} className="btn btn-sm btn-info" title="Ver Reportes"><i className="fas fa-chart-line"></i></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <p className="text-center text-muted p-3">No hay productos que coincidan.</p>}
            </div>
            
            {/* RENDERIZADO CONDICIONAL DEL MODAL (CON EL NUEVO NOMBRE) */}
            {showReportModal && (
                <ProductosReport // <-- COMPONENTE ACTUALIZADO
                    product={selectedProductForReport} 
                    onClose={handleCloseReportModal} 
                />
            )}
            
        </div>
    );
}


function Productosadmin() {
    return (
        // Se envuelve el contenido y la notificación dentro del SidebarAdmin
        <SidebarAdmin>
            <ProductContent />
            <Notiadmn />
        </SidebarAdmin>
    );
}

export default Productosadmin;