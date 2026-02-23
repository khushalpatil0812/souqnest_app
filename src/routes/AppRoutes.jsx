import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages (lazy loaded)
const Home = lazy(() => import('../pages/public/Home'));
const Products = lazy(() => import('../pages/public/Products'));
const ProductDetail = lazy(() => import('../pages/public/ProductDetail'));
const Listings = lazy(() => import('../pages/public/Listings'));
// const Blogs = lazy(() => import('../pages/public/Blogs')); // Kept for future use
const Contact = lazy(() => import('../pages/public/Contact'));
const RFQForm = lazy(() => import('../pages/public/RFQForm'));

// Admin Pages (lazy loaded)
const AdminLogin = lazy(() => import('../pages/admin/Login'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminSuppliers = lazy(() => import('../pages/admin/Suppliers'));
const AdminCategories = lazy(() => import('../pages/admin/Categories'));
const AdminIndustries = lazy(() => import('../pages/admin/Industries'));
const AdminRFQs = lazy(() => import('../pages/admin/RFQs'));
// const AdminSettings = lazy(() => import('../pages/admin/Settings')); // Removed for privacy

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Redirect /admin to /admin/login */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      
      {/* Public Routes with Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/listings" element={<Listings />} />
        {/* <Route path="/blogs" element={<Blogs />} /> */}  {/* Kept for future use */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/rfq" element={<RFQForm />} />
        <Route path="/become-partner" element={<Navigate to="/contact" replace />} />
      </Route>

      {/* Admin Login (no layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes with Layout */}
      <Route element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/suppliers" element={<AdminSuppliers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/industries" element={<AdminIndustries />} />
        <Route path="/admin/rfqs" element={<AdminRFQs />} />
        {/* <Route path="/admin/settings" element={<AdminSettings />} /> */}
      </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
