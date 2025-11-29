// apihelper.js
//http://localhost:8082/swagger-ui/index.html
// Rutas relativas (Vite hará el proxy a localhost:8082)
const API_USUARIOS = `/v2/usuarios`;
const API_PRODUCTOS = `/v2/productos`;
const API_CATEGORIAS = `/v2/categorias`;

// Función helper para agregar headers de autenticación si existe token
const getHeaders = () => {
  const token = localStorage.getItem("token"); // token JWT si lo tienes
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ---------------- USUARIOS ---------------- //

// Crear un usuario
export const saveBaseDatos = async (data) => {
  try {
    const resp = await fetch(`${API_USUARIOS}/crear`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw new Error("Error al guardar usuario");
    return await resp.json();
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    throw error;
  }
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const resp = await fetch(`${API_USUARIOS}/todos`, {
      headers: getHeaders(),
    });
    if (!resp.ok) throw new Error("Error al obtener usuarios");
    return await resp.json();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Obtener usuario por email (login)
export const getUsuarioPorEmail = async (email) => {
  try {
    const resp = await fetch(`${API_USUARIOS}/buscar/email/${email}`, {
      headers: getHeaders(),
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch (error) {
    console.error("Error al obtener usuario por email:", error);
    return null;
  }
};

// Actualizar usuario
export const updateUsuario = async (data) => {
  try {
    const resp = await fetch(`${API_USUARIOS}/actualizar`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw new Error("Error al actualizar usuario");
    return await resp.json();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUsuario = async (usuarioId) => {
  try {
    const resp = await fetch(`${API_USUARIOS}/eliminar/id/${usuarioId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!resp.ok) throw new Error("Error al eliminar usuario");
    return true;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// ---------------- PRODUCTOS ---------------- //

export const crearProducto = async (data) => {
  const resp = await fetch(`${API_PRODUCTOS}/crear`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al crear producto");
};

export const getProductos = async () => {
  const resp = await fetch(`${API_PRODUCTOS}/todos`, {
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener productos");
};

export const getProductoPorId = async (id) => {
  const resp = await fetch(`${API_PRODUCTOS}/buscar/id/${id}`, {
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Producto no encontrado");
};

export const getProductoPorNombre = async (nombre) => {
  const resp = await fetch(`${API_PRODUCTOS}/buscar/nombre/${nombre}`, {
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Producto no encontrado");
};

export const updateProducto = async (id, data) => {
  const resp = await fetch(`${API_PRODUCTOS}/actualizar/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al actualizar producto");
};

export const deleteProducto = async (id) => {
  const resp = await fetch(`${API_PRODUCTOS}/eliminar/id/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return resp.ok ? true : Promise.reject("Error al eliminar producto");
};

// ---------------- CATEGORÍAS ---------------- //

export const crearCategoria = async (data) => {
  const resp = await fetch(`${API_CATEGORIAS}/crear`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al crear categoría");
};

export const getCategorias = async () => {
  const resp = await fetch(`${API_CATEGORIAS}/todas`, {
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener categorías");
};

export const getCategoriaPorId = async (id) => {
  const resp = await fetch(`${API_CATEGORIAS}/buscar/id/${id}`, {
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Categoría no encontrada");
};

export const getCategoriaPorNombre = async (nombre) => {
  const resp = await fetch(`${API_CATEGORIAS}/buscar/nombre/${nombre}`, {
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Categoría no encontrada");
};

export const updateCategoria = async (id, data) => {
  const resp = await fetch(`${API_CATEGORIAS}/actualizar/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al actualizar categoría");
};

export const deleteCategoria = async (id) => {
  const resp = await fetch(`${API_CATEGORIAS}/eliminar/id/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return resp.ok ? true : Promise.reject("Error al eliminar categoría");
};
