// src/components/DashboardContent.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import productosD from "../data/productos.json"; 
import usuariosD from "../data/usuarios.json"; 
// Importamos la notificación y la constante de stock desde el archivo Layout
import { StockNotification } from './SidebarAdmin'; 

// --- Configuración Global y Estilos ---
const BLUE_LIGHT = '#1E90FF';
const GREEN_LIGHT = '#39FF14';
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };
const STOCK_CRITICO = 5;

// --- Componente: Tarjeta de Métrica (Fila Superior) ---
// Definida fuera de DashboardContent para evitar errores de renderizado.
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

// --- Componente: Tarjeta de Feature (Fila Inferior - Con Hover) ---
// Definida fuera de DashboardContent.
const FeatureCard = ({ title, id, icon, desc, path }) => {
    const [isHovered, setIsHovered] = useState(false); // Estado local para el hover
    
    return (
        <Link to={path} className="col-lg-3 col-md-6 mb-4 text-decoration-none text-dark">
            <div 
                className="card h-100 text-center p-3 shadow-sm border-0 feature-card-style"
                style={{
                    ...hoverStyle,
                    boxShadow: isHovered ? `0 0 10px ${GREEN_LIGHT}` : 'none'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="card-body d-flex flex-column align-items-center">
                    <i className={`${icon} fa-3x mb-3 text-primary`}></i>
                    <h5 className="card-title fw-semibold">{title}</h5>
                    <p className="card-text text-muted small flex-grow-1">{desc}</p>
                </div>
            </div>
        </Link>
    );
};


function DashboardContent() {
    // 1. CÁLCULO DE MÉTRICAS
    const productosArray = productosD.productos;
    const totalProductos = productosArray.length; 
    const inventarioActual = productosArray.reduce((sum, producto) => sum + (producto.stock || 0), 0); 
    const totalUsuarios = usuariosD.length; 
    const nuevosUsuariosEsteMes = 120; 
    const formatNumber = (num) => num.toLocaleString('es-CL'); 

    // FILTRAR PRODUCTOS EN STOCK CRÍTICO
    const productosCriticos = productosArray.filter(p => p.stock <= STOCK_CRITICO);
    
    // 2. DATOS PARA LAS TARJETAS
    const metricCards = [
        { title: 'Compras', value: '1,234', icon: 'fas fa-shopping-cart', detail: 'Probabilidad de aumento: 20%', color: '#39FF14', textColor: 'text-black' },
        { title: 'Productos', value: formatNumber(totalProductos), icon: 'fas fa-box', detail: `Inventario actual: ${formatNumber(inventarioActual)}`, color: '#1E90FF', textColor: 'text-black' },
        { title: 'Usuarios', value: formatNumber(totalUsuarios), icon: 'fas fa-users', detail: `Nuevos usuarios este mes: ${nuevosUsuariosEsteMes}`, color: '#39FF14', textColor: 'text-black' },
    ];

    const featureCardsTop = [
        { title: 'Dashboard', id: 'feature-dashboard-top', icon: 'fas fa-tachometer-alt', path: '/homeadmin', desc: 'Visión general de todas las métricas y estadísticas clave del sistema.' },
        { title: 'Órdenes', id: 'feature-ordenes-top', icon: 'fas fa-clipboard-list', path: '/ordenes', desc: 'Gestión y seguimiento de todas las órdenes de compra realizadas.' },
        { title: 'Productos', id: 'feature-productos-top', icon: 'fas fa-cubes', path: '/productosadmin', desc: 'Administrar inventario y detalles de los productos disponibles.' },
        { title: 'Categorías', id: 'feature-categorias-top', icon: 'fas fa-tags', path: '/categoria_admin', desc: 'Organizar productos en categorías para facilitar su navegación.' },
    ];

    const featureCardsBottom = [
        { title: 'Usuarios', id: 'feature-usuarios-bottom', icon: 'fas fa-user-friends', path: '/usuariosadmin', desc: 'Gestión de cuentas de usuario y sus roles dentro del sistema.' },
        { title: 'Reportes', id: 'feature-reportes-bottom', icon: 'fas fa-file-alt', path: '/reporte', desc: 'Generación de informes detallados sobre las operaciones del sistema.' },
        { title: 'Perfil', id: 'feature-perfil-bottom', icon: 'fas fa-user-circle', path: '/perfiladmin', desc: 'Administración de la información personal y configuraciones de cuenta.' },
        { title: 'Tienda', id: 'feature-tienda-bottom', icon: 'fas fa-store', path: '/', desc: 'Visualiza tu tienda en tiempo real, Visualiza los reportes de los usuarios.' },
    ];


    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}> 
            
            {/* NOTIFICACIÓN */}
            <StockNotification products={productosCriticos} />
            
            <h1 className="text-light h4 mb-1">Dashboard</h1>
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
}

export default DashboardContent;