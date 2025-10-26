// src/components/Notiadmn.jsx

import React, { useState, useEffect } from 'react';
import productosD from "../data/productos.json"; 

// --- Configuración Global ---
const GREEN_NEON = '#39FF14';
const LOCAL_STORAGE_KEY_PRODUCTS = 'productos_maestro';

// Función para obtener los productos desde localStorage
const getCriticalProducts = () => {
    // Lee la lista maestra de productos (asumimos que ya fue inicializada)
    const allProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS)) || productosD.productos || [];

    // Filtra los productos donde stock <= stockCritico
    const criticalProducts = allProducts.filter(p => {
        // Aseguramos que ambas propiedades existan y sean números
        const stock = parseInt(p.stock, 10);
        const stockCritico = parseInt(p.stockCritico, 10) || 5; // Usamos 5 como fallback

        return !isNaN(stock) && !isNaN(stockCritico) && stock <= stockCritico;
    });

    return criticalProducts;
};


function Notiadmn() {
    // Estado para almacenar la lista de productos con stock crítico
    const [criticalList, setCriticalList] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    // Efecto para cargar los datos y verificar el stock al montar el componente
    useEffect(() => {
        const list = getCriticalProducts();
        setCriticalList(list);
        
        // Mostrar la notificación si hay productos críticos
        if (list.length > 0) {
            setIsVisible(true);
        }

        // Opcional: Recargar el estado periódicamente si el stock cambia en otra parte
        const interval = setInterval(() => {
            const updatedList = getCriticalProducts();
            setCriticalList(updatedList);
            setIsVisible(updatedList.length > 0);
        }, 30000); // Chequea cada 30 segundos

        return () => clearInterval(interval);
    }, []);

    if (!isVisible || criticalList.length === 0) {
        return null;
    }

    return (
        // Contenedor principal de la notificación (Posición Fija - Inferior Derecha)
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1050,
                backgroundColor: 'rgba(33, 37, 41, 0.9)', // Gris oscuro semi-transparente
                color: 'white',
                padding: '15px 20px',
                borderRadius: '10px',
                border: `2px solid ${GREEN_NEON}`, // Borde verde neón
                boxShadow: `0 0 10px ${GREEN_NEON}, 0 0 5px rgba(0, 0, 0, 0.5)`, // Efecto de luz
                maxWidth: '350px',
            }}
        >
            <h5 className="mb-2" style={{ color: GREEN_NEON }}>
                <i className="fas fa-exclamation-triangle me-2"></i> 
                ¡Alerta de Stock Crítico!
            </h5>
            
            <p className="text-muted small mb-2">
                Los siguientes productos han alcanzado su umbral crítico:
            </p>

            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {criticalList.map((p) => (
                    <div 
                        key={p.id} 
                        style={{ borderBottom: '1px dotted rgba(255, 255, 255, 0.1)', padding: '5px 0' }}
                    >
                        <strong className="text-light">
                            {p.nombre}
                        </strong>
                        <br />
                        <span style={{ fontSize: '0.8rem' }}>
                            ID: {p.id} | Stock Actual: {p.stock}
                        </span>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => setIsVisible(false)}
                className="btn btn-sm btn-outline-light mt-3 w-100"
                style={{ borderColor: GREEN_NEON, color: GREEN_NEON }}
            >
                Entendido
            </button>
        </div>
    );
}

export default Notiadmn;