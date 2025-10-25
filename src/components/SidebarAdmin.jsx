import { NavLink, Link } from 'react-router-dom'; // <--- 1. IMPORTAR LINK
import productosD from "../../../src/data/productos.json";


// --- Componente Sidebar ---
const Sidebar = () => {
    const navItems = [
      
        { name: 'Dashboard', path: '/homeadmin' }, 
        { name: 'Órdenes', path: '/ordenesadmin' },
        { name: 'Productos', path: '/productosadmin' },
        { name: 'Categorías', path: '/categoriasadmin' },
        { name: 'Usuarios', path: '/usuariosadmin' },
        { name: 'Reportes', path: '/reportesadmin' },
    ];

    return (
        // Fondo negro (oscuro) y estructura Flexbox vertical
        <div className="d-flex flex-column p-3 text-white sidebar-admin" 
             style={{ width: '250px', backgroundColor: '#161616ff', minHeight: '100vh', flexShrink: 0 }}>
            
            {/* 2. REEMPLAZO DE COMPANY NAME POR EL COMPONENTE LINK */}
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
                            // Estilo para el botón activo de Dashboard
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
    // Lógica de cálculo y renderizado de tarjetas (se mantiene igual)
    const productosArray = productosD.productos;
    const totalProductos = productosArray.length; 
    const inventarioActual = productosArray.reduce((sum, producto) => sum + (producto.stock || 0), 0); 
    const formatNumber = (num) => num.toLocaleString('es-CL'); 

    const metricCards = [
        { title: 'Compras', value: '1,234', icon: 'fas fa-shopping-cart', detail: 'Probabilidad de aumento: 20%', color: '#007bff', textColor: 'text-white' },
        { 
            title: 'Productos', 
            value: formatNumber(totalProductos), 
            icon: 'fas fa-box', 
            detail: `Inventario actual: ${formatNumber(inventarioActual)}`, 
            color: '#28a745', 
            textColor: 'text-white' 
        },
        { title: 'Usuarios', value: '890', icon: 'fas fa-users', detail: 'Nuevos usuarios este mes: 120', color: '#ffc107', textColor: 'text-dark' },
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
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}> 
            
            <h1 className="h4 mb-1">Dashboard</h1>
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