import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
// NO IMPORTAMOS MÁS LOS DATOS AQUÍ, solo para la Notificación.
import productosD from "../data/productos.json"; 

// --- Configuración Global ---
const BLUE_LIGHT = '#1E90FF';
const GREEN_LIGHT = '#39FF14';
const STOCK_CRITICO = 5;
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };

// --- StockNotification (Exportada para ser usada en DashboardContent) ---
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
                    Producto: **{p.nombre}** (ID: {p.id})
                </p>
            ))}
        </div>
    );
};
// --- Fin Componente de Notificación ---


// --- Componente Sidebar (Exportado para ser usado en otras páginas como Productosadmin) ---
export const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard',  path: '/homeadmin' }, 
        { name: 'Órdenes', path: '/ordenes' },
        { name: 'Productos', path: '/productosadmin' },
        { name: 'Categorías', path: '/categoria_admin' },
        { name: 'Usuarios', path: '/usuariosadmin' },
        { name: 'Reportes', path: '/reporte' },
    ];

    const [hoveredNav, setHoveredNav] = useState(null);

    return (
        <div className="d-flex flex-column p-3 text-white sidebar-admin" 
             style={{ width: '250px', backgroundColor: '#161616ff', minHeight: '100vh', flexShrink: 0 }}>
            
            {/* Logo y link */}
            <Link 
                className="navbar-brand brand neon active text-decoration-none text-light mb-4 text-center fs-5 fw-bold" 
                to="/" 
                style={{ ...hoverStyle, boxShadow: hoveredNav === 'logo' ? `0 0 15px ${BLUE_LIGHT}` : 'none' }}
                onMouseEnter={() => setHoveredNav('logo')}
                onMouseLeave={() => setHoveredNav(null)}
            >
                <i className="bi bi-joystick me-2"></i>Level‑Up Gamer
            </Link>
            
            <hr className="text-secondary" />

            {/* Navegación Principal */}
            <ul className="nav nav-pills flex-column mb-4">
                {navItems.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => 
                                `nav-link text-white d-flex align-items-center mb-1 ${isActive ? 'sidebar-active' : ''}`
                            }
                            style={({ isActive }) => ({ 
                                ...hoverStyle,
                                borderRadius: '5px',
                                boxShadow: hoveredNav === item.name ? `0 0 10px ${GREEN_LIGHT}` : 'none'
                            })}
                            onMouseEnter={() => setHoveredNav(item.name)}
                            onMouseLeave={() => setHoveredNav(null)}
                        >
                            <i className={`me-3 ${item.icon}`}></i>
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Botones Inferiores */}
            <div className="mt-auto pt-3"> 
                <hr className="text-secondary" /> 
                <Link to="/perfiladmin" /* ... estilos y hover ... */ className="btn w-100 mb-2 text-start text-white text-decoration-none" style={{ backgroundColor: '#000000', border: 'none', ...hoverStyle, boxShadow: hoveredNav === 'perfilLink' ? `0 0 10px ${GREEN_LIGHT}` : 'none' }} onMouseEnter={() => setHoveredNav('perfilLink')} onMouseLeave={() => setHoveredNav(null)}>
                    <i className="fas fa-user-circle me-3"></i>
                    Ver Perfil
                </Link>
                <Link to="/categoria" /* ... estilos y hover ... */ className="btn w-100 mb-2 text-start text-white text-decoration-none" style={{ backgroundColor: '#000000', border: 'none', ...hoverStyle, boxShadow: hoveredNav === 'tienda' ? `0 0 10px ${GREEN_LIGHT}` : 'none' }} onMouseEnter={() => setHoveredNav('tienda')} onMouseLeave={() => setHoveredNav(null)}>
                    <i className="fas fa-user-circle me-3"></i>
                    Tienda
                </Link>
                <button /* ... estilos y hover ... */ className="btn w-100 text-start text-white" style={{ backgroundColor: '#dc3545', border: 'none', ...hoverStyle, boxShadow: hoveredNav === 'logout' ? `0 0 10px ${BLUE_LIGHT}` : 'none' }} onMouseEnter={() => setHoveredNav('logout')} onMouseLeave={() => setHoveredNav(null)}>
                    <i className="fas fa-sign-out-alt me-3"></i>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};
// --- Fin Componente Sidebar ---


// --- Componente Principal: SidebarAdmin (LAYOUT) ---
// Este componente se usa en Homeadmin.jsx
function SidebarAdmin({ children }) {
    return (
        <div className="d-flex admin-layout-container" style={{ minHeight: '100vh' }}>
            <Sidebar /> 
            {children} {/* <--- RENDERIZA EL CONTENIDO ESPECÍFICO DE LA PÁGINA */}
        </div>
    );
}

export default SidebarAdmin;