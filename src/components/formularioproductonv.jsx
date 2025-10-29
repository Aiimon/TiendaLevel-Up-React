import React, { useState } from 'react';
import productosD from "../data/productos.json"; 

// Definimos las categorías estáticamente
const CATEGORIES = [
    "Juegos de Mesa", "Accesorios", "Consolas", "Computadores Gamers",
    "Sillas Gamers", "Mouse", "Mousepad", "Poleras Personalizadas", "Teclados"
];

// Palabras a ignorar para generar las iniciales del ID
const IGNORED_WORDS = ['de', 'y', 'la', 'el', 'los', 'las', 'un', 'una'];
const LOCAL_STORAGE_KEY = 'productos_maestro';

// --- LÓGICA DE PERSISTENCIA INICIAL ---
const initializeProducts = () => {
    // Si la clave maestra ya existe en localStorage, no hacemos nada
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
        return;
    }
    // Si no existe, guardamos los productos del JSON inicial
    const initialProducts = productosD.productos || [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProducts));
};
// Ejecutar al cargar el módulo para asegurar la base de datos maestra
initializeProducts(); 


// --- FUNCIÓN PARA OBTENER EL LISTADO MAESTRO ---
const getMasterProducts = () => {
    // Lee siempre el array consolidado del almacenamiento local
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
};


// --- FUNCIÓN DE GENERACIÓN DE ID ---
const generateProductId = (categoria, existingProducts) => {
    
    // 1. Obtener las iniciales de las palabras CLAVE (ej: 'Juegos de Mesa' -> 'JM')
    const initials = categoria
        .split(' ') 
        .filter(word => !IGNORED_WORDS.includes(word.toLowerCase())) 
        .map(word => word.charAt(0).toUpperCase())
        .join(''); 
    
    // 2. Contar cuántos productos existen que EMPIECEN con esas iniciales
    const currentCount = existingProducts.filter(p => p.id.startsWith(initials)).length;
    
    // 3. El nuevo número secuencial es el conteo actual + 1
    const newNumber = currentCount + 1;
    
    // 4. Formatear el número con padding de ceros (3 cifras)
    const newNumberPadded = String(newNumber).padStart(3, '0');

    return `${initials}${newNumberPadded}`;
};
// --------------------------------------------------------


function FormularioProductoNV() {
    
    const [formData, setFormData] = useState({
        categoria: CATEGORIES[0] || '',
        nombre: '',
        precio: '',
        rating: 0,
        descripcion: '',
        imagen: '',
        stock: '',
        stockCritico: '5', 
        detalles: '{}', 
    });

    // Se cargan los productos maestros fuera de useState, pero dentro del componente,
    // para que la generación del ID sea reactiva al cambio de categoría.
    const existingProducts = getMasterProducts();
    const currentGeneratedId = generateProductId(formData.categoria, existingProducts);


    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Convertir a float solo si el valor no está vacío, manteniendo el input de texto
        let finalValue = value;
        if (type === 'number' && value !== '') {
             // For numeric inputs like rating, stock, stockCritico, ensure they become numbers
             // For price (step 0.01), ensure it's float
            if (name === 'precio' || name === 'rating'){
                 finalValue = parseFloat(value);
            } else if (name === 'stock' || name === 'stockCritico'){
                 finalValue = parseInt(value, 10); // Use parseInt for integers
                 // Handle potential NaN if input is cleared or invalid for integer
                 if (isNaN(finalValue) && value === '') finalValue = ''; // Allow clearing
                 else if (isNaN(finalValue)) finalValue = formData[name]; // Revert if invalid char entered
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- 1. VALIDACIÓN DE PRECIO ---
        const priceValue = parseFloat(formData.precio);
        if (isNaN(priceValue) || priceValue <= 0) {
            alert("Error de validación: El Precio debe ser un número positivo mayor a cero.");
            return;
        }
        
        // --- 2. VALIDACIÓN DE JSON ---
        let parsedDetalles = {};
        try {
            parsedDetalles = JSON.parse(formData.detalles || '{}');
        } catch (error) {
            alert("Error: El campo 'Detalles (JSON)' no tiene un formato JSON válido. Revise la sintaxis.");
            console.error("Detalles JSON inválido:", formData.detalles, error);
            return;
        }
        
        // --- 3. GENERACIÓN DE ID y Guardado ---
        const finalProducts = getMasterProducts();
        const newId = generateProductId(formData.categoria, finalProducts);

        const nuevoProducto = {
            id: newId, 
            categoria: formData.categoria,
            nombre: formData.nombre,
            precio: priceValue, // Ya validado y convertido
            rating: parseFloat(formData.rating) || 0,
            descripcion: formData.descripcion,
            imagen: formData.imagen,
            stock: parseInt(formData.stock, 10) || 0,
            stockCritico: parseInt(formData.stockCritico, 10) || 5,
            detalles: parsedDetalles,
        };

        if (finalProducts.some(p => p.id === nuevoProducto.id)) {
            alert(`Error: El ID generado ("${nuevoProducto.id}") ya existe.`);
            return;
        }

        finalProducts.push(nuevoProducto);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalProducts));

        alert(`Producto "${nuevoProducto.nombre}" (ID: ${newId}) creado y guardado.`);
        
        // 4. Limpiar formulario
        setFormData({ 
            categoria: CATEGORIES[0] || '', nombre: '', precio: '', rating: 0, 
            descripcion: '', imagen: '', stock: '', stockCritico: '5', detalles: '{}' 
        });
    };

    return (
        <div className="p-4" style={{ backgroundColor: '#212529', borderRadius: '8px', color: 'white' }}>
            <form onSubmit={handleSubmit}>
                
                {/* Fila 1: ID (Display), Nombre, Categoría */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">ID del Producto (Generado Automáticamente)</label>
                        <div className="form-control bg-secondary text-white border-secondary fw-bold">
                            {currentGeneratedId}
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
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

                {/* Fila 2: Precio, Stock, Rating */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="precio" className="form-label">Precio ($)</label>
                        {/* AÑADIDA VALIDACIÓN MIN="0" EN EL INPUT */}
                        <input 
                            type="number" 
                            step="0.01" 
                            min="0" // Evita números negativos directamente en el navegador
                            className="form-control bg-dark text-white border-secondary" 
                            id="precio" 
                            name="precio" 
                            value={formData.precio} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="stock" className="form-label">Stock Inicial</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="rating" className="form-label">Rating (0-5)</label>
                        <input type="number" step="0.1" min="0" max="5" className="form-control bg-dark text-white border-secondary" id="rating" name="rating" value={formData.rating} onChange={handleChange} />
                    </div>
                </div>

                {/* Fila 3: Imagen URL, Stock Crítico */}
                <div className="row mb-3">
                    <div className="col-md-8 mb-3">
                        <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="imagen" name="imagen" value={formData.imagen} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="stockCritico" className="form-label">Stock Crítico</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" id="stockCritico" name="stockCritico" value={formData.stockCritico} onChange={handleChange} required />
                    </div>
                </div>

                {/* Fila 4: Descripción */}
                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="descripcion" className="form-label">Descripción Detallada</label>
                        <textarea className="form-control bg-dark text-white border-secondary" id="descripcion" name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}></textarea>
                    </div>
                </div>

                {/* Botón de Envío */}
                <button type="submit" className="btn btn-primary w-100">
                    <i className="fas fa-plus me-2"></i> Crear Nuevo Producto
                </button>
                
            </form>
        </div>
    );
}

export default FormularioProductoNV;