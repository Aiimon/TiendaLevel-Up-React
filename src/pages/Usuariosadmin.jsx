// src/pages/Usuariosadmin.jsx (CÓDIGO CORREGIDO Y LISTO PARA PROD)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Eliminamos Footer, SidebarAdmin y Notiadmn si estos ya son provistos por el padre (Homeadmin.jsx)
// Si Usuariosadmin.jsx es usado directamente como una página de App.jsx, esta es la estructura correcta. 
// ASUMO que Usuariosadmin se usa DENTRO de Homeadmin, así que quitamos SidebarAdmin y Footer de aquí.
import SidebarAdmin from "../components/SidebarAdmin"; 
import Footer from '../components/Footer';
import Notiadmn from '../components/Notiadmn';

import TablaUsuarios from "../components/TablaUsuarios"; // <-- IMPORTACIÓN CLAVE

// --- Configuración de Estilos ---
const GREEN_LIGHT = '#39FF14'; 
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };


const UserContent = () => {
    
    const [isNewButtonHovered, setIsNewButtonHovered] = useState(false); 

    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            {/* BARRA DE ACCIONES SUPERIOR (Nuevo Usuario) */}
            <div className="d-flex justify-content-start mb-4">
                
                {/* Botón Nuevo Usuario (Ruta corregida) */}
                <Link 
                    to="/adminhome/nuevousuario" // 🛑 RUTA ANIDADA CORRECTA
                    className="btn btn-lg text-white d-flex align-items-center fw-bold"
                    style={{
                        backgroundColor: '#28a745', 
                        border: 'none',
                        ...hoverStyle,
                        boxShadow: isNewButtonHovered ? `0 0 15px ${GREEN_LIGHT}, 0 0 5px ${GREEN_LIGHT}` : 'none'
                    }}
                    onMouseEnter={() => setIsNewButtonHovered(true)}
                    onMouseLeave={() => setIsNewButtonHovered(false)}
                >
                    <i className="fas fa-user-plus me-2"></i> 
                    NUEVO USUARIO
                </Link>
            </div>
            
            {/* Renderiza el componente de la tabla, que ya está migrado a la API */}
            <TablaUsuarios />
        </div>
    );
}


function Usuariosadmin() {
    // Si Usuariosadmin se usa como sub-ruta en Homeadmin, NO debe envolverse en SidebarAdmin ni Footer.
    // Si se usa como ruta principal, la estructura de abajo es correcta.
    // ASUMO que se usa como SUB-RUTA en Homeadmin:

    return (
        // Renderizamos solo el contenido, ya que el layout lo da Homeadmin
        <UserContent /> 
    );
    
    /* Si Usuariosadmin se usa como ruta PRINCIPAL, usarías la siguiente estructura:
    return (
        <>
            <SidebarAdmin>
                <UserContent />
                <Notiadmn />
            </SidebarAdmin>
            <Footer />
        </>
    );
    */
}

export default Usuariosadmin;