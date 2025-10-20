import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProductosPage from './pages/ProductosPage';
import ProductoDetailPage from './pages/ProductoDetailPage';
import ReservaPage from './pages/ReservaPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import './App.css';

function App() {
  return (
    <div className="App">
      
        <Routes>
          <Route path="/*" element={<PublicLayout />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/productos" element={<AdminProductsPage />} />
          </Route>
        </Routes>
      
    </div>
  );
}

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<ProductosPage />} />
        <Route path="/productos/:id" element={<ProductoDetailPage />} />
        <Route path="/reserva" element={<ReservaPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmacion" element={<ConfirmationPage />} />
      </Routes>
    </main>
  </>
);

export default App;