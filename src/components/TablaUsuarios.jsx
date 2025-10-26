// src/components/TablaUsuarios.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usuariosD from "../data/usuarios.json"; // <-- JSON IMPORTADO
import Historial from './Historial'; 

// Clave para manejar los usuarios persistentes en localStorage
const LOCAL_STORAGE_KEY_USERS = 'usuarios_maestro';

// Función para obtener todos los usuarios (JSON inicial + localStorage)
const getAllUsers = () => {
    // 1. OBTENER LA LISTA DEL JSON INICIAL: Ahora accedemos a 'usuariosD' directamente, asumiendo que es el array.
    const initialUsers = Array.isArray(usuariosD) ? usuariosD : [];
    
    // 2. Obtener la lista guardada en localStorage
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USERS));
    
    // 3. Inicializar el localStorage si está vacío, usando la data del JSON.
    if (!storedUsers || storedUsers.length === 0) {
        // Asignamos IDs temporales U001, U002... a los usuarios del JSON si no tienen
        const usersWithIds = initialUsers.map((u, index) => ({ 
            ...u, 
            id: u.id || `U${(index + 1).toString().padStart(3, '0')}` 
        }));
        
        localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(usersWithIds));
        return usersWithIds;
    }
    
    // Si ya hay datos en localStorage, los devolvemos.
    return storedUsers;
};


function TablaUsuarios() {
    
    // El estado usa la lista maestra cargada con el JSON inicial
    const [usersArray, setUsersArray] = useState(getAllUsers());
    const [selectedUser, setSelectedUser] = useState(null); 
    
    // Lógica para Borrar Usuario
    const handleDelete = (id, name) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${name} (ID: ${id})?`)) {
            const updatedUsers = usersArray.filter(u => u.id !== id);
            
            // Actualizar localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
            
            // Actualizar el estado local para refrescar la tabla
            setUsersArray(updatedUsers);
        }
    };

    const handleEdit = (id) => {
        console.log(`Navegando a edición del usuario ID ${id} (simulado).`);
    };

    const handleViewHistory = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };


    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Gestión de Usuarios</h1>
            <p className="text-muted mb-4">Listado, roles y gestión de cuentas de usuario.</p>

            {/* Modal de Historial */}
            {selectedUser && (
                <Historial
                    userId={selectedUser.id}
                    userName={`${selectedUser.nombre} ${selectedUser.apellido}`}
                    onClose={handleCloseModal}
                />
            )}

            {/* Tabla de Listado de Usuarios */}
            <div className="table-responsive" style={{ backgroundColor: '#212529', borderRadius: '8px', padding: '10px' }}>
                <table className="table table-dark table-striped table-hover align-middle" style={{ backgroundColor: 'transparent' }}>
                    
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre Completo</th>
                            <th scope="col">RUT</th>
                            <th scope="col">Email</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Duoc</th>
                            <th scope="col" style={{ width: '150px' }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usersArray.map((user) => (
                            // La clave de React DEBE ser user.id
                            <tr key={user.id}> 
                                <th scope="row">{user.id}</th>
                                <td>{user.nombre} {user.apellido}</td>
                                <td>{user.rut}</td>
                                <td>{user.email}</td>
                                <td>{user.telefono}</td>
                                <td>
                                    <span className={`badge bg-${user.rol === 'admin' ? 'warning' : 'info'}`}>
                                        {user.rol || 'cliente'}
                                    </span>
                                </td>
                                <td>
                                    {/* Muestra el estado booleano de esDuoc */}
                                    <i className={`fas fa-${user.esDuoc ? 'check-circle text-success' : 'times-circle text-danger'}`}></i>
                                </td>
                                
                                {/* Columna de Acciones */}
                                <td>
                                    {/* 1. Editar */}
                                    <button 
                                        onClick={() => handleEdit(user.id)} 
                                        className="btn btn-sm btn-primary me-1"
                                        title="Editar Usuario"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    
                                    {/* 2. Ver Historial de Compras */}
                                    <button 
                                        onClick={() => handleViewHistory(user)} 
                                        className="btn btn-sm btn-info me-1"
                                        title="Ver Historial de Compras"
                                    >
                                        <i className="fas fa-history"></i>
                                    </button>
                                    
                                    {/* 3. Eliminar */}
                                    <button 
                                        onClick={() => handleDelete(user.id, user.nombre)} 
                                        className="btn btn-sm btn-danger"
                                        title="Eliminar Usuario"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usersArray.length === 0 && (
                    <p className="text-center text-muted p-3">
                        No hay usuarios registrados.
                    </p>
                )}
            </div>
            
          
        </div>
    );
}

export default TablaUsuarios;