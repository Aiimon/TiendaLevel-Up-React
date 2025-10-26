// src/pages/Perfiladmin.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from "../components/SidebarAdmin"; 
import Footer from "../components/Footer"; 
import usuariosD from "../data/usuarios.json"; 
import Notiadmn from '../components/Notiadmn';

// Clave para manejar los usuarios persistentes en localStorage
const LOCAL_STORAGE_KEY_USERS = 'usuarios_maestro';

// Función para obtener la data del usuario actual (el primer admin del JSON/localStorage)
const getCurrentAdminData = () => {
    // 1. Obtener la lista maestra del localStorage (inicializada previamente)
    const masterUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USERS)) || [];
    
    // 2. Si no hay nada en localStorage, usamos el JSON original.
    const usersSource = masterUsers.length > 0 ? masterUsers : (Array.isArray(usuariosD) ? usuariosD : usuariosD.usuarios || []);

    // 3. Buscamos al primer usuario con rol 'admin' (o el primer usuario de la lista si no hay roles)
    const adminUser = usersSource.find(u => u.rol && u.rol.toLowerCase() === 'admin') || usersSource[0];
    
    // Si no se encontró ningún usuario, devolvemos un objeto vacío para evitar errores
    return adminUser || {};
};


function Perfiladmin() {
    
    const adminData = getCurrentAdminData();

    // Función para formatear el RUT (ej: 12345678K -> 12.345.678-K)
    const formatRut = (rut) => {
        if (!rut) return 'N/A';
        const rutSanitized = String(rut).replace(/[^0-9kK]/g, "");
        if (rutSanitized.length < 2) return rutSanitized;
        
        const dv = rutSanitized.slice(-1).toUpperCase();
        const body = rutSanitized.slice(0, -1);
        
        return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + dv;
    };
    
    // Función para determinar el estilo del rol
    const getRoleBadge = (rol) => {
        let color = 'bg-info';
        if (rol && rol.toLowerCase() === 'admin') color = 'bg-warning text-dark';
        if (rol && rol.toLowerCase() === 'editor') color = 'bg-primary';
        return <span className={`badge ${color}`}>{rol ? rol.toUpperCase() : 'USUARIO'}</span>;
    };
    
    const PerfilContent = () => (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Mi Perfil</h1>
            <p className="text-muted mb-4">Información y configuraciones de la cuenta de administrador.</p>

            {/* Tarjeta de Información del Perfil */}
            <div className="p-4" style={{ backgroundColor: '#212529', borderRadius: '8px', color: 'white', maxWidth: '800px' }}>
                
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary">
                    <i className="fas fa-user-circle fa-4x me-4 text-primary"></i>
                    <div>
                        <h3 className="mb-0 text-light">{adminData.nombre} {adminData.apellido}</h3>
                        <p className="text-muted mb-0">{adminData.email}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <h5 className="text-primary mb-3">Detalles de la Cuenta</h5>
                        <p><strong>Rol:</strong> {getRoleBadge(adminData.rol)}</p>
                        <p><strong>RUT:</strong> {formatRut(adminData.rut)}</p>
                        <p><strong>Email:</strong> {adminData.email || 'N/A'}</p>
                        <p><strong>Contraseña:</strong> *********</p>
                    </div>
                    <div className="col-md-6">
                        <h5 className="text-primary mb-3">Detalles Adicionales</h5>
                        <p><strong>Teléfono:</strong> {adminData.telefono || 'N/A'}</p>
                        <p><strong>Fecha Nac.:</strong> {adminData.fecha || 'N/A'}</p>
                        <p><strong>Región:</strong> {adminData.region || 'N/A'}</p>
                        <p><strong>Comuna:</strong> {adminData.comuna || 'N/A'}</p>
                        <p>
                            <strong>Duoc UC:</strong> 
                            <span className={adminData.esDuoc ? 'text-success' : 'text-danger'}>
                                {adminData.esDuoc ? ' Sí (Verificado)' : ' No'}
                            </span>
                        </p>
                    </div>
                </div>

                <hr className="text-secondary mt-3 mb-4" />

                {/* Opción de Editar (Abajo) */}
                <div className="text-end">
                    <Link to="/perfiladmin/editar" className="btn btn-warning fw-bold">
                        <i className="fas fa-edit me-2"></i> EDITAR PERFIL
                    </Link>
                </div>
            </div>
            
            {/* El Footer se renderiza al final del contenido */}
            
        </div>
    );

    return (
      <>
        <SidebarAdmin>
            <PerfilContent />
            <Notiadmn />
        </SidebarAdmin>
        <Footer />
     </>
    );
}

export default Perfiladmin;