import Sidebar from "../components/SidebarAdmin"; 
import Footer from "../components/Footer";

function Homeadmin() {
    // La página Homeadmin simplemente renderiza el layout completo.
    return (
        <>
            <SidebarAdmin /> 
            <Footer />
        </>
    );
}

export default Homeadmin;