import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import './ProductFormModal.css';

const ProductFormModal = ({ onClose, onSave, productToEdit }) => {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen_url: '',
        categoria_id: ''
    });
    // eslint-disable-next-line no-unused-vars
    const [imageFile, setImageFile] = useState(null);
    const [categorias, setCategorias] = useState([]);

    // Si se pasa un producto para editar, llenamos el formulario
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await apiClient.get('/categorias');
                setCategorias(response.data);
            } catch (error) {
                console.error("No se pudieron cargar las categorías", error);
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (productToEdit) {
            // Aseguramos que categoria_id no sea null para el select
            setProducto({ ...productToEdit, categoria_id: productToEdit.categoria_id || '' });
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(producto, imageFile);
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
                    
                    <select name="categoria_id" value={producto.categoria_id} onChange={handleChange} required>
                        <option value="">-- Selecciona una categoría --</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                    
                    
                    <input name="imagen_url" value={producto.imagen_url} onChange={handleChange} placeholder="URL de la imagen" disabled />
                    <label>O sube una nueva imagen:</label>
                    <input type="file" onChange={handleFileChange} />

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