import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import usuariosD from "../data/usuarios.json"; 
import Historial from './Historial'; 

const LOCAL_STORAGE_KEY_USERS = 'usuarios_maestro';

// --- Carga de usuarios ---
const getAllUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USERS));
    if (storedUsers && storedUsers.length > 0) return storedUsers;

    const initialUsers = Array.isArray(usuariosD) ? usuariosD : [];
    const usersWithIds = initialUsers.map((u, index) => ({ 
        ...u, 
        id: u.id || `U${(index + 1).toString().padStart(3, '0')}` 
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(usersWithIds));
    return usersWithIds;
};

function TablaUsuarios() {
    
    const [usersArray, setUsersArray] = useState(getAllUsers());
    const [selectedUser, setSelectedUser] = useState(null); 

    // Función de borrado
    const handleDelete = (id, name) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${name}?`)) {
            const updatedUsers = usersArray.filter(u => u.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
            setUsersArray(updatedUsers);
        }
    };

    const handleViewHistory = (user) => { setSelectedUser(user); };
    const handleCloseModal = () => { setSelectedUser(null); };

    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Gestión de Usuarios</h1>
            <p className="text-muted mb-4">Listado, roles y gestión de cuentas de usuario.</p>

            {selectedUser && (
                <Historial
                    userId={selectedUser.id}
                    userName={`${selectedUser.nombre} ${selectedUser.apellido}`}
                    onClose={handleCloseModal}
                />
            )}

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
                        {usersArray.map((user) => {
                            
                            // --- VALIDACIÓN SOLO POR ROL ---
                            // Convertimos a minúsculas y quitamos espacios para evitar errores humanos
                            const rolNormalizado = String(user.rol || '').toLowerCase().trim();
                            const esAdmin = rolNormalizado === 'admin'; 

                            return (
                                <tr key={user.id}> 
                                    <th scope="row">{user.id}</th>
                                    <td>{user.nombre} {user.apellido}</td>
                                    <td>{user.rut}</td>
                                    <td>{user.email}</td>
                                    <td>{user.telefono}</td>
                                    <td>
                                        <span className={`badge bg-${esAdmin ? 'warning' : 'info'}`}>
                                            {user.rol || 'cliente'}
                                        </span>
                                    </td>
                                    <td>
                                        <i className={`fas fa-${user.esDuoc ? 'check-circle text-success' : 'times-circle text-danger'}`}></i>
                                    </td>
                                    
                                    <td>
                                        <Link 
                                            to={`/editaruser/${user.id}`}
                                            className="btn btn-sm btn-primary me-1"
                                            title="Editar Usuario"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Link>
                                        
                                        <button 
                                            onClick={() => handleViewHistory(user)} 
                                            className="btn btn-sm btn-info me-1"
                                            title="Ver Historial"
                                        >
                                            <i className="fas fa-history"></i>
                                        </button>
                                        
                                        {/* EL BOTÓN SOLO APARECE SI 'esAdmin' ES FALSO */}
                                        {!esAdmin && (
                                            <button 
                                                onClick={() => handleDelete(user.id, user.nombre)} 
                                                className="btn btn-sm btn-danger"
                                                title="Eliminar Usuario"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
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