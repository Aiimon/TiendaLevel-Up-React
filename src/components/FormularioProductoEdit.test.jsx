import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FormularioProductoEdit from "./FormularioProductoEdit"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Para simular useParams y navigate

// --- Mock de datos JSON ---
const mockProductosD = {
  productos: [
    { id: "P1", categoria: "CatA", nombre: "Producto Original", precio: 100, stock: 10, stockCritico: 5, rating: 4, descripcion: "Desc Orig", imagen: "img.jpg", detalles: { Marca: "Orig" } },
    { id: "P2", categoria: "CatB", nombre: "Otro Producto", precio: 200, stock: 20, stockCritico: 8, rating: 5, descripcion: "Desc Otro", imagen: "img2.jpg", detalles: { Color: "Azul" } },
  ]
};
vi.mock('../data/productos.json', () => ({ default: mockProductosD }));
// ----------------------------

// --- Mock de localStorage ---
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

// --- Mock de react-router-dom (useNavigate) ---
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'P1' }) // Simulamos que la URL es /.../editar/P1
  };
});
// --------------------------------------------

// --- Mock de window.alert ---
window.alert = vi.fn();
// ----------------------------


describe("Testing FormularioProductoEdit Component", () => {

  const productIdToEdit = 'P1'; // ID del producto que vamos a editar

  // Función helper para renderizar con Router
  const renderComponent = (initialLocalStorageData = mockProductosD.productos) => {
    localStorageMock.setItem('productos_maestro', JSON.stringify(initialLocalStorageData));
    // Usamos MemoryRouter para simular la navegación y el useParams
     return render(
       <MemoryRouter initialEntries={[`/productosadmin/editar/${productIdToEdit}`]}>
            <Routes>
                {/* La ruta coincide con la que usa useParams */}
                <Route path="/productosadmin/editar/:id" element={<FormularioProductoEdit productId={productIdToEdit} />} />
                {/* Ruta de destino para la navegación */}
                <Route path="/productosadmin" element={<div>Lista de Productos</div>} />
            </Routes>
       </MemoryRouter>
     );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear(); // Limpia localStorage antes de cada test
  });

  // --- Caso de Prueba 1: Carga Inicial y Renderizado de Datos ---
  it("CP-FormEditProd1: Muestra 'Cargando...' y luego renderiza el formulario con los datos del producto", async () => {
    renderComponent();

    // Verifica estado de carga inicial
    expect(screen.getByText(/Cargando datos del producto/i)).toBeInTheDocument();

    // Espera a que el useEffect termine y el formulario se renderice
    await waitFor(() => {
      expect(screen.queryByText(/Cargando datos del producto/i)).not.toBeInTheDocument();
      // Verifica campos llenos con datos de P1
      expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Producto Original');
      expect(screen.getByLabelText(/Categoría/i)).toHaveValue('CatA');
      expect(screen.getByLabelText(/Precio/i)).toHaveValue(100); // Input type="number"
      expect(screen.getByLabelText(/Stock Actual/i)).toHaveValue(10);
      expect(screen.getByLabelText(/Stock Crítico/i)).toHaveValue(5);
      expect(screen.getByLabelText(/Rating/i)).toHaveValue(4);
      expect(screen.getByLabelText(/URL de la Imagen/i)).toHaveValue('img.jpg');
      expect(screen.getByLabelText(/Descripción Detallada/i)).toHaveValue('Desc Orig');
      // Verifica el ID (no editable)
      expect(screen.getByText('P1')).toBeInTheDocument();
      // Verifica detalles (string JSON)
      expect(screen.getByLabelText(/Detalles \(Formato JSON\)/i)).toHaveValue(JSON.stringify({ Marca: "Orig" }, null, 2));
    });
  });

  // --- Caso de Prueba 2: No encuentra el Producto ---
  it("CP-FormEditProd2: Muestra alerta y navega si el producto no se encuentra", async () => {
     render( // Renderizamos sin datos iniciales en localStorage
       <MemoryRouter initialEntries={[`/productosadmin/editar/ID_INEXISTENTE`]}>
            <Routes>
                <Route path="/productosadmin/editar/:id" element={<FormularioProductoEdit productId="ID_INEXISTENTE" />} />
                <Route path="/productosadmin" element={<div>Lista de Productos</div>} />
            </Routes>
       </MemoryRouter>
     );
    // Espera a que termine la carga y se ejecute la lógica de no encontrado
    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Producto no encontrado.");
        expect(mockNavigate).toHaveBeenCalledWith('/productosadmin');
    });
  });

  // --- Caso de Prueba 3: Cambios en Inputs (Estado) ---
  it("CP-FormEditProd3: Actualiza el estado formData al modificar los campos", async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument()); // Espera carga

    const nombreInput = screen.getByLabelText(/Nombre/i);
    const precioInput = screen.getByLabelText(/Precio/i);
    const detallesInput = screen.getByLabelText(/Detalles \(Formato JSON\)/i);

    fireEvent.change(nombreInput, { target: { value: 'Producto Editado' } });
    expect(nombreInput).toHaveValue('Producto Editado');

    fireEvent.change(precioInput, { target: { value: '150.50' } });
    expect(precioInput).toHaveValue(150.50);

    fireEvent.change(detallesInput, { target: { value: '{\n  "Marca": "Nueva"\n}' } });
    expect(detallesInput).toHaveValue('{\n  "Marca": "Nueva"\n}');
  });

  // --- Caso de Prueba 4: Envío Exitoso ---
  it("CP-FormEditProd4: Guarda los cambios en localStorage y navega al enviar con datos válidos", async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    // Modificar un campo
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Producto Actualizado' } });
    fireEvent.change(screen.getByLabelText(/Detalles \(Formato JSON\)/i), { target: { value: '{"Color":"Rojo"}' } });

    // Enviar formulario
    const guardarButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(guardarButton);

    // Esperar a que se procese el submit
    await waitFor(() => {
        // Verifica que se llamó a setItem con los datos actualizados
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY, expect.any(String));
        const savedData = JSON.parse(localStorageMock.setItem.mock.calls[1][1]); // [1] porque el primero es la carga inicial
        const updatedProduct = savedData.find(p => p.id === productIdToEdit);
        expect(updatedProduct.nombre).toBe('Producto Actualizado');
        expect(updatedProduct.detalles).toEqual({ Color: "Rojo" }); // Verifica que los detalles se parsearon

        // Verifica alerta y navegación
        expect(window.alert).toHaveBeenCalledWith(`Producto Producto Actualizado (${productIdToEdit}) actualizado correctamente.`);
        expect(mockNavigate).toHaveBeenCalledWith('/productosadmin');
    });
  });

   // --- Caso de Prueba 5: Fallo de Validación (Precio Inválido) ---
   it("CP-FormEditProd5: Muestra alerta y no guarda si el precio es inválido", async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    // Poner precio inválido
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '-10' } });

    // Enviar formulario
    const guardarButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(guardarButton);

    // Esperar (aunque no debería ocurrir nada asíncrono aquí)
    await waitFor(() => {
        // Verifica alerta de validación
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Precio debe ser un número positivo'));
        // Verifica que NO se llamó a setItem por segunda vez (solo en la carga inicial)
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
        // Verifica que NO se navegó
        expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

   // --- Caso de Prueba 6: Fallo de Validación (JSON Inválido) ---
   it("CP-FormEditProd6: Muestra alerta y no guarda si el JSON de detalles es inválido", async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    // Poner JSON inválido
    fireEvent.change(screen.getByLabelText(/Detalles \(Formato JSON\)/i), { target: { value: '{"Marca":"Roto"' } }); // Falta llave de cierre

    // Enviar formulario
    const guardarButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    fireEvent.click(guardarButton);

    // Esperar
    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Detalles (JSON)\' no tiene un formato JSON válido'));
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

   // --- Caso de Prueba 7: Botón Cancelar ---
   it("CP-FormEditProd7: Navega a la lista de productos al hacer clic en Cancelar", async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/productosadmin');
  });

});