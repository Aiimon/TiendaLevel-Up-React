import { render, screen, waitFor } from "@testing-library/react";
import ProteccionUser from "./ProteccionUser"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes, useLocation, Navigate } from "react-router-dom"; // Necesario para testear Navigate

// --- Mock de window.alert ---
// Espiamos la función alert original para verificar llamadas
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {}); // Mockea para que no muestre alertas reales
// ----------------------------

// --- Componente Helper para mostrar la ruta actual ---
// Nos ayuda a verificar si la navegación ocurrió
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};
// ----------------------------------------------------

// --- Mock del componente Navigate ---
// Esto es crucial porque ProteccionUser usa <Navigate> directamente
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(({ to, replace }) => {
      // Simulamos la redirección actualizando la URL "manualmente" para LocationDisplay
      // En un entorno real, MemoryRouter se encargaría de esto, pero aquí necesitamos ser explícitos
      // Usamos useLocation dentro del mock para obtener el historial (si está disponible)
       try {
           const navigate = actual.useNavigate(); // Intentar obtener navigate si está en contexto
           navigate(to, { replace });
       } catch (e) {
            // Si no hay contexto de Router, simulamos cambiando window.history (menos ideal)
            window.history.pushState({}, '', to);
       }
      // Renderizamos algo para que LocationDisplay funcione
      return <LocationDisplay />;
    }),
    useLocation: actual.useLocation, // Mantenemos el useLocation real
  };
});
// -----------------------------------


describe("Testing ProteccionUser Component", () => {
  // --- Datos de Prueba ---
  const mockUsuarioLogueado = { email: "test@ejemplo.com", nombre: "Usuario Test" };
  const ContenidoHijo = () => <div data-testid="contenido-hijo">Contenido Protegido</div>;

  beforeEach(() => {
    vi.clearAllMocks(); // Limpia el espía de alert y otros mocks
  });

  // --- Caso de Prueba 1: Usuario Logueado ---
  it("CP-ProteccionUser1: Renderiza los children si el usuario está logueado", () => {
    render(
      <MemoryRouter>
        <ProteccionUser usuario={mockUsuarioLogueado}>
          <ContenidoHijo />
        </ProteccionUser>
      </MemoryRouter>
    );

    // Verifica que el contenido hijo se renderiza
    expect(screen.getByTestId("contenido-hijo")).toBeInTheDocument();
    // Verifica que la alerta NO fue llamada
    expect(alertSpy).not.toHaveBeenCalled();
    // Verifica que el componente Navigate NO fue llamado/renderizado
    expect(Navigate).not.toHaveBeenCalled();
  });

  // --- Caso de Prueba 2: Usuario NO Logueado (Primera Vez) ---
  it("CP-ProteccionUser2: No renderiza children, muestra alerta (una vez) y redirige a /auth si no hay usuario", async () => {
     render(
       // Usamos MemoryRouter para proveer contexto de navegación
       <MemoryRouter initialEntries={['/ruta-protegida']}>
           <ProteccionUser usuario={null}>
               <ContenidoHijo />
           </ProteccionUser>
           {/* Ruta destino simulada */}
           <Routes>
               <Route path="/auth" element={<LocationDisplay />} />
           </Routes>
       </MemoryRouter>
     );

     // Esperar a que el useEffect se ejecute después del montaje
     await waitFor(() => {
        // Verifica que la alerta FUE llamada
        expect(alertSpy).toHaveBeenCalledTimes(1);
        expect(alertSpy).toHaveBeenCalledWith("Debes iniciar sesión para acceder a esta sección.");
     });

    // Verifica que el contenido hijo NO se renderiza
    expect(screen.queryByTestId("contenido-hijo")).not.toBeInTheDocument();

    // Verifica que el componente Navigate FUE llamado con los props correctos
    expect(Navigate).toHaveBeenCalledTimes(1);
    expect(Navigate).toHaveBeenCalledWith({ to: "/auth", replace: true }, expect.anything()); // El segundo arg son props internas

    // Verifica que la URL cambió (usando LocationDisplay)
    expect(screen.getByTestId('location-display')).toHaveTextContent('/auth');
  });

   // --- Caso de Prueba 3: Usuario NO Logueado (Re-render) ---
   it("CP-ProteccionUser3: No muestra la alerta de nuevo si el componente se re-renderiza sin usuario", async () => {
     // Render inicial sin usuario
     const { rerender } = render(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
            <ProteccionUser usuario={null}>
               <ContenidoHijo />
           </ProteccionUser>
           <Routes><Route path="/auth" element={<LocationDisplay />} /></Routes>
       </MemoryRouter>
     );

     // Esperar la primera alerta
     await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledTimes(1);
     });

     // Limpiar el mock para la siguiente verificación
     alertSpy.mockClear();
     // Limpiamos también el mock de Navigate
     vi.mocked(Navigate).mockClear();

     // Re-renderizar el componente, todavía sin usuario
     rerender(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
           <ProteccionUser usuario={null}>
               <ContenidoHijo />
           </ProteccionUser>
           <Routes><Route path="/auth" element={<LocationDisplay />} /></Routes>
       </MemoryRouter>
     );

      // Esperar un ciclo de renderizado
      await new Promise(resolve => setTimeout(resolve, 0));

     // Verificar que la alerta NO fue llamada de nuevo gracias al useRef
     expect(alertSpy).not.toHaveBeenCalled();
      // Todavía deberíamos estar redirigidos (Navigate se llama de nuevo en cada render sin usuario)
     expect(Navigate).toHaveBeenCalledTimes(1);
     expect(screen.getByTestId('location-display')).toHaveTextContent('/auth');
   });

   // --- Caso de Prueba 4: Cambio de Estado (Logout a Login) ---
   it("CP-ProteccionUser4: Renderiza children si el usuario cambia de null a logueado", () => {
     // Render inicial sin usuario
     const { rerender } = render(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
           <ProteccionUser usuario={null}>
               <ContenidoHijo />
           </ProteccionUser>
           <Routes><Route path="/auth" element={<LocationDisplay />} /></Routes>
       </MemoryRouter>
     );

     // Verifica redirección inicial
     expect(Navigate).toHaveBeenCalledTimes(1);
     expect(screen.getByTestId('location-display')).toHaveTextContent('/auth');
     expect(screen.queryByTestId("contenido-hijo")).not.toBeInTheDocument();

     // Limpiamos el mock de Navigate antes de re-renderizar
     vi.mocked(Navigate).mockClear();

     // Re-renderizar CON usuario
     rerender(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
           <ProteccionUser usuario={mockUsuarioLogueado}>
               <ContenidoHijo />
           </ProteccionUser>
           <Routes><Route path="/auth" element={<div>Auth Page</div>} /></Routes>
       </MemoryRouter>
     );

     // Ahora debería renderizar los children
     expect(screen.getByTestId("contenido-hijo")).toBeInTheDocument();
     // Y Navigate NO debería haber sido llamado
     expect(Navigate).not.toHaveBeenCalled();
     // Y no debería estar en la página /auth
     expect(screen.queryByTestId('location-display')).not.toBeInTheDocument();
   });

});