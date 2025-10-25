

import Sidebar from "../components/SidebarAdmin"; 
import Footer from "../../../src/components/Footer";

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