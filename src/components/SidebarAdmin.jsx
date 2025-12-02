// src/components/SidebarAdmin.jsx (CÓDIGO CORREGIDO Y LISTO)

import React, { useState, useEffect, useCallback } from 'react'; 
import { NavLink, Link } from 'react-router-dom';

// --- Configuración Global ---
const BLUE_LIGHT = '#1E90FF';
const GREEN_LIGHT = '#39FF14';
const STOCK_CRITICO = 5;
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };
const API_BASE_URL = 'http://localhost:8080/v2'; 

// --- StockNotification (Componente Flotante) ---
export const StockNotification = ({ products }) => {
    if (products.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1050, 
            backgroundColor: '#dc3545', 
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            maxWidth: '300px',
        }}>
            <h5 style={{ margin: 0 }}><i className="fas fa-exclamation-triangle me-2"></i> ¡Stock Crítico!</h5>
            <hr style={{ margin: '8px 0', borderColor: 'rgba(255, 255, 255, 0.4)' }} />
            {products.map((p, index) => (
                <p key={index} style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                    Producto: **{p.nombre || p.NOMBRE}** (ID: {p.id})
                </p>
            ))}
        </div>
    );
};
// --- Fin Componente de Notificación ---


// --- Componente Sidebar (Contenido de la barra lateral) ---
export const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard',  path: '/adminhome' }, 
        { name: 'Órdenes', path: '/adminhome/ordenes' },
        { name: 'Productos', path: '/adminhome/productosadmin' },
        { name: 'Categorías', path: '/adminhome/categoria_admin' },
        { name: 'Usuarios', path: '/adminhome/usuariosadmin' },
        { name: 'Reportes', path: '/adminhome/reporte' },
    ];
    const [hoveredNav, setHoveredNav] = useState(null);
    // Nota: Asegúrate de que las rutas en path coincidan con tu Homeadmin.jsx (ej: /adminhome/productosadmin)

    return (
        <div className="d-flex flex-column p-3 text-white sidebar-admin" 
            style={{ width: '250px', backgroundColor: '#161616ff', minHeight: '100vh', flexShrink: 0 }}>
            {/* ... Contenido del logo y navegación ... */}
            <ul className="nav nav-pills flex-column mb-4">
                {navItems.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `nav-link text-white d-flex align-items-center mb-1 ${isActive ? 'sidebar-active' : ''}`}
                            // ... estilos de hover ...
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
            {/* ... Botón de logout ... */}
        </div>
    );
};
// --- Fin Componente Sidebar ---


// --- Componente Principal: SidebarAdmin (LAYOUT) ---
function SidebarAdmin({ children }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    const fetchProductos = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/todos`); 
            if (!response.ok) {
                throw new Error(`Error al obtener productos: ${response.statusText}`);
            }
            const data = await response.json();
            setProductos(data);
        } catch (err) {
            console.error("Error al cargar productos para la notificación:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);


    const productosCriticos = productos.filter(p => (p.stock || p.STOCK) <= STOCK_CRITICO);


    return (
        <div className="d-flex admin-layout-container" style={{ minHeight: '100vh', width: '100%' }}>
            
            <Sidebar /> 
            
            {/* Contenedor flexible para el contenido principal: Ocupa el espacio restante */}
            <div style={{ flexGrow: 1, overflowY: 'auto', minHeight: '100%' }}>
                {children} 
            </div>
            
            {/* La Notificación de Stock se renderiza fuera del flujo principal del flex */}
            {!loading && !error && <StockNotification products={productosCriticos} />}
        </div>
    );
}

export default SidebarAdmin;