import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './App.css'
import './index.css'
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
import HomeAdmin from "./pages/Homeadmin";
import productosD from "./data/productos.json";
import Productosadmin from "./pages/Productosadmin";
import Checkout from "./pages/Checkout";
import Carro from "./pages/Carro";

function Layout() {
  const location = useLocation();

  const [carritoOpen, setCarritoOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario
  useEffect(() => {
    const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioLS) setUsuario(usuarioLS);
  }, []);

  // Inicializar productos y carrito desde localStorage
  useEffect(() => {
    const carritoLS = JSON.parse(localStorage.getItem("carrito")) || [];
    const iniciales = productosD.productos.map(p => {
      const itemCarrito = carritoLS.find(c => c.id === p.id);
      const cantidad = itemCarrito ? itemCarrito.cantidad : 0;
      const stockLS = Number(localStorage.getItem(`stock_${p.id}`)) || p.stock;
      return { ...p, stock: stockLS, cantidad };
    });
    setProductos(iniciales);
  }, []);

  // Función para agregar al carrito
  const handleAgregarCarrito = (idProducto, cant = 1) => {
    setProductos(prev => {
      const nuevos = prev.map(p => {
        if (p.id === idProducto && p.stock >= cant) {
          const nuevoStock = p.stock - cant;
          localStorage.setItem(`stock_${p.id}`, nuevoStock);
          return { ...p, cantidad: (p.cantidad || 0) + cant, stock: nuevoStock };
        }
        return p;
      });
      // Guardar carrito completo en localStorage
      const carritoActual = nuevos.filter(p => p.cantidad > 0);
      localStorage.setItem("carrito", JSON.stringify(carritoActual));
      return nuevos;
    });
    setCarritoOpen(true);
  };

  // Función para actualizar cantidad en carrito (subir, bajar o eliminar)
  const handleActualizarCantidad = (idProducto, cantidadNueva) => {
    setProductos(prev => {
      const nuevos = prev.map(p => {
        if (p.id === idProducto) {
          const cantidadFinal = Math.max(0, Math.min(cantidadNueva, p.stock + p.cantidad));
          const stockFinal = p.stock + p.cantidad - cantidadFinal;
          localStorage.setItem(`stock_${p.id}`, stockFinal);
          return { ...p, cantidad: cantidadFinal, stock: stockFinal };
        }
        return p;
      });
      localStorage.setItem(
        "carrito",
        JSON.stringify(nuevos.filter(p => p.cantidad > 0))
      );
      return nuevos;
    });
  };

  // Manejar títulos dinámicos
  useEffect(() => {
    if (!location.pathname.startsWith("/detalles/")) {
      switch (location.pathname) {
        case "/": document.title = "Level-Up · Inicio"; break;
        case "/categoria": document.title = "Level-Up · Categoria"; break;
        case "/ofertas": document.title = "Level-Up · Ofertas"; break;
        case "/auth": document.title = "Level-Up · Acceso"; break;
        case "/homeadmin": document.title = "Level-Up · Admin"; break;
        case "/nosotros": document.title = "Level-Up · Nosotros"; break;
        case "/blog": document.title = "Level-Up · Blog"; break;
        case "/eventos": document.title = "Level-Up · Eventos"; break;
        case "/soporte": document.title = "Level-Up · Soporte"; break;
        case "/productosadmin": document.title = "Level-Up · Productos"; break;
        case "/checkout": document.title = "Level-Up · Checkout"; break;
        case "/carro": document.title = "Level-Up · Carro"; break;
        default: document.title = "Level-Up";
      }
    }
  }, [location.pathname]);

  const hideNavbarRoutes = ["/auth", "/homeadmin"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowBotonWsp = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          cantidad={productos.reduce((acc, p) => acc + (p.cantidad || 0), 0)}
          abrirCarrito={() => setCarritoOpen(true)}
          usuario={usuario?.nombre || usuario}
        />
      )}

      <CarritoSidebar
        abierto={carritoOpen}
        cerrar={() => setCarritoOpen(false)}
        carrito={productos.filter(p => p.cantidad > 0)}
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
        <Route path="/auth" element={<Auth />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
        <Route path="/productosadmin" element={<Productosadmin />} />
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
              carrito={productos.filter(p => p.cantidad > 0)}
              onActualizarCantidad={handleActualizarCantidad}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              carrito={productos.filter(p => p.cantidad > 0)}
              onActualizarCantidad={handleActualizarCantidad}
            />
          }
        />
      </Routes>

      {shouldShowBotonWsp && <BotonWsp />}
    </>
  );
}

export default function App() {
  return <Layout />;
}
