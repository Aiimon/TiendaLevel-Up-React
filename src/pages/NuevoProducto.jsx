import React from 'react';
import SidebarAdmin from "../components/SidebarAdmin"; 
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
// Importamos el nuevo componente de formulario
import FormularioProductoNV from "../components/formularioproductonv"; 


function NuevoProducto() {
    
    const ProductContent = () => (
        <div className="admin-content-wrapper p-4 flex-grow-1" style={{ backgroundColor: '#000000ff' }}>
            
            <h1 className="text-light h4 mb-1">Nuevo Producto</h1>
            <p className="text-muted mb-4">Ingrese los detalles del producto para añadirlo al inventario.</p>

            {/* Botón para regresar al listado */}
            <Link to="/productosadmin" className="btn btn-sm btn-outline-secondary mb-4">
                <i className="fas fa-arrow-left me-2"></i> Volver al Listado
            </Link>

            {/* Renderizar el Formulario importado */}
            <FormularioProductoNV />
            
           
        </div>
    );

    return (
        <>
            <SidebarAdmin>
                <ProductContent />
            </SidebarAdmin>
         <Footer />
        </>
        
    );
}

export default NuevoProducto;