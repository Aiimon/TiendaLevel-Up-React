// src/pages/Homeadmin.jsx

import React from 'react';
import SidebarAdmin from "../components/SidebarAdmin"; 
import DashboardContent from "../components/DashboardContent"; 
import Footer from "../components/Footer";
import Notiadmn from '../components/Notiadmn';

function Homeadmin() {
    return (
        // Usamos SidebarAdmin como Layout y pasamos DashboardContent como children
        <>
            <SidebarAdmin>
                <DashboardContent />
                <Notiadmn />
            </SidebarAdmin>
            <Footer />
        </>
    );
}

export default Homeadmin;
