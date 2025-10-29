import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FormularioProductoEdit from "./FormularioProductoEdit"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock('../data/productos.json', () => ({ 
    default: {
        productos: [
            { id: "P1", categoria: "CatA", nombre: "Producto Original", precio: 100, stock: 10, stockCritico: 5, rating: 4, descripcion: "Desc Orig", imagen: "img.jpg", detalles: { Marca: "Orig" } },
            { id: "P2", categoria: "CatB", nombre: "Otro Producto", precio: 200, stock: 20, stockCritico: 8, rating: 5, descripcion: "Desc Otro", imagen: "img2.jpg", detalles: { Color: "Azul" } },
        ]
    } 
}));

const localStorageMock = (() => {
 let store = {};
 return {
 getItem: vi.fn((key) => store[key] || null),
 setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
 clear: vi.fn(() => { store = {}; }),
 removeItem: vi.fn((key) => { delete store[key]; })
 };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
// -----------------------------

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
 const actual = await importOriginal();
 return {
 ...actual,
useNavigate: () => mockNavigate,
    // useParams no es usado por este componente, pero lo dejamos por si acaso
 useParams: () => ({ id: 'P1' }) 
 };
});
// --------------------------------------------

// --- Mock de window.alert ---
window.alert = vi.fn();
// ----------------------------


describe("Testing FormularioProductoEdit Component", () => {

 const productIdToEdit = 'P1'; 
  const mockProductosData = [ // Datos que esperamos que localStorage tenga
    { id: "P1", categoria: "CatA", nombre: "Producto Original", precio: 100, stock: 10, stockCritico: 5, rating: 4, descripcion: "Desc Orig", imagen: "img.jpg", detalles: { Marca: "Orig" } },
    { id: "P2", categoria: "CatB", nombre: "Otro Producto", precio: 200, stock: 20, stockCritico: 8, rating: 5, descripcion: "Desc Otro", imagen: "img2.jpg", detalles: { Color: "Azul" } },
  ];

 // Función helper para renderizar con Router
 const renderComponent = (productId = productIdToEdit, initialLocalStorageData = mockProductosData) => {
 localStorageMock.setItem('productos_maestro', JSON.stringify(initialLocalStorageData));
return render(
<MemoryRouter initialEntries={[`/productosadmin/editar/${productId}`]}>
 <Routes>
 <Route path="/productosadmin/editar/:id" element={<FormularioProductoEdit productId={productId} />} />
 <Route path="/productosadmin" element={<div>Lista de Productos</div>} />
 </Routes>
</MemoryRouter>
);
};

 beforeEach(() => {
 vi.clearAllMocks();
 localStorageMock.clear();
    // Pre-cargamos localStorage CADA VEZ
    localStorageMock.setItem('productos_maestro', JSON.stringify(mockProductosData));
 });

 // --- Caso de Prueba 1: Carga Inicial y Renderizado de Datos ---
 it("CP-FormEditProd1: Muestra 'Cargando...' y luego renderiza el formulario con los datos del producto", async () => {
 renderComponent(productIdToEdit);

 // Verifica estado de carga inicial
 expect(screen.getByText(/Cargando datos del producto/i)).toBeInTheDocument();

 // Espera a que el useEffect termine
  await waitFor(() => {
      expect(screen.queryByText(/Cargando datos del producto/i)).not.toBeInTheDocument();
      // Verifica campos llenos con datos de P1
      expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Producto Original');
      expect(screen.getByLabelText(/Categoría/i)).toHaveValue('CatA');
      expect(screen.getByLabelText(/Precio/i)).toHaveValue(100);
      expect(screen.getByLabelText(/Stock Actual/i)).toHaveValue(10);
      expect(screen.getByLabelText(/Stock Crítico/i)).toHaveValue(5);
      expect(screen.getByLabelText(/Rating/i)).toHaveValue(4);
      expect(screen.getByLabelText(/URL de la Imagen/i)).toHaveValue('img.jpg');
      expect(screen.getByLabelText(/Descripción Detallada/i)).toHaveValue('Desc Orig');
      expect(screen.getByText('P1')).toBeInTheDocument();
      expect(screen.getByLabelText(/Detalles \(Formato JSON\)/i)).toHaveValue(JSON.stringify({ Marca: "Orig" }, null, 2));
    });
  });

  // --- Caso de Prueba 2: No encuentra el Producto ---
  it("CP-FormEditProd2: Muestra alerta y navega si el producto no se encuentra", async () => {
     renderComponent("ID_INEXISTENTE"); // ID que no está en el mock

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Producto no encontrado.");
        expect(mockNavigate).toHaveBeenCalledWith('/productosadmin');
    });
  });

  // --- Caso de Prueba 3: Cambios en Inputs (Estado) ---
  it("CP-FormEditProd3: Actualiza el estado formData al modificar los campos", async () => {
    renderComponent(productIdToEdit);
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument()); 

    const nombreInput = screen.getByLabelText(/Nombre/i);
    const precioInput = screen.getByLabelText(/Precio/i);
    const detallesInput = screen.getByLabelText(/Detalles \(Formato JSON\)/i);

    fireEvent.change(nombreInput, { target: { value: 'Producto Editado' } });
    expect(nombreInput).toHaveValue('Producto Editado');

    fireEvent.change(precioInput, { target: { value: '150.50' } });
    expect(precioInput).toHaveValue(150.50);

    fireEvent.change(detallesInput, { target: { value: '{\n  "Marca": "Nueva"\n}' } });
    expect(detallesInput).toHaveValue('{\n  "Marca": "Nueva"\n}');
  });

  // --- Caso de Prueba 4: Envío Exitoso ---
  it("CP-FormEditProd4: Guarda los cambios en localStorage y navega al enviar con datos válidos", async () => {
    renderComponent(productIdToEdit);
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    // Modificar un campo
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Producto Actualizado' } });
    fireEvent.change(screen.getByLabelText(/Detalles \(Formato JSON\)/i), { target: { value: '{"Color":"Rojo"}' } });

    // Enviar formulario
    const guardarButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(guardarButton);

    // Esperar a que se procese el submit
    await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY, expect.any(String));
        // Verificamos el contenido guardado (la segunda llamada a setItem, la primera fue en beforeEach)
        const savedData = JSON.parse(localStorageMock.setItem.mock.calls[1][1]); 
        const updatedProduct = savedData.find(p => p.id === productIdToEdit);
        expect(updatedProduct.nombre).toBe('Producto Actualizado');
        expect(updatedProduct.detalles).toEqual({ Color: "Rojo" });

        expect(window.alert).toHaveBeenCalledWith(`Producto Producto Actualizado (${productIdToEdit}) actualizado correctamente.`);
        expect(mockNavigate).toHaveBeenCalledWith('/productosadmin');
    });
  });

   // --- Caso de Prueba 5: Fallo de Validación (Precio Inválido) ---
   it("CP-FormEditProd5: Muestra alerta y no guarda si el precio es inválido", async () => {
    renderComponent(productIdToEdit);
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '-10' } });
    const guardarButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(guardarButton);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Precio debe ser un número positivo'));
        // Solo se llamó setItem en el beforeEach
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1); 
        expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

   // --- Caso de Prueba 6: Fallo de Validación (JSON Inválido) ---
   it("CP-FormEditProd6: Muestra alerta y no guarda si el JSON de detalles es inválido", async () => {
    renderComponent(productIdToEdit);
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Detalles \(Formato JSON\)/i), { target: { value: '{"Marca":"Roto"' } });
    const guardarButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(guardarButton);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Detalles (JSON)\' no tiene un formato JSON válido'));
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

   // --- Caso de Prueba 7: Botón Cancelar ---
   it("CP-FormEditProd7: Navega a la lista de productos al hacer clic en Cancelar", async () => {
    renderComponent(productIdToEdit);
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/productosadmin');
  });
//hola
});