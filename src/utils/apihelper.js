const API = `http://localhost:8082/api/usuarios`;

export const saveBaseDatos = async (data) => {
    try {
        const resp = await fetch(`${API}/crear`, {
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

export const getUsuarios = async () => {
    try {
        const resp = await fetch(`${API}/todos`);
        if (!resp.ok) throw new Error("Error al obtener usuarios");
        return await resp.json();
    } catch (error) {
        console.error("Error: ", error);
    }
};

export const getUsuarioPorNombre = async (nombre) => {
    try {
        const resp = await fetch(`${API}/buscar/nombre/${nombre}`);
        if (!resp.ok) throw new Error("Error al obtener usuario");
        return await resp.json();
    } catch (error) {
        console.error("Error: ", error);
    }
};

export const updateUsuario = async (data) => {
    try {
        const resp = await fetch(`${API}/actualizar`, {
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

export const deleteUsuario = async (usuarioId) => {
    try {
        const resp = await fetch(`${API}/eliminar/${usuarioId}`, {
            method: "DELETE"
        });
        if (!resp.ok) throw new Error("Error al eliminar usuario");
        return true;
    } catch (error) {
        console.error("Error:", error);
    }
};
