// src/components/DashboardContent.jsx (CÓDIGO CON PUERTO CORREGIDO)

import React, { useState, useEffect, useCallback } from 'react'; 
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8082/v2'; // ✅ PUERTO CORREGIDO A 8082
const STOCK_CRITICO = 5;

// --- Componentes MetricCard y FeatureCard se mantienen iguales ---
const MetricCard = ({ title, value, icon, detail, color, textColor }) => (/* ... */ <div className="col-lg-4 col-md-6 mb-4">{/* ...*/}</div>);
const FeatureCard = ({ title, id, icon, desc, path }) => (/* ... */ <Link to={path} className="col-lg-3 col-md-6 mb-4 text-decoration-none text-dark">{/* ...*/}</Link>);
// --- Fin Componentes ---

function DashboardContent() {
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatNumber = (num) => num.toLocaleString('es-CL'); 

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Petición de Productos (GET: /v2/productos/todos) al puerto 8082
            const productosResponse = await fetch(`${API_BASE_URL}/productos/todos`);
            // Petición de Usuarios (GET: /v2/usuarios/todos) al puerto 8082
            const usuariosResponse = await fetch(`${API_BASE_URL}/usuarios/todos`); 
            
            if (!productosResponse.ok || !usuariosResponse.ok) {
                // Si la conexión funciona, pero el servidor devuelve un error de lógica (404, 500)
                throw new Error("Error al obtener datos de la API. Verifique los logs del servidor.");
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

    useEffect(() => { fetchData(); }, [fetchData]);

    // Cálculo de métricas
    const totalProductos = productos.length; 
    const inventarioActual = productos.reduce((sum, p) => sum + (p.stock || p.STOCK || 0), 0); 
    const totalUsuarios = usuarios.length; 
    const nuevosUsuariosEsteMes = 120; // MOCK data, ya que requiere un endpoint específico

    // Datos para las tarjetas (usando la data real)
    const metricCards = [
        { title: 'Compras', value: '1,234', icon: 'fas fa-shopping-cart', detail: 'Probabilidad de aumento: 20%', color: '#39FF14', textColor: 'text-black' },
        { title: 'Productos', value: formatNumber(totalProductos), icon: 'fas fa-box', detail: `Inventario actual: ${formatNumber(inventarioActual)}`, color: '#1E90FF', textColor: 'text-black' },
        { title: 'Usuarios', value: formatNumber(totalUsuarios), icon: 'fas fa-users', detail: `Nuevos usuarios este mes: ${nuevosUsuariosEsteMes}`, color: '#39FF14', textColor: 'text-black' },
    ];
    // Las featureCards deben usar las rutas anidadas correctas
    const featureCardsTop = [
        { title: 'Dashboard', id: 'feature-dashboard-top', icon: 'fas fa-tachometer-alt', path: '/homeadmin', desc: 'Visión general de todas las métricas y estadísticas clave del sistema.' },
        // ... (el resto de paths usan /homeadmin/ruta)
    ];


    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}> 
            
            <h1 className="text-light h4 mb-1">Dashboard</h1>
            <p className="text-muted mb-4">Resumen de las actividades diarias</p>

            {loading && <div className="text-center text-warning p-4"><i className="fas fa-spinner fa-spin me-2"></i> Cargando métricas desde la API...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {!loading && !error && (
                <>
                    <div className="row mb-4">
                        {metricCards.map((card, index) => (<MetricCard key={index} {...card} />))}
                    </div>
                    {/* ... (renderizado de featureCards) ... */}
                </>
            )}
        </div>
    );
}

export default DashboardContent;