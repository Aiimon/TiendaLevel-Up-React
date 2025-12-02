import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import {
  getProductos,
  getCategorias,
  agregarAlCarrito,
  obtenerCarrito,
  actualizarItemCarrito,
  eliminarItemCarrito,
} from "./utils/apihelper";

import Navbar from "./components/Navbar";
import CarritoSidebar from "./components/CarritoSidebar";
import BotonWsp from "./components/BotonWsp";
import BuscadorAvanzado from "./components/BuscadorAvanzado";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Categoria from "./pages/Categoria";
import Ofertas from "./pages/Ofertas";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import Eventos from "./pages/Eventos";
import Soporte from "./pages/Soporte";
import Detalles from "./pages/Detalles";
import Termino from "./pages/Termino";
import Privacidad from "./pages/Privacidad";
import Checkout from "./pages/Checkout";
import Carro from "./pages/Carro";
import Boleta from "./pages/Boleta";
import Perfil from "./pages/Perfil";
import ProteccionUser from "./components/ProteccionUser";

function Layout() {
  const location = useLocation();
  const [carritoOpen, setCarritoOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuario, setUsuario] = useState(
    () => JSON.parse(localStorage.getItem("usuario")) || null
  );
  const [carrito, setCarrito] = useState([]);

  // Escuchar cambios de usuario en localStorage
  useEffect(() => {
    const handleUsuarioCambiado = () => {
      const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(usuarioLS || null);
    };
    window.addEventListener("usuarioCambiado", handleUsuarioCambiado);
    return () => window.removeEventListener("usuarioCambiado", handleUsuarioCambiado);
  }, []);

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosAPI = await getProductos();
        const categoriasAPI = await getCategorias();
        setProductos(productosAPI);

        const cats = Array.isArray(categoriasAPI)
          ? [{ id: 0, nombre: "Todas" }, ...categoriasAPI.map(c => ({ id: c.id, nombre: c.nombre }))]
          : [{ id: 0, nombre: "Todas" }];
        setCategorias(cats);
      } catch (error) {
        console.error("Error cargando productos o categorías:", error);
        setProductos([]);
        setCategorias([{ id: 0, nombre: "Todas" }]);
      }
    };
    fetchData();
  }, []);

  // Cargar carrito desde backend cuando hay usuario
  useEffect(() => {
    if (usuario) {
      const fetchCarrito = async () => {
        try {
          const c = await obtenerCarrito(usuario.id);
          setCarrito(c.items || []);
        } catch (error) {
          console.error("Error al obtener carrito:", error);
          setCarrito([]);
        }
      };
      fetchCarrito();
    } else {
      setCarrito([]);
    }
  }, [usuario]);

  // Agregar producto al carrito
  const handleAgregarCarrito = async (producto) => {
    if (!usuario) return alert("Debes iniciar sesión para agregar al carrito");

    try {
      const carritoActualizado = await agregarAlCarrito(usuario.id, producto.id, 1);
      setCarrito(carritoActualizado.items || []);

      // Ajustar stock local
      setProductos(prev =>
        prev.map(p => p.id === producto.id ? { ...p, stock: p.stock - 1 } : p)
      );
    } catch (error) {
      console.error("Error agregando al carrito:", error);
    }
  };

  // Actualizar cantidad en carrito
  const actualizarCantidadCarrito = async (itemId, cantidad) => {
    try {
      const carritoActualizado = await actualizarItemCarrito(usuario.id, itemId, cantidad);
      setCarrito(carritoActualizado.items || []);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  // Eliminar item del carrito
  const eliminarItemDelCarrito = async (itemId) => {
    try {
      const carritoActualizado = await eliminarItemCarrito(usuario.id, itemId);
      setCarrito(carritoActualizado.items || []);
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  // Filtrado de productos
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const handleFiltrarProductos = ({ q, cat, min, max }) => {
    const filtrados = productos.filter(p => {
      const matchCat = cat === "Todas" || p.categoria?.nombre === cat;
      const matchQ = q ? p.nombre.toLowerCase().includes(q.toLowerCase()) : true;
      const matchPrecio = p.precio >= min && p.precio <= max;
      return matchCat && matchQ && matchPrecio;
    });
    setProductosFiltrados(filtrados);
  };

  // Rutas donde no mostrar navbar
  const hideNavbarRoutes = ["/checkout", "/boleta"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowBotonWsp = shouldShowNavbar;

  // Mostrar buscador solo en /categoria y /ofertas
  const mostrarBuscador = location.pathname.startsWith("/categoria") || location.pathname.startsWith("/ofertas");

  return (
    <>
      {shouldShowNavbar && (
        <>
          <Navbar
            cantidad={carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            abrirCarrito={() => setCarritoOpen(true)}
            usuario={usuario}
          />

          {mostrarBuscador && (
            <BuscadorAvanzado
              categorias={categorias}
              onFilter={handleFiltrarProductos}
            />
          )}
        </>
      )}

      <CarritoSidebar
        abierto={carritoOpen}
        cerrar={() => setCarritoOpen(false)}
        carrito={carrito}
        onActualizarCantidad={actualizarCantidadCarrito}
        onEliminarItem={eliminarItemDelCarrito}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              productos={productosFiltrados.length ? productosFiltrados : productos}
              usuario={usuario}
              onAgregarCarrito={handleAgregarCarrito}
            />
          }
        />
        <Route
          path="/categoria"
          element={
            <Categoria
              productos={productosFiltrados.length ? productosFiltrados : productos}
              usuario={usuario}
              onAgregarCarrito={handleAgregarCarrito}
            />
          }
        />
        <Route
          path="/ofertas"
          element={
            <Ofertas
              productos={productosFiltrados.length ? productosFiltrados : productos}
              usuario={usuario}
              onAgregarCarrito={handleAgregarCarrito}
            />
          }
        />
        <Route path="/auth" element={<Auth onUsuarioChange={setUsuario} />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/soporte" element={<Soporte usuario={usuario} />} />
        <Route
          path="/detalles/:id"
          element={
            <Detalles
              productos={productos}
              usuario={usuario}
              onAgregarCarrito={handleAgregarCarrito}
            />
          }
        />
        <Route
          path="/carro"
          element={
            <Carro
              carrito={carrito}
              onActualizarCantidad={actualizarCantidadCarrito}
              onEliminarItem={eliminarItemDelCarrito}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <ProteccionUser usuario={usuario}>
              <Checkout
                carrito={carrito}
                onActualizarCantidad={actualizarCantidadCarrito}
                onCompraExitosa={() => setCarrito([])}
              />
            </ProteccionUser>
          }
        />
        <Route path="/boleta" element={<Boleta />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/termino" element={<Termino />} />
        <Route path="/privacidad" element={<Privacidad />} />
      </Routes>

      {shouldShowBotonWsp && <BotonWsp />}
    </>
  );
}

export default Layout;
