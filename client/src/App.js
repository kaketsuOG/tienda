import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProductosPage from './pages/ProductosPage';
import ProductoDetailPage from './pages/ProductoDetailPage';
import ReservaPage from './pages/ReservaPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriasPage from './pages/AdminCategoriasPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminReservasPage from './pages/AdminReservasPage';
import AdminReservaDetailPage from './pages/AdminReservaDetailPage';
import AdminClientesPage from './pages/AdminClientesPage';
import './App.css';

function App() {
  return (
    <div className="App">
      
        <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/*" element={<PublicLayout />} />

        {/* --- RUTAS DE ADMIN --- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Aquí usamos nuestro vigilante 'ProtectedRoute' */}
        <Route element={<ProtectedRoute />}>
            {/* Y ahora, todas las rutas protegidas usan AdminLayout como su esqueleto */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="productos" element={<AdminProductsPage />} />
                <Route path="categorias" element={<AdminCategoriasPage />} />
                <Route path="reservas" element={<AdminReservasPage />} />
                <Route path="reservas/:id" element={<AdminReservaDetailPage />} />
                <Route path="clientes" element={<AdminClientesPage />} />
                {/* Agrega aquí futuras rutas como <Route path="reservas" ... /> */}
            </Route>
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default App;