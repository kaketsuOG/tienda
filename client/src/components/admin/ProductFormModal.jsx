import React, { useState, useEffect } from 'react';
import './ProductFormModal.css';

const ProductFormModal = ({ onClose, onSave, productToEdit }) => {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen_url: ''
    });

    // Si se pasa un producto para editar, llenamos el formulario
    useEffect(() => {
        if (productToEdit) {
            setProducto(productToEdit);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(producto);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{productToEdit ? 'Editar' : 'Agregar'} Producto</h2>
                <form onSubmit={handleSubmit}>
                    <input name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre del producto" required />
                    <textarea name="descripcion" value={producto.descripcion} onChange={handleChange} placeholder="Descripción"></textarea>
                    <input type="number" name="precio" value={producto.precio} onChange={handleChange} placeholder="Precio" required />
                    <input type="number" name="stock" value={producto.stock} onChange={handleChange} placeholder="Stock" required />
                    <input name="imagen_url" value={producto.imagen_url} onChange={handleChange} placeholder="URL de la imagen" />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;