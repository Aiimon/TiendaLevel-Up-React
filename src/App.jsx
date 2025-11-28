import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import { getProductos } from "./utils/apihelper";
import Navbar from "./components/Navbar";
import CarritoSidebar from "./components/CarritoSidebar";
import BotonWsp from "./components/BotonWsp";
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
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem("usuario")) || null);

  // Escuchar cambios de usuario en localStorage
  useEffect(() => {
    const handleUsuarioCambiado = () => {
      const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(usuarioLS || null);
    };
    window.addEventListener("usuarioCambiado", handleUsuarioCambiado);
    return () => window.removeEventListener("usuarioCambiado", handleUsuarioCambiado);
  }, []);

  // Cargar productos al inicio
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosAPI = await getProductos();
        const carritoLS = JSON.parse(localStorage.getItem("carrito")) || [];

        const iniciales = productosAPI.map((p) => {
          const itemCarrito = carritoLS.find((c) => c.id === p.id);
          const cantidad = itemCarrito ? itemCarrito.cantidad : 0;
          const stockLS = Number(localStorage.getItem(`stock_${p.id}`)) || p.stock;
          return { ...p, stock: stockLS, cantidad };
        });

        setProductos(iniciales);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };
    fetchProductos();
  }, []);

  // Agregar al carrito
  const handleAgregarCarrito = (idProducto, cant = 1) => {
    setProductos((prev) => {
      const nuevos = prev.map((p) => {
        if (p.id === idProducto && p.stock >= cant) {
          const nuevoStock = p.stock - cant;
          localStorage.setItem(`stock_${p.id}`, nuevoStock);
          return {
            ...p,
            cantidad: (p.cantidad || 0) + cant,
            stock: nuevoStock,
          };
        }
        return p;
      });
      localStorage.setItem(
        "carrito",
        JSON.stringify(nuevos.filter((p) => p.cantidad > 0))
      );
      return nuevos;
    });
  };

  // Actualizar cantidad en carrito
  const handleActualizarCantidad = (idProducto, cantidadNueva) => {
    setProductos((prev) => {
      const nuevos = prev.map((p) => {
        if (p.id === idProducto) {
          const cantidadFinal = Math.max(
            0,
            Math.min(cantidadNueva, p.stock + p.cantidad)
          );
          const stockFinal = p.stock + p.cantidad - cantidadFinal;
          localStorage.setItem(`stock_${p.id}`, stockFinal);
          return { ...p, cantidad: cantidadFinal, stock: stockFinal };
        }
        return p;
      });
      localStorage.setItem(
        "carrito",
        JSON.stringify(nuevos.filter((p) => p.cantidad > 0))
      );
      return nuevos;
    });
  };

  // Vaciar carrito tras compra
  const handleCompraExitosa = () => {
    setProductos((prev) =>
      prev.map((p) => ({
        ...p,
        cantidad: 0,
        stock: Number(localStorage.getItem(`stock_${p.id}`)) || p.stock,
      }))
    );
    localStorage.removeItem("carrito");
  };

  // Mostrar navbar y botón de WhatsApp
  const hideNavbarRoutes = ["/checkout", "/boleta"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowBotonWsp = shouldShowNavbar;

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          cantidad={productos.reduce((acc, p) => acc + (p.cantidad || 0), 0)}
          abrirCarrito={() => setCarritoOpen(true)}
          usuario={usuario}
        />
      )}

      <CarritoSidebar
        abierto={carritoOpen}
        cerrar={() => setCarritoOpen(false)}
        carrito={productos.filter((p) => p.cantidad > 0)}
        onActualizarCantidad={handleActualizarCantidad}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              productos={productos}
              usuario={usuario}
              onAgregarCarrito={handleAgregarCarrito}
            />
          }
        />
        <Route
          path="/categoria"
          element={
            <Categoria
              productos={productos}
              usuario={usuario}
              onAgregarCarrito={handleAgregarCarrito}
            />
          }
        />
        <Route
          path="/ofertas"
          element={
            <Ofertas
              productos={productos}
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
              carrito={productos.filter((p) => p.cantidad > 0)}
              onActualizarCantidad={handleActualizarCantidad}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <ProteccionUser usuario={usuario}>
              <Checkout
                carrito={productos.filter((p) => p.cantidad > 0)}
                onActualizarCantidad={handleActualizarCantidad}
                onCompraExitosa={handleCompraExitosa}
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
