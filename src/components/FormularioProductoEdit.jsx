import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productosD from "../data/productos.json"; 

// --- Configuración Global ---
const LOCAL_STORAGE_KEY_PRODUCTS = 'productos_maestro';
const CATEGORIES = [
    "Juegos de Mesa", "Accesorios", "Consolas", "Computadores Gamers",
    "Sillas Gamers", "Mouse", "Mousepad", "Poleras Personalizadas", "Teclados"
];
const MIN_PRICE = 1; // Precio mínimo positivo

// Carga de datos
const getMasterProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS));
    if (!storedProducts && productosD.productos) {
        localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(productosD.productos));
        return productosD.productos;
    }
    return storedProducts || [];
};


function FormularioProductoEdit({ productId }) {
    
    const navigate = useNavigate();
    // Estado local para los datos del producto
    const [formData, setFormData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);


    // --- Efecto para cargar los datos del producto al inicio ---
    useEffect(() => {
        const products = getMasterProducts();
        // Buscar el producto por ID
        const productToEdit = products.find(p => p.id === productId);

        if (productToEdit) {
            // Convertir el objeto 'detalles' a una cadena JSON para mostrarlo en el textarea
            const detallesString = JSON.stringify(productToEdit.detalles, null, 2) || '{}';
            
            setFormData({
                ...productToEdit,
                detalles: detallesString, // Usamos la cadena JSON
                // Aseguramos que los valores sean strings para los inputs
                precio: String(productToEdit.precio),
                stock: String(productToEdit.stock),
                stockCritico: String(productToEdit.stockCritico),
                rating: String(productToEdit.rating || 0),
            });
        } else {
            alert("Producto no encontrado.");
            navigate('/productosadmin');
        }
        setIsLoading(false);
    }, [productId, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData) return;

        // --- VALIDACIONES ---
        const priceValue = parseFloat(formData.precio);
        const stockValue = parseInt(formData.stock, 10);
        const stockCriticoValue = parseInt(formData.stockCritico, 10);

        if (isNaN(priceValue) || priceValue < MIN_PRICE) {
            alert(`Error de validación: El Precio debe ser un número positivo mayor o igual a $${MIN_PRICE}.`);
            return;
        }
        if (isNaN(stockValue) || stockValue < 0) {
            alert("Error de validación: El Stock debe ser un número positivo o cero.");
            return;
        }
        if (isNaN(stockCriticoValue) || stockCriticoValue < 0) {
            alert("Error de validación: El Stock Crítico debe ser un número positivo o cero.");
            return;
        }

        // Validación de JSON de Detalles
        let parsedDetalles = {};
        try {
            parsedDetalles = JSON.parse(formData.detalles || '{}');
        } catch (error) {
            alert("Error: El campo 'Detalles (JSON)' no tiene un formato JSON válido.");
            return;
        }
        // -----------------------------

        // 1. Crear el objeto actualizado
        const productoActualizado = {
            ...formData,
            id: productId, // El ID se mantiene
            precio: priceValue,
            stock: stockValue,
            stockCritico: stockCriticoValue,
            rating: parseFloat(formData.rating) || 0,
            detalles: parsedDetalles,
        };

        // 2. Actualizar el array en localStorage
        const masterProducts = getMasterProducts();
        const updatedProducts = masterProducts.map(p => 
            p.id === productId ? productoActualizado : p
        );

        localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(updatedProducts));

        alert(`Producto ${formData.nombre} (${productId}) actualizado correctamente.`);
        navigate('/productosadmin'); // Volver a la lista después de guardar
    };
    
    if (isLoading || !formData) {
        return <div className="text-light p-5 text-center">Cargando datos del producto...</div>;
    }
    

    return (
        <div className="p-4" style={{ backgroundColor: '#212529', borderRadius: '8px', color: 'white' }}>
            <form onSubmit={handleSubmit}>
                
                {/* Fila 1: ID, Nombre, Categoría */}
                <div className="row mb-3">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">ID del Producto</label>
                        {/* ID es inmutable en edición */}
                        <div className="form-control bg-dark text-warning border-secondary fw-bold">
                            {formData.id}
                        </div>
                    </div>
                    <div className="col-md-5 mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="categoria" className="form-label">Categoría</label>
                        <select className="form-select bg-dark text-white border-secondary" id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fila 2: Precio, Stock, Stock Crítico */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="precio" className="form-label">Precio ($)</label>
                        <input type="number" step="0.01" min={MIN_PRICE} className="form-control bg-dark text-white border-secondary" id="precio" name="precio" value={formData.precio} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="stock" className="form-label">Stock Actual</label>
                        <input type="number" min="0" className="form-control bg-dark text-white border-secondary" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="stockCritico" className="form-label">Stock Crítico</label>
                        <input type="number" min="0" className="form-control bg-dark text-white border-secondary" id="stockCritico" name="stockCritico" value={formData.stockCritico} onChange={handleChange} required />
                    </div>
                </div>

                {/* Fila 3: Rating, Imagen URL */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="rating" className="form-label">Rating (0-5)</label>
                        <input type="number" step="0.1" min="0" max="5" className="form-control bg-dark text-white border-secondary" id="rating" name="rating" value={formData.rating} onChange={handleChange} />
                    </div>
                    <div className="col-md-8 mb-3">
                        <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="imagen" name="imagen" value={formData.imagen} onChange={handleChange} />
                    </div>
                </div>

                {/* Fila 4: Descripción */}
                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="descripcion" className="form-label">Descripción Detallada</label>
                        <textarea className="form-control bg-dark text-white border-secondary" id="descripcion" name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}></textarea>
                    </div>
                </div>
                
                

                {/* Botones de Acción */}
                <button type="submit" className="btn btn-success me-3">
                    <i className="fas fa-save me-2"></i> Guardar Cambios
                </button>
                <button type="button" onClick={() => navigate('/productosadmin')} className="btn btn-secondary">
                    <i className="fas fa-times me-2"></i> Cancelar
                </button>
                
            </form>
        </div>
    );
}

export default FormularioProductoEdit;