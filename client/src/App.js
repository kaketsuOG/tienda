import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProductosPage from './pages/ProductosPage';
import ProductoDetailPage from './pages/ProductoDetailPage';
import ReservaPage from './pages/ReservaPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import './App.css';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;