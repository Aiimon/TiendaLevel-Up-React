import { NavLink, Link } from 'react-router-dom';
import Footer from "./Footer"; 
// Importaciones de datos
import productosD from "../data/productos.json"; 
import usuariosD from "../data/usuarios.json"; // <-- ASUMO esta ruta y nombre de archivo

// --- Componente Sidebar ---
const Sidebar = () => {
    // Definición de las rutas de navegación con los path actualizados
    const navItems = [
        { name: 'Dashboard', icon: 'fas fa-cloud', path: '/homeadmin' }, 
        { name: 'Órdenes', icon: 'fas fa-clipboard-list', path: '/ordenesadmin' },
        { name: 'Productos', icon: 'fas fa-cubes', path: '/productosadmin' },
        { name: 'Categorías', icon: 'fas fa-tags', path: '/categoriasadmin' },
        { name: 'Usuarios', icon: 'fas fa-users', path: '/usuariosadmin' },
        { name: 'Reportes', icon: 'fas fa-file-alt', path: '/reportesadmin' },
    ];

    return (
        // Estilo oscuro consistente para el Sidebar
        <div className="d-flex flex-column p-3 text-white sidebar-admin" 
             style={{ width: '250px', backgroundColor: '#161616ff', minHeight: '100vh', flexShrink: 0 }}>
            
            {/* Logo y link a la página principal */}
            <Link className="navbar-brand brand neon active text-decoration-none text-light mb-4 text-center fs-5 fw-bold" to="/" style={{ display: 'block' }}>
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
                            style={({ isActive }) => 
                                isActive && item.name === 'Dashboard' ? { backgroundColor: '#007bff', borderRadius: '5px' } : {}
                            }
                        >
                            <i className={`me-3 ${item.icon}`}></i>
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Sección Perfil y Botones Inferiores */}
            <div className="mt-auto pt-3"> 
                <p className="text-uppercase text-secondary small fw-bold mb-2">
                    <i className="fas fa-user-circle me-2"></i> Perfil
                </p>
                <button className="btn w-100 mb-2 text-start" 
                        style={{ backgroundColor: '#000000', color: '#fff', border: 'none' }}>
                    <i className="fas fa-store me-3"></i>
                    Tienda
                </button>
                <button className="btn w-100 text-start" 
                        style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none' }}>
                    <i className="fas fa-sign-out-alt me-3"></i>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};
// --- Fin Componente Sidebar ---

// --- Componente de las Tarjetas de Contenido (DashboardContent) ---
const DashboardContent = () => {
    // ---------------------------------------------
    // 1. CÁLCULO DE MÉTRICAS (PRODUCTOS Y USUARIOS)
    // ---------------------------------------------
    const productosArray = productosD.productos;
    const totalProductos = productosArray.length; 
    const inventarioActual = productosArray.reduce((sum, producto) => sum + (producto.stock || 0), 0); 
    
    // ASUMO que usuariosD es un array de usuarios y que quieres el conteo total.
    const totalUsuarios = usuariosD.length; 
    const nuevosUsuariosEsteMes = 20; // Se mantiene fijo, ya que no hay información de fechas de registro en el JSON

    const formatNumber = (num) => num.toLocaleString('es-CL'); 

    // ---------------------------------------------
    // 2. DATOS PARA LAS TARJETAS (Actualizados con valores dinámicos)
    // ---------------------------------------------
    const metricCards = [
        { 
            title: 'Compras', 
            value: '1,234', 
            icon: 'fas fa-shopping-cart', 
            detail: 'Probabilidad de aumento: 20%', 
            color: '#007bff', 
            textColor: 'text-white' 
        },
        { 
            title: 'Productos', 
            value: formatNumber(totalProductos), // DINÁMICO: Total de productos
            icon: 'fas fa-box', 
            detail: `Inventario actual: ${formatNumber(inventarioActual)}`, // DINÁMICO: Stock total
            color: '#28a745', 
            textColor: 'text-white' 
        },
        { 
            title: 'Usuarios', 
            value: formatNumber(totalUsuarios), // DINÁMICO: Total de usuarios
            icon: 'fas fa-users', 
            detail: `Nuevos usuarios este mes: ${nuevosUsuariosEsteMes}`, 
            color: '#ffc107', 
            textColor: 'text-dark' 
        },
    ];

    const featureCardsTop = [
        { icon: 'fas fa-tachometer-alt', title: 'Dashboard', desc: 'Visión general de todas las métricas y estadísticas clave del sistema.' },
        { icon: 'fas fa-clipboard-list', title: 'Órdenes', desc: 'Gestión y seguimiento de todas las órdenes de compra realizadas.' },
        { icon: 'fas fa-cubes', title: 'Productos', desc: 'Administrar inventario y detalles de los productos disponibles.' },
        { icon: 'fas fa-tags', title: 'Categorías', desc: 'Organizar productos en categorías para facilitar su navegación.' },
    ];

    const featureCardsBottom = [
        { icon: 'fas fa-user-friends', title: 'Usuarios', desc: 'Gestión de cuentas de usuario y sus roles dentro del sistema.' },
        { icon: 'fas fa-file-alt', title: 'Reportes', desc: 'Generación de informes detallados sobre las operaciones del sistema.' },
        { icon: 'fas fa-user-circle', title: 'Perfil', desc: 'Administración de la información personal y configuraciones de cuenta.' },
        { icon: 'fas fa-store', title: 'Tienda', desc: 'Visualiza tu tienda en tiempo real, Visualiza los reportes de los usuarios.' },
    ];

    // Renderización de Tarjetas (MetricCard y FeatureCard)
    const MetricCard = ({ title, value, icon, detail, color, textColor }) => (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className={`card ${textColor} p-3 shadow-sm border-0 h-100`} style={{ backgroundColor: color }}>
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="card-title text-uppercase opacity-75">{title}</h5>
                            <h2 className="display-5 fw-bold my-1">{value}</h2>
                        </div>
                        <i className={`${icon} fa-3x opacity-50`}></i>
                    </div>
                    <p className="mt-2 mb-0 small opacity-75">{detail}</p>
                </div>
            </div>
        </div>
    );

    const FeatureCard = ({ title, icon, desc }) => (
        <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 text-center p-3 shadow-sm border-0 feature-card-style">
                <div className="card-body d-flex flex-column align-items-center">
                    <i className={`${icon} fa-3x mb-3 text-primary`}></i>
                    <h5 className="card-title fw-semibold">{title}</h5>
                    <p className="card-text text-muted small flex-grow-1">{desc}</p>
                </div>
            </div>
        </div>
    );

    return (
        // Color de fondo negro para el área de contenido principal, según tu última indicación.
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}> 
            
            <h1 className="text-light h4 mb-1">Dashboard</h1> {/* Título blanco sobre fondo negro */}
            <p className="text-muted mb-4">Resumen de las actividades diarias</p>

            <div className="row mb-4">
                {metricCards.map((card, index) => (<MetricCard key={index} {...card} />))}
            </div>

            <div className="row mb-3">
                {featureCardsTop.map((card, index) => (<FeatureCard key={`top-${index}`} {...card} />))}
            </div>

            <div className="row">
                {featureCardsBottom.map((card, index) => (<FeatureCard key={`bottom-${index}`} {...card} />))}
            </div>

            <Footer />
        </div>
    );
};
// --- Fin DashboardContent ---

// --- Componente Principal: NavbarAdmin ---
function NavbarAdmin() {
    return (
        <div className="d-flex admin-layout-container" style={{ minHeight: '100vh' }}>
            <Sidebar /> 
            <DashboardContent />
        </div>
    );
}

export default NavbarAdmin;