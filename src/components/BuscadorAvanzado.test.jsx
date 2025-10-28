import { fireEvent, render, screen } from "@testing-library/react";
import BuscadorAvanzado from "./BuscadorAvanzado"; // Asegúrate que la ruta sea correcta
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("Testing BuscadorAvanzado Component", () => {
  // --- Mocks y Datos de Prueba ---
  const mockOnFilter = vi.fn();
  const categoriasPrueba = ["Consolas", "Teclados", "Mouse"];

  // Limpiar mocks antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Caso de Prueba 1: Renderizado Inicial ---
  it("CP-Buscador1: Renderiza el botón flotante y el contenido oculto inicialmente", () => {
    render(<BuscadorAvanzado categorias={categoriasPrueba} onFilter={mockOnFilter} />);

    // Verifica que el botón flotante está presente (buscando por el icono)
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();

    // Verifica que el contenedor de búsqueda NO tiene la clase 'activo'
    const contenido = screen.getByText(/Búsqueda avanzada/i).closest('div'); // Encuentra el contenedor padre
    expect(contenido).not.toHaveClass('activo');
  });

  // --- Caso de Prueba 2: Abrir y Cerrar el Buscador ---
  it("CP-Buscador2: Abre y cierra el panel de búsqueda al hacer clic en el botón flotante", () => {
    render(<BuscadorAvanzado categorias={categoriasPrueba} onFilter={mockOnFilter} />);
    const botonFlotante = screen.getByRole('button', { name: /search/i });
    const contenido = screen.getByText(/Búsqueda avanzada/i).closest('div');

    // Abre el panel
    fireEvent.click(botonFlotante);
    expect(contenido).toHaveClass('activo');

    // Cierra el panel
    fireEvent.click(botonFlotante);
    expect(contenido).not.toHaveClass('activo');
  });

  // --- Caso de Prueba 3: Cambios en Inputs (Estado) ---
  it("CP-Buscador3: Actualiza el estado interno al escribir en los inputs y seleccionar categoría", () => {
    render(<BuscadorAvanzado categorias={categoriasPrueba} onFilter={mockOnFilter} />);

    const inputPalabra = screen.getByPlaceholderText(/PlayStation, ROG, mouse/i);
    const selectCategoria = screen.getByLabelText(/Categoría/i);
    const inputMin = screen.getByPlaceholderText("Mín");
    const inputMax = screen.getByPlaceholderText("Máx");

    // Simula escribir palabra clave
    fireEvent.change(inputPalabra, { target: { value: 'Teclado' } });
    expect(inputPalabra).toHaveValue('Teclado');

    // Simula seleccionar categoría
    fireEvent.change(selectCategoria, { target: { value: 'Teclados' } });
    expect(selectCategoria).toHaveValue('Teclados');

    // Simula ingresar precios
    fireEvent.change(inputMin, { target: { value: '50000' } });
    expect(inputMin).toHaveValue(50000); // Los inputs numéricos guardan el valor como número
    fireEvent.change(inputMax, { target: { value: '150000' } });
    expect(inputMax).toHaveValue(150000);
  });

  // --- Caso de Prueba 4: Llamada a onFilter (Evento Aplicar) ---
  it("CP-Buscador4: Llama a onFilter con los valores correctos al hacer clic en Aplicar", () => {
    render(<BuscadorAvanzado categorias={categoriasPrueba} onFilter={mockOnFilter} />);
    const botonAplicar = screen.getByRole('button', { name: /funnel/i }); // Busca por el icono

    // Simula cambios
    fireEvent.change(screen.getByPlaceholderText(/PlayStation, ROG, mouse/i), { target: { value: 'Razer' } });
    fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Mouse' } });
    fireEvent.change(screen.getByPlaceholderText("Mín"), { target: { value: '20000' } });
    fireEvent.change(screen.getByPlaceholderText("Máx"), { target: { value: '60000' } });

    // Clic en aplicar
    fireEvent.click(botonAplicar);

    // Verifica que onFilter fue llamado con el objeto esperado
    expect(mockOnFilter).toHaveBeenCalledTimes(1);
    expect(mockOnFilter).toHaveBeenCalledWith({
      q: 'Razer',
      cat: 'Mouse',
      min: 20000,
      max: 60000,
    });
  });

   // --- Caso de Prueba 5: Llamada a Limpiar Filtros (Evento Limpiar) ---
   it("CP-Buscador5: Llama a onFilter con valores por defecto y limpia los inputs al hacer clic en Limpiar", () => {
    render(<BuscadorAvanzado categorias={categoriasPrueba} onFilter={mockOnFilter} />);
    const botonLimpiar = screen.getByRole('button', { name: /x-lg/i }); // Busca por el icono de limpiar

    // Simula cambios previos
    fireEvent.change(screen.getByPlaceholderText(/PlayStation, ROG, mouse/i), { target: { value: 'Algo' } });
    fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Consolas' } });
    fireEvent.change(screen.getByPlaceholderText("Mín"), { target: { value: '1000' } });

    // Clic en limpiar
    fireEvent.click(botonLimpiar);

    // Verifica que onFilter fue llamado con los valores por defecto
    expect(mockOnFilter).toHaveBeenCalledTimes(1);
    expect(mockOnFilter).toHaveBeenCalledWith({
      q: '',
      cat: 'Todas',
      min: 0,
      max: Infinity,
    });

    // Verifica que los inputs se limpiaron visualmente
    expect(screen.getByPlaceholderText(/PlayStation, ROG, mouse/i)).toHaveValue('');
    expect(screen.getByLabelText(/Categoría/i)).toHaveValue('Todas');
    expect(screen.getByPlaceholderText("Mín")).toHaveValue(null); // Inputs numéricos vacíos tienen valor null
    expect(screen.getByPlaceholderText("Máx")).toHaveValue(null);
  });

  // --- Caso de Prueba 6: Cierre al hacer clic fuera (useEffect) ---
  it("CP-Buscador6: Cierra el panel si se hace clic fuera de él", () => {
    render(
        <div>
            <div data-testid="outside">Elemento exterior</div>
            <BuscadorAvanzado categorias={categoriasPrueba} onFilter={mockOnFilter} />
        </div>
    );
    const botonFlotante = screen.getByRole('button', { name: /search/i });
    const contenido = screen.getByText(/Búsqueda avanzada/i).closest('div');
    const elementoExterior = screen.getByTestId('outside');

    // Abre el panel
    fireEvent.click(botonFlotante);
    expect(contenido).toHaveClass('activo');

    // Simula un clic en el elemento exterior
    fireEvent.mouseDown(elementoExterior); // Usamos mouseDown porque el listener es 'mousedown'

    // Verifica que el panel se cerró
    expect(contenido).not.toHaveClass('activo');
  });

});