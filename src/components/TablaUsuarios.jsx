import React, { useState, useEffect, useCallback } from 'react'; // 🛑 AÑADIMOS hooks
import { Link } from 'react-router-dom'; 
// ELIMINAMOS DATOS ESTÁTICOS Y LÓGICA OBSOLETA:
// import usuariosD from "../data/usuarios.json"; 
// const LOCAL_STORAGE_KEY_USERS = 'usuarios_maestro';
// const getAllUsers = () => { /* ... */ };

import Historial from './Historial'; 

const API_BASE_URL = 'http://localhost:8080/v2/usuarios'; // URL base de usuarios

function TablaUsuarios() {
    
    // 1. Estados para la data de la API
    const [usersArray, setUsersArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null); 

    // 2. Función de Carga de Datos (READ ALL)
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/todos`); // GET: /v2/usuarios/todos
            
            if (!response.ok) {
                throw new Error("Error al cargar los usuarios desde la API.");
            }
            
            const data = await response.json();
            
            // Asignamos el ID, esperando que el backend devuelva usuarioId, USUARIO_ID o id
            setUsersArray(data.map(u => ({ ...u, id: u.usuarioId || u.USUARIO_ID || u.id }))); 
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
            setError("No se pudo conectar al servidor para obtener la lista de usuarios.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Ejecutar la carga al montar el componente
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    // Función de borrado (DELETE con API)
    const handleDelete = async (id, name) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${name} (ID: ${id})? Esta acción afectará la base de datos SQL.`)) {
            try {
                // DELETE: /v2/usuarios/eliminar/id/{usuarioId}
                const response = await fetch(`${API_BASE_URL}/eliminar/id/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "No se pudo eliminar al usuario. Verifique el servidor.");
                }

                // Actualizar el estado local para reflejar el borrado
                setUsersArray(prevUsers => prevUsers.filter(u => u.id !== id));
                alert(`Usuario ${name} eliminado exitosamente.`);

            } catch (err) {
                console.error("Error eliminando usuario:", err);
                alert(`Error al eliminar usuario: ${err.message}`);
            }
        }
    };

    const handleViewHistory = (user) => { setSelectedUser(user); };
    const handleCloseModal = () => { setSelectedUser(null); };

    return (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Gestión de Usuarios</h1>
            <p className="text-muted mb-4">Listado, roles y gestión de cuentas de usuario.</p>

            {/* Manejo de estados de carga y error */}
            {loading && <p className="text-warning"><i className="fas fa-spinner fa-spin me-2"></i> Cargando usuarios desde la base de datos...</p>}
            {error && <p className="alert alert-danger">{error}</p>}

            {selectedUser && (
                <Historial
                    userId={selectedUser.id}
                    // Usamos nombre y apellido (o NOMBRE y APELLIDO)
                    userName={`${selectedUser.nombre || selectedUser.NOMBRE} ${selectedUser.apellido || selectedUser.APELLIDO}`}
                    onClose={handleCloseModal}
                />
            )}

            {/* Solo mostramos la tabla si no está cargando y no hay error */}
            {!loading && !error && (
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
                            // Usamos las propiedades que la API devuelve (ej: nombre, ROL)
                            const rolNormalizado = String(user.rol || user.ROL || '').toLowerCase().trim();
                            const esAdmin = rolNormalizado === 'admin'; 

                            return (
                                <tr key={user.id}> 
                                    <th scope="row">{user.id}</th>
                                    <td>{user.nombre || user.NOMBRE} {user.apellido || user.APELLIDO}</td>
                                    <td>{user.rut || user.RUT}</td>
                                    <td>{user.email || user.EMAIL}</td>
                                    <td>{user.telefono || user.TELEFONO}</td>
                                    <td>
                                        <span className={`badge bg-${esAdmin ? 'warning' : 'info'}`}>
                                            {user.rol || user.ROL || 'cliente'}
                                        </span>
                                    </td>
                                    <td>
                                        <i className={`fas fa-${(user.esDuoc || user.ESDUOC) ? 'check-circle text-success' : 'times-circle text-danger'}`}></i>
                                    </td>
                                    
                                    <td>
                                        {/* Link a editar: Usamos la ruta anidada correcta: /adminhome/usuariosadmin/editar/{id} */}
                                        <Link 
                                            to={`/adminhome/usuariosadmin/editar/${user.id}`}
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
                                        
                                        {/* Botón Eliminar: Llama a la API DELETE */}
                                        {!esAdmin && (
                                            <button 
                                                onClick={() => handleDelete(user.id, user.nombre || user.NOMBRE)} 
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
                {usersArray.length === 0 && !loading && (
                    <p className="text-center text-muted p-3">
                        No hay usuarios registrados.
                    </p>
                )}
            </div>
            )}
        </div>
    );
}

export default TablaUsuarios;