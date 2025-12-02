import React, { useState, useEffect, useCallback } from 'react'; // 🛑 AÑADIMOS useEffect y useCallback
import { Link } from 'react-router-dom';
import SidebarAdmin from "../components/SidebarAdmin"; 
// ELIMINAMOS DATOS ESTÁTICOS Y LÓGICA OBSOLETA
// import productosD from "../data/productos.json"; 
// const LOCAL_STORAGE_KEY = 'productos_maestro';
// const getAllProducts = () => { /* ... */ };

import Notiadmn from '../components/Notiadmn';
import ProductosReport from '../components/ProductosReport'; 

// --- Configuración API ---
const API_BASE_URL = 'http://localhost:8080/v2/productos';
const STOCK_CRITICO_DEFAULT = 5; 
const GREEN_LIGHT = '#39FF14'; 
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };


// --- Componente de Contenido (Tabla de Productos) ---
const ProductContent = () => {
    
    // 1. Estados para la data de la API
    const [productosArray, setProductosArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filter, setFilter] = useState('todos'); 
    const [isNewButtonHovered, setIsNewButtonHovered] = useState(false); 

    // Estados para el modal de reportes (se mantienen igual)
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedProductForReport, setSelectedProductForReport] = useState(null);

    // 2. Función de Carga de Datos (READ)
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/todos`); // GET: /v2/productos/todos
            
            if (!response.ok) {
                throw new Error("Error al cargar los productos.");
            }
            
            const data = await response.json();
            // Mapeamos los ID para asegurar consistencia (usamos ID o id si tu Entity lo devuelve así)
            setProductosArray(data.map(p => ({ ...p, id: p.id || p.ID }))); 
        } catch (err) {
            console.error("Error cargando productos:", err);
            setError("No se pudo conectar a la API para obtener la lista de productos.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Ejecutar la carga al montar el componente
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    // Lógica de Filtrado (Usa datos del estado)
    const filteredProducts = productosArray.filter(producto => {
        // Usamos el campo STOCK_CRITICO o STOCK_CRITICO_DEFAULT
        const productStockCritico = producto.stockCritico || producto.STOCK_CRITICO || STOCK_CRITICO_DEFAULT;
        const productStock = producto.stock || producto.STOCK || 0;

        if (filter === 'critico') return productStock <= productStockCritico;
        return true; 
    });

    // 4. Lógica para Borrar (DELETE con API)
    const handleDelete = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto ${nombre} (ID: ${id})? Esta acción afectará la base de datos SQL.`)) {
            try {
                // DELETE: /v2/productos/eliminar/id/{id}
                const response = await fetch(`${API_BASE_URL}/eliminar/id/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "No se pudo eliminar el producto.");
                }

                // Actualizar el estado local (sin recargar)
                setProductosArray(prev => prev.filter(p => p.id !== id));
                alert(`Producto ${nombre} eliminado exitosamente.`);
            } catch (err) {
                console.error("Error eliminando producto:", err);
                alert(`Error al eliminar producto: ${err.message}`);
            }
        }
    };

    // Abre el modal con el producto seleccionado (se mantiene igual)
    const handleViewReports = (product) => {
        setSelectedProductForReport(product); 
        setShowReportModal(true); 
    };

    // Cierra el modal (se mantiene igual)
    const handleCloseReportModal = () => {
        setShowReportModal(false); 
        setSelectedProductForReport(null); 
    };


    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Productos</h1>
            <p className="text-muted mb-4">Listado y gestión completa del catálogo.</p>

            {/* Manejo de estados de carga y error */}
            {loading && <p className="text-warning"><i className="fas fa-spinner fa-spin me-2"></i> Cargando productos desde la base de datos...</p>}
            {error && <p className="alert alert-danger">{error}</p>}

            {!loading && !error && (
            <>
                {/* BARRA DE ACCIONES SUPERIOR */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {/* Botón Nuevo Producto */}
                    <Link 
                        // Ruta corregida para el anidamiento: /adminhome/nuevoproducto
                        to="/adminhome/nuevoproducto" 
                        className="btn btn-lg text-white d-flex align-items-center fw-bold"
                        // ... estilos
                    >
                        <i className="fas fa-plus-circle me-2"></i> NUEVO PRODUCTO
                    </Link>
                    {/* Filtro de Stock (se mantiene igual) */}
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
                                const productStockCritico = producto.stockCritico || producto.STOCK_CRITICO || STOCK_CRITICO_DEFAULT;
                                const productStock = producto.stock || producto.STOCK || 0;
                                const isCritico = productStock <= productStockCritico;
                                const ratingValue = producto.rating || producto.RATING || 0; 
                                const nombreProducto = producto.nombre || producto.NOMBRE;

                                return (
                                    <tr key={producto.id}>
                                        <th>{producto.id}</th><td>{nombreProducto}</td><td>{producto.categoria || producto.CATEGORIA}</td>
                                        <td>${(producto.precio || producto.PRECIO || 0).toLocaleString('es-CL')}</td>
                                        <td>{ratingValue.toFixed(1)} <i className="fas fa-star text-warning"></i></td>
                                        <td>{productStock}</td>
                                        <td><span className={`badge ${isCritico ? 'bg-danger' : 'bg-success'}`}>{isCritico ? 'CRÍTICO' : 'Normal'}</span></td>
                                        <td>
                                            {/* Link a editar: /adminhome/productosadmin/editar/{id} */}
                                            <Link to={`/adminhome/productosadmin/editar/${producto.id}`} className="btn btn-sm btn-primary me-1" title="Editar"><i className="fas fa-edit"></i></Link>
                                            
                                            {/* Botón Eliminar: Llama a la API DELETE */}
                                            <button onClick={() => handleDelete(producto.id, nombreProducto)} className="btn btn-sm btn-danger me-1" title="Eliminar"><i className="fas fa-trash-alt"></i></button>
                                            
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
            </>
            )}
            
            {/* RENDERIZADO CONDICIONAL DEL MODAL */}
            {showReportModal && (
                <ProductosReport 
                    product={selectedProductForReport} 
                    onClose={handleCloseReportModal} 
                />
            )}
            
        </div>
    );
}


function Productosadmin() {
    return (
        <SidebarAdmin>
            <ProductContent />
            <Notiadmn />
        </SidebarAdmin>
    );
}

export default Productosadmin;