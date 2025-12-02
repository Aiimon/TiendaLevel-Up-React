// apihelper.js
// http://localhost:8082/swagger-ui/index.html

// Rutas relativas (Vite hará el proxy a localhost:8082)
const API_USUARIOS = `/v2/usuarios`;
const API_PRODUCTOS = `/v2/productos`;
const API_CATEGORIAS = `/v2/categorias`;
const API_CARRITO = `/v2/carrito`;
const API_BOLETAS = `/v2/boletas`;
const API_IMAGENES = `/v2/imagenes`;

// Helper para headers con JWT si existe
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// IMAGENES

// Obtener todas las imágenes
export const getImagenes = async () => {
  const resp = await fetch(`${API_IMAGENES}/todas`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener imágenes");
};

// Obtener imágenes por tipo (ej: 'nosotros', 'evento', 'logo')
export const getImagenesPorTipo = async (tipo) => {
  const resp = await fetch(`${API_IMAGENES}/tipo/${tipo}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject(`Error al obtener imágenes tipo ${tipo}`);
};

// Obtener imagen por ID
export const getImagenPorId = async (id) => {
  const resp = await fetch(`${API_IMAGENES}/${id}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Imagen no encontrada");
};

// USUARIOS 

// Login
export const loginUsuario = async (email, password) => {
  const resp = await fetch(`${API_USUARIOS}/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return resp.ok ? resp.json() : Promise.reject("Error de login");
};

// Crear usuario
export const crearUsuario = async (data) => {
  const resp = await fetch(`${API_USUARIOS}/crear`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al crear usuario");
};

// Crear múltiples usuarios
export const crearUsuarios = async (usuarios) => {
  const resp = await fetch(`${API_USUARIOS}/crear/lista`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(usuarios),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al crear usuarios");
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
  const resp = await fetch(`${API_USUARIOS}/todos`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener usuarios");
};

// Buscar usuario
export const getUsuarioPorId = async (usuarioId) => {
  const resp = await fetch(`${API_USUARIOS}/buscar/id/${usuarioId}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Usuario no encontrado");
};

export const getUsuarioPorEmail = async (email) => {
  const resp = await fetch(`${API_USUARIOS}/buscar/email/${email}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Usuario no encontrado");
};

export const getUsuarioPorRut = async (rut) => {
  const resp = await fetch(`${API_USUARIOS}/buscar/rut/${rut}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Usuario no encontrado");
};

export const getUsuarioPorNombre = async (nombre) => {
  const resp = await fetch(`${API_USUARIOS}/buscar/nombre/${nombre}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Usuario no encontrado");
};

// Actualizar usuario
export const updateUsuario = async (data) => {
  const resp = await fetch(`${API_USUARIOS}/actualizar`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al actualizar usuario");
};

// Eliminar usuario
export const deleteUsuario = async (usuarioId) => {
  const resp = await fetch(`${API_USUARIOS}/eliminar/id/${usuarioId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return resp.ok ? true : Promise.reject("Error al eliminar usuario");
};

export const deleteUsuarioPorRut = async (rut) => {
  const resp = await fetch(`${API_USUARIOS}/eliminar/rut/${rut}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return resp.ok ? true : Promise.reject("Error al eliminar usuario");
};

// PRODUCTOS

export const crearProducto = async (data) => {
  const resp = await fetch(`${API_PRODUCTOS}/crear`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al crear producto");
};

export const getProductos = async () => {
  const resp = await fetch(`${API_PRODUCTOS}/todos`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener productos");
};

export const getProductoPorId = async (id) => {
  const resp = await fetch(`${API_PRODUCTOS}/buscar/id/${id}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Producto no encontrado");
};

export const getProductoPorNombre = async (nombre) => {
  const resp = await fetch(`${API_PRODUCTOS}/buscar/nombre/${nombre}`, { headers: getHeaders() });
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

// CATEGORÍAS

export const crearCategoria = async (data) => {
  const resp = await fetch(`${API_CATEGORIAS}/crear`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al crear categoría");
};

export const getCategorias = async () => {
  const resp = await fetch(`${API_CATEGORIAS}/todas`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener categorías");
};

export const getCategoriaPorId = async (id) => {
  const resp = await fetch(`${API_CATEGORIAS}/buscar/id/${id}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Categoría no encontrada");
};

export const getCategoriaPorNombre = async (nombre) => {
  const resp = await fetch(`${API_CATEGORIAS}/buscar/nombre/${nombre}`, { headers: getHeaders() });
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

// CARRITO 

export const obtenerCarrito = async (usuarioId) => {
  const resp = await fetch(`${API_CARRITO}/${usuarioId}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener carrito");
};

export const agregarAlCarrito = async (usuarioId, productoId, cantidad) => {
  const resp = await fetch(`${API_CARRITO}/${usuarioId}/agregar/${productoId}?cantidad=${cantidad}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al agregar producto al carrito");
};

export const vaciarCarrito = async (usuarioId) => {
  const resp = await fetch(`${API_CARRITO}/${usuarioId}/vaciar`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return resp.ok ? true : Promise.reject("Error al vaciar carrito");
};

export const actualizarItemCarrito = async (usuarioId, itemId, cantidad) => {
  const resp = await fetch(`${API_CARRITO}/${usuarioId}/item/${itemId}?cantidad=${cantidad}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al actualizar cantidad del item");
};

export const eliminarItemCarrito = async (usuarioId, itemId) => {
  const resp = await fetch(`${API_CARRITO}/${usuarioId}/item/${itemId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al eliminar item del carrito");
};

// BOLETAS 

export const generarBoleta = async (usuarioId) => {
  const resp = await fetch(`${API_BOLETAS}/generar/${usuarioId}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return resp.ok ? resp.json() : Promise.reject("Error al generar boleta");
};

export const getBoletaPorId = async (id) => {
  const resp = await fetch(`${API_BOLETAS}/${id}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Boleta no encontrada");
};

export const getBoletasPorUsuario = async (usuarioId) => {
  const resp = await fetch(`${API_BOLETAS}/usuario/${usuarioId}`, { headers: getHeaders() });
  return resp.ok ? resp.json() : Promise.reject("Error al obtener historial de boletas");
};
