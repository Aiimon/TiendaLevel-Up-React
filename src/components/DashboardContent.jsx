// src/components/DashboardContent.jsx (CÓDIGO CORREGIDO Y LISTO)

import React, { useState, useEffect, useCallback } from 'react'; 
import { Link } from 'react-router-dom';

// ELIMINAMOS importaciones estáticas:
// import productosD from "../data/productos.json"; 
// import usuariosD from "../data/usuarios.json"; 

const API_BASE_URL = 'http://localhost:8080/v2'; 
const STOCK_CRITICO = 5;

// --- Componentes MetricCard y FeatureCard se mantienen iguales ---
const MetricCard = ({ title, value, icon, detail, color, textColor }) => (
    // ... (Tu implementación de MetricCard) ...
    <div className="col-lg-4 col-md-6 mb-4">
        {/* ... */}
    </div>
);
const FeatureCard = ({ title, id, icon, desc, path }) => {
    // ... (Tu implementación de FeatureCard) ...
    return (
        <Link to={path} className="col-lg-3 col-md-6 mb-4 text-decoration-none text-dark">
            {/* ... */}
        </Link>
    );
};
// --- Fin Componentes ---


function DashboardContent() {
    
    // 1. ESTADOS PARA ALMACENAR DATOS REALES DE LA API
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función de ayuda para formatear números
    const formatNumber = (num) => num.toLocaleString('es-CL'); 

    // 2. FUNCIÓN PARA OBTENER LOS DATOS (USANDO FETCH)
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Petición de Productos (GET: /v2/productos/todos)
            const productosResponse = await fetch(`${API_BASE_URL}/productos/todos`);
            
            // Petición de Usuarios (GET: /v2/usuarios/todos)
            const usuariosResponse = await fetch(`${API_BASE_URL}/usuarios/todos`); 
            
            if (!productosResponse.ok || !usuariosResponse.ok) {
                throw new Error("Error al obtener datos de la API.");
            }
            
            const productosData = await productosResponse.json();
            const usuariosData = await usuariosResponse.json();
            
            setProductos(productosData);
            setUsuarios(usuariosData);
            
        } catch (err) {
            console.error("Error al cargar datos del dashboard:", err);
            setError("No se pudo conectar a la API para cargar las métricas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // 3. CÁLCULO DE MÉTRICAS USANDO EL ESTADO (Datos de la API)
    const totalProductos = productos.length; 
    const inventarioActual = productos.reduce((sum, p) => sum + (p.stock || p.STOCK || 0), 0); 
    const totalUsuarios = usuarios.length; 
    
    // Este dato (nuevos usuarios) requiere un endpoint específico que no tenemos, lo dejamos mock
    const nuevosUsuariosEsteMes = 120; 

    // FILTRAR PRODUCTOS EN STOCK CRÍTICO (usando datos de la API)
    const productosCriticos = productos.filter(p => (p.stock || p.STOCK) <= STOCK_CRITICO);
    
    // 4. DATOS PARA LAS TARJETAS (Usando las nuevas métricas)
    const metricCards = [
        // 'Compras' requiere un endpoint de ventas/boletas (lo dejamos mock)
        { title: 'Compras', value: '1,234', icon: 'fas fa-shopping-cart', detail: 'Probabilidad de aumento: 20%', color: '#39FF14', textColor: 'text-black' },
        { 
            title: 'Productos', 
            value: formatNumber(totalProductos), 
            icon: 'fas fa-box', 
            detail: `Inventario actual: ${formatNumber(inventarioActual)}`, 
            color: '#1E90FF', 
            textColor: 'text-black' 
        },
        { 
            title: 'Usuarios', 
            value: formatNumber(totalUsuarios), 
            icon: 'fas fa-users', 
            detail: `Nuevos usuarios este mes: ${nuevosUsuariosEsteMes}`, 
            color: '#39FF14', 
            textColor: 'text-black' 
        },
    ];

    // ... (featureCardsTop y featureCardsBottom se mantienen iguales) ...
    const featureCardsTop = [
        { title: 'Dashboard', id: 'feature-dashboard-top', icon: 'fas fa-tachometer-alt', path: '/adminhome', desc: 'Visión general de todas las métricas y estadísticas clave del sistema.' },
        { title: 'Órdenes', id: 'feature-ordenes-top', icon: 'fas fa-clipboard-list', path: '/adminhome/ordenes', desc: 'Gestión y seguimiento de todas las órdenes de compra realizadas.' },
        { title: 'Productos', id: 'feature-productos-top', icon: 'fas fa-cubes', path: '/adminhome/productosadmin', desc: 'Administrar inventario y detalles de los productos disponibles.' },
        { title: 'Categorías', id: 'feature-categorias-top', icon: 'fas fa-tags', path: '/adminhome/categoria_admin', desc: 'Organizar productos en categorías para facilitar su navegación.' },
    ];
    const featureCardsBottom = [/* ... */];


    // 5. RENDERIZADO
    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}> 
            
            {/* La notificación se gestiona en SidebarAdmin, pero si quieres la local: */}
            {/* <StockNotification products={productosCriticos} /> */}
            
            <h1 className="text-light h4 mb-1">Dashboard</h1>
            <p className="text-muted mb-4">Resumen de las actividades diarias</p>

            {loading && <div className="text-center text-warning p-4"><i className="fas fa-spinner fa-spin me-2"></i> Cargando métricas desde la API...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Solo mostramos las tarjetas si no hay error y ya cargó o tiene datos */}
            {!loading && !error && (
                <>
                    <div className="row mb-4">
                        {metricCards.map((card, index) => (<MetricCard key={index} {...card} />))}
                    </div>

                    <div className="row mb-3">
                        {featureCardsTop.map((card, index) => (<FeatureCard key={`top-${index}`} {...card} />))}
                    </div>

                    <div className="row">
                        {featureCardsBottom.map((card, index) => (<FeatureCard key={`bottom-${index}`} {...card} />))}
                    </div>
                </>
            )}
            
        </div>
    );
}

export default DashboardContent;