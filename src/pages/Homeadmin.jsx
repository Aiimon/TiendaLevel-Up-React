// src/pages/Homeadmin.jsx

import React from 'react';
import SidebarAdmin from "../components/SidebarAdmin"; 
import DashboardContent from "../components/DashboardContent"; 
import Footer from "../components/Footer";

function Homeadmin() {
    return (
        // Usamos SidebarAdmin como Layout y pasamos DashboardContent como children
        <>
            <SidebarAdmin>
                <DashboardContent />
            </SidebarAdmin>
            <Footer />
        </>
    );
}

export default Homeadmin;
