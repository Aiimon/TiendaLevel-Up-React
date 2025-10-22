import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './App.css'
import './index.css'
import Navbar from "./components/Navbar";
import CarritoSidebar from "./components/CarritoSidebar";
import BotonWsp from "./components/BotonWsp";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import Eventos from "./pages/Eventos";
import Soporte from "./pages/Soporte";
import Detalles from "./pages/Detalles";


function Layout() {
  const location = useLocation();

  const [carritoOpen, setCarritoOpen] = useState(false);
  const [cantidad, setCantidad] = useState(0);

  // Cambia el título de la página según la ruta
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Level-Up · Inicio"; 
        break;
      case "/productos":
        document.title = "Level-Up · Productos"; 
        break;
      case "/auth":
        document.title = "Level-Up · Acceso"; 
        break;
      case "/nosotros":
        document.title = "Level-Up · Nosotros"; 
        break;
      case "/blog":
        document.title = "Level-Up · Blog"; 
        break;
      case "/eventos":
        document.title = "Level-Up · Eventos"; 
        break;
      case "/soporte":
        document.title = "Level-Up · Soporte"; 
        break;
      case "/detalles":
        document.title = "Level-Up · Detalles"; 
        break;
      default:
        document.title = "Level-Up";
    }
  }, [location.pathname]);

  // Rutas donde no se muestra el navbar
  const hideNavbarRoutes = ["/auth"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          cantidad={cantidad}
          abrirCarrito={() => setCarritoOpen(true)}
        />
      )}

      {/* Carrito siempre visible, aunque esté cerrado */}
      <CarritoSidebar
        abierto={carritoOpen}
        cerrar={() => setCarritoOpen(false)}
        cantidad={cantidad}
      />
      <Routes>
        <Route path="/" element={<Home setCantidad={setCantidad} cantidad={cantidad} carritoOpen={carritoOpen} setCarritoOpen={setCarritoOpen} />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/detalles" element={<Detalles />} />
      </Routes>
      <BotonWsp/>
    </>
    
  );
}

export default function App() {
  return <Layout />;
}
