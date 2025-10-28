// src/pages/Ordenes.jsx

import React, { useState, useEffect } from 'react';
import SidebarAdmin from "../components/SidebarAdmin"; 
import Footer from "../components/Footer"; 
import BoletaAdmin from "../components/BoletaAdmin"; // Importamos el nuevo componente
import historialD from "../data/historial.json"; 
import usuariosD from "../data/usuarios.json"; 

// --- Configuración Global ---
const SHIPPING_COST = 3000; // Costo de envío fijo
const LOCAL_STORAGE_KEY_USERS = 'usuarios_maestro';

// Función para obtener la lista maestra de usuarios
const getAllUsers = () => {
    const initialUsers = Array.isArray(usuariosD) ? usuariosD : usuariosD.usuarios || [];
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USERS));
    
    // Inicializar si es necesario
    if (!storedUsers || storedUsers.length === 0) {
        const usersWithIds = initialUsers.map((u, index) => ({ 
            ...u, 
            id: u.id || `U${(index + 1).toString().padStart(3, '0')}` 
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(usersWithIds));
        return usersWithIds;
    }
    return storedUsers;
};


// --- Componente de Contenido (Listado de Órdenes) ---
const OrdenesContent = () => {
    
    // Estado para guardar las órdenes combinadas con datos de usuario
    const [ordersWithUserData, setOrdersWithUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar y combinar datos al montar el componente
    useEffect(() => {
        const allUsers = getAllUsers();
        const allOrders = historialD || []; // Carga directa del JSON de historial

        // Combinar datos: buscar usuario para cada orden
        const combinedData = allOrders.map(order => {
            // Busca el usuario que coincide con el userId de la orden
            const user = allUsers.find(u => u.id === order.userId);
            
            // Retorna la orden original + datos del usuario
            return {
                ...order,
                usuarioNombreCompleto: user ? `${user.nombre} ${user.apellido}` : 'Usuario Desconocido',
                usuarioEmail: user ? user.email : 'N/A',
                usuarioTelefono: user ? user.telefono : 'N/A',
            };
        });

        setOrdersWithUserData(combinedData);
        setIsLoading(false);
    }, []);


    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Gestión de Órdenes</h1>
            <p className="text-muted mb-4">Listado de todas las órdenes de compra realizadas.</p>

            {/* Mostrar mensaje de carga o si no hay órdenes */}
            {isLoading ? (
                <p className="text-center text-secondary">Cargando órdenes...</p>
            ) : ordersWithUserData.length === 0 ? (
                <p className="text-center text-secondary">No hay órdenes registradas.</p>
            ) : (
                // Mapear y renderizar cada boleta
                ordersWithUserData.map((order) => (
                    <BoletaAdmin 
                        key={order.idTransaccion} 
                        order={order} 
                        shippingCost={SHIPPING_COST} 
                    />
                ))
            )}
            
            
        </div>
    );
}


function Ordenes() {
    return (
        <>
         <SidebarAdmin>
            <OrdenesContent />
         </SidebarAdmin>
         <Footer />
        </>
       

    );
}

export default Ordenes;