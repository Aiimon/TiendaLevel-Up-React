const API_USUARIOS = `http://localhost:8082/v1/usuarios`;
const API_PRODUCTOS = "http://localhost:8082/v1/productos";
const API_CATEGORIAS = "http://localhost:8082/v1/categorias";

// Crear un usuario
export const saveBaseDatos = async (data) => {
    try {
        const resp = await fetch(`${API_USUARIOS}/crear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error("Error al guardar usuario");
        return await resp.json(); // devuelve el usuario creado
    } catch (error) {
        console.error("Error al guardar: ", error);
    }
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
    try {
        const resp = await fetch(`${API_USUARIOS}/todos`);
        if (!resp.ok) throw new Error("Error al obtener usuarios");
        return await resp.json();
    } catch (error) {
        console.error("Error: ", error);
    }
};

// Obtener usuario por nombre
export const getUsuarioPorNombre = async (nombre) => {
    try {
        const resp = await fetch(`${API_USUARIOS}/buscar/nombre/${nombre}`);
        if (!resp.ok) throw new Error("Error al obtener usuario");
        return await resp.json();
    } catch (error) {
        console.error("Error: ", error);
    }
};

// Actualizar usuario
export const updateUsuario = async (data) => {
    try {
        const resp = await fetch(`${API_USUARIOS}/actualizar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error("Error al actualizar usuario");
        return await resp.json();
    } catch (error) {
        console.error("Error:", error);
    }
};

// Eliminar usuario por ID
export const deleteUsuario = async (usuarioId) => {
    try {
        const resp = await fetch(`${API_USUARIOS}/eliminar/id/${usuarioId}`, {
            method: "DELETE"
        });
        if (!resp.ok) throw new Error("Error al eliminar usuario");
        return true;
    } catch (error) {
        console.error("Error:", error);
    }
};
