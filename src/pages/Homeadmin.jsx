export default function Homeadmin() {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#1e1e1e",
                color: "white",
                fontSize: "2rem",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <p>Bienvenido al Panel de Administración</p>
        </div>
    );
}



//import { Routes, Route } from "react-router-dom"; 
// Importamos los componentes del layout
//import SidebarAdmin from "../components/SidebarAdmin"; 
//import DashboardContent from "../components/DashboardContent"; 
//import Notiadmn from '../components/Notiadmn';
//import Footer from "../components/Footer";

// Asegúrate de que estas rutas de importación sean correctas:
//import Productosadmin from "./Productosadmin"; // Página de gestión de productos (debe existir)
//import Usuariosadmin from "./Usuariosadmin";   // Página de gestión de usuarios (debe existir)
// Puedes añadir más páginas aquí (ej: Ordenes, Categorias, etc.)


//function Homeadmin() {
//    return (
 //       <>
 //           <SidebarAdmin>
  //              
 //               {/* El contenido de Homeadmin se vuelve el {children} de SidebarAdmin */}
 //               
 //               <Routes>
 //                   {/* Ruta por defecto: Muestra el Dashboard */}
 //                   <Route path="/" element={<DashboardContent />} /> 
 //                   
 //                   {/* Rutas de gestión principal */}
 //                  <Route path="productosadmin" element={<Productosadmin />} /> 
 //                   <Route path="usuariosadmin" element={<Usuariosadmin />} /> 
 //                   
 //                   {/* Rutas de Creación/Edición (para completar el CRUD) */}
//                    {/* Nota: Asume que tienes un componente para crear/editar productos y usuarios */}
//                    <Route path="nuevoproducto" element={<h1>Página Crear Producto (POST)</h1>} />
 //                   <Route path="productosadmin/editar/:id" element={<h1>Página Editar Producto (PUT)</h1>} />
   //                 <Route path="usuariosadmin/editar/:id" element={<h1>Página Editar Usuario (PUT)</h1>} />
  //                  
 //                   {/* Manejo de 404 para el área admin */}
 //                   <Route path="*" element={<h1 style={{color: 'white', padding: '20px'}}>404 | Contenido de Admin No Encontrado</h1>} />
//                </Routes>
//                
                {/* La Notificación flotante se mantiene aquí si no quieres que el SidebarAdmin la gestione */}
//                <Notiadmn />
//                
//            </SidebarAdmin>
//            
//            <Footer />
//        </>
 //   );
//}

//export default Homeadmin;