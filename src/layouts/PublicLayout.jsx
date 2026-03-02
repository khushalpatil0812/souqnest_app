import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <div className="public-layout-shell">
      <Navbar />
      <main className="public-layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
