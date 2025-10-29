import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import CategoriasContent from "./CategoriaContent";
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";


// 1. Define los datos para que EL TEST los use (scope local)
const mockDataParaTest = {
  categorias: ["Juegos de Mesa", "Accesorios"],
  productos: [
    { id: "P1", categoria: "Consolas", nombre: "Consola X" },
    { id: "P2", categoria: "Accesorios", nombre: "Mando Y" },
    { id: "P3", categoria: "Teclados", nombre: "Teclado Z" },
  ]
};

// 2. Mockea el módulo. Esta función se "eleva" (hoist)
// Debe contener sus propios datos (copia de los de arriba) para que EL COMPONENTE los use
vi.mock('../data/productos.json', () => ({
  default: {
    categorias: ["Juegos de Mesa", "Accesorios"],
    productos: [
      { id: "P1", categoria: "Consolas", nombre: "Consola X" },
      { id: "P2", categoria: "Accesorios", nombre: "Mando Y" },
      { id: "P3", categoria: "Teclados", nombre: "Teclado Z" },
    ]
  }
}));
// ------------------------------------

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

// --- Mock de window.prompt y window.confirm ---
const originalPrompt = window.prompt;
const originalConfirm = window.confirm;
window.alert = vi.fn(); 

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  window.prompt = vi.fn();
  window.confirm = vi.fn(() => true); 
  // Pre-carga localStorage CADA VEZ con los datos del JSON
  localStorageMock.setItem('productos_maestro', JSON.stringify(mockDataParaTest.productos));
});

afterAll(() => {
  window.prompt = originalPrompt;
  window.confirm = originalConfirm;
  window.alert.mockClear();
});
// --------------------------------------------

// Mock del componente Footer
vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer-mock">Footer</div>
}));
// ---------------------------------

describe("Testing CategoriasContent Component", () => {

  // --- Caso de Prueba 1: Renderizado Inicial con Categorías ---
  it("CP-Categoria1: Renderiza títulos, botón y tabla con categorías iniciales", async () => {
    // CORRECCIÓN: No mockeamos getItem como null, dejamos que use el beforeEach
    render(<CategoriasContent />);

    expect(screen.getByRole('heading', { name: /Gestión de Categorías/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nueva Categoría/i })).toBeInTheDocument();

    // Esperar a que el useEffect termine y el estado se actualice
    await waitFor(() => {
        expect(screen.getByText("Juegos de Mesa")).toBeInTheDocument();
        expect(screen.getByText("Accesorios")).toBeInTheDocument();
        expect(screen.getByText("Consolas")).toBeInTheDocument();
        expect(screen.getByText("Teclados")).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5); // 1 header + 4 categorías
  });

  // --- Caso de Prueba 2: Renderizado sin Categorías ---
  it("CP-Categoria2: Muestra mensaje 'No se encontraron categorías' si no hay datos", async () => {
    // CORRECCIÓN: El mock de JSON debe estar FUERA del 'it'
    // En su lugar, simplemente limpiamos el localStorage y el mock del JSON (si es necesario)
    // Para este test, es mejor mockear el return de getItem como vacío
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([]));
    
    // Necesitamos un mock local de productosD que esté vacío
    vi.mock('../data/productos.json', () => ({ default: { categorias: [], productos: [] } }));
    
    render(<CategoriasContent />);

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron categorías/i)).toBeInTheDocument();
    });
  });

  // --- Caso de Prueba 3: Crear Nueva Categoría (Simulado) ---
  it("CP-Categoria3: Añade una nueva categoría a la tabla al usar 'Nueva Categoría'", async () => {
    window.prompt = vi.fn(() => "Nueva Cat Test");
    render(<CategoriasContent />);
    const botonNuevo = screen.getByRole('button', { name: /Nueva Categoría/i });

    // Esperar a que carguen las categorías iniciales
    await screen.findByText("Juegos de Mesa");
    expect(screen.queryByText("Nueva Cat Test")).not.toBeInTheDocument();

    fireEvent.click(botonNuevo);

    await waitFor(() => {
      expect(screen.getByText("Nueva Cat Test")).toBeInTheDocument();
    });
    expect(window.prompt).toHaveBeenCalledTimes(1);
  });

  // --- Caso de Prueba 4: Editar Categoría (Simulado) ---
  it("CP-Categoria4: Actualiza el nombre de una categoría en la tabla al usar 'Editar'", async () => {
    window.prompt = vi.fn(() => "Accesorios Editado");
    render(<CategoriasContent />);

    const accesoriosText = await screen.findByText("Accesorios");
    const categoriaRow = accesoriosText.closest('tr');
    const botonEditar = within(categoriaRow).getByRole('button', { name: /Editar/i });

    fireEvent.click(botonEditar);

    await waitFor(() => {
        expect(screen.queryByText("Accesorios")).not.toBeInTheDocument();
        expect(screen.getByText("Accesorios Editado")).toBeInTheDocument();
  f;
    });
    expect(window.prompt).toHaveBeenCalledWith(expect.stringContaining('Editar categoría: Accesorios'), 'Accesorios');
  });

  // --- Caso de Prueba 5: Borrar Categoría (Simulado) ---
  it("CP-Categoria5: Elimina una categoría de la tabla al usar 'Borrar'", async () => {
    window.confirm = vi.fn(() => true);
    render(<CategoriasContent />);

    const consolasText = await screen.findByText("Consolas");
    const categoriaRow = consolasText.closest('tr');
    const botonBorrar = within(categoriaRow).getByRole('button', { name: /Eliminar/i });

    expect(screen.getByText("Consolas")).toBeInTheDocument();
    fireEvent.click(botonBorrar);

    await waitFor(() => {
        expect(screen.queryByText("Consolas")).not.toBeInTheDocument();
ci });
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('eliminar la categoría "Consolas"'));
  });

  // --- Caso de Prueba 6: Cancelar Borrado ---
  it("CP-Categoria6: No elimina la categoría si el usuario cancela la confirmación", async () => {
    window.confirm = vi.fn(() => false);
    render(<CategoriasContent />);

    const tecladosText = await screen.findByText("Teclados");
    const categoriaRow = tecladosText.closest('tr');
    const botonBorrar = within(categoriaRow).getByRole('button', { name: /Eliminar/i });

 fireEvent.click(botonBorrar);

    // Esperamos un momento para asegurar que no se borra
    await new Promise(r => setTimeout(r, 100));
    
    expect(screen.getByText("Teclados")).toBeInTheDocument();
  expect(window.confirm).toHaveBeenCalledTimes(1);
  });
});