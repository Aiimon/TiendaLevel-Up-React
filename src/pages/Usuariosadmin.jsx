// src/pages/Usuariosadmin.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from "../components/SidebarAdmin"; 
import TablaUsuarios from "../components/TablaUsuarios"; // <-- IMPORTACIÓN CLAVE
import Footer from '../components/Footer';

// --- Configuración de Estilos ---
const GREEN_LIGHT = '#39FF14'; 
const hoverStyle = { transition: 'box-shadow 0.3s ease-in-out' };


const UserContent = () => {
    
    const [isNewButtonHovered, setIsNewButtonHovered] = useState(false); 

    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            {/* BARRA DE ACCIONES SUPERIOR (Nuevo Usuario) */}
            <div className="d-flex justify-content-start mb-4">
                
                {/* Botón Nuevo Usuario (con efecto neon verde) */}
                <Link 
                    to="/nuevousuario"
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
            
            {/* Renderiza el componente de la tabla, que ya incluye el encabezado y el footer */}
            <TablaUsuarios />
        </div>
    );
}


function Usuariosadmin() {
    return (
        <>
            <SidebarAdmin>
            <UserContent />
            </SidebarAdmin>
            <Footer />
        </>
        
    );
}

export default Usuariosadmin;