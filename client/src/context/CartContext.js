import React, { createContext, useState } from 'react';

// 1. Creamos el contexto
export const CartContext = createContext();

// 2. Creamos el "Proveedor" del contexto
// Este componente envolverá nuestra app y le dará acceso al estado
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Función para agregar un producto a la reserva
    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Buscamos si el producto ya está en el carrito
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Si ya existe, aumentamos su cantidad
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                // Si es nuevo, lo agregamos con cantidad 1
                return [...prevItems, { ...product, cantidad: 1 }];
            }
        });
    };

    // --- NUEVA FUNCIÓN: ELIMINAR UN ITEM ---
    const removeItem = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // --- NUEVA FUNCIÓN: ACTUALIZAR LA CANTIDAD ---
    const updateItemQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            // Si la cantidad es 0 o menos, eliminamos el item
            removeItem(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId
                        ? { ...item, cantidad: newQuantity }
                        : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // El valor que será accesible por los componentes hijos
    const value = {
        cartItems,
        addToCart,
        removeItem,
        updateItemQuantity,
        clearCart
        // Aquí agregaremos luego removeItem, clearCart, etc.
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};