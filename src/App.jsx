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
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import Eventos from "./pages/Eventos";
import Soporte from "./pages/Soporte";
import Detalles from "./pages/Detalles";
import HomeAdmin from "./pages/Homeadmin";
import productosD from "./data/productos.json";
import Productosadmin from "./pages/Productosadmin";

function Layout() {
  const location = useLocation();

  const [carritoOpen, setCarritoOpen] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLS = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioLS) setUsuario(usuarioLS);
  }, []);

  // Inicializar productos con stock desde localStorage
  useEffect(() => {
    const iniciales = productosD.productos.map(p => ({
      ...p,
      stock: Number(localStorage.getItem(`stock_${p.id}`)) || p.stock
    }));
    setProductos(iniciales);
  }, []);

  // Función para agregar al carrito
  const handleAgregarCarrito = (idProducto, cant) => {
    setCantidad(prev => prev + cant);
    // actualizar el stock 
    setProductos(prev =>
      prev.map(p =>
        p.id === idProducto ? { ...p, stock: p.stock - cant } : p
      )
    );
  };


  useEffect(() => {
    if (!location.pathname.startsWith("/detalles/")) {
      switch (location.pathname) {
        case "/": 
          document.title = "Level-Up · Inicio";
          break;
        case "/categoria": 
          document.title = "Level-Up · Categoria"; 
          break;
        case "/auth": 
          document.title = "Level-Up · Acceso"; 
          break;
        case "/Homeadmin": 
          document.title = "Level-Up · Admin"; 
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
        case "/productosadmin":
          document.title = "Level-Up · Productos";
          break;
        default: 
          document.title = "Level-Up";
      }
    }
  }, [location.pathname]);

  const hideNavbarRoutes = ["/auth", "/homeadmin"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowBotonWsp = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && (
  <Navbar cantidad={cantidad} abrirCarrito={() => setCarritoOpen(true)} />
      )}

      <CarritoSidebar
        abierto={carritoOpen}
        cerrar={() => setCarritoOpen(false)}
        cantidad={cantidad}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              setCantidad={setCantidad}
              cantidad={cantidad}
              carritoOpen={carritoOpen}
              setCarritoOpen={setCarritoOpen}
            />
          }
        />
        
        <Route path="/categoria" element={<Categoria productos={productos} />} />
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
      </Routes>
    {shouldShowBotonWsp && <BotonWsp />}
    </>
  );
}

export default function App() {
  return <Layout />;
}
