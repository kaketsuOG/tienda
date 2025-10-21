const pool = require('../config/database');

// --- CREAR UNA NUEVA RESERVA (CON TRANSACCIÓN) ---
const createReserva = async (req, res) => {
    // El frontend debe enviar: { cliente_id, productos: [{ id, cantidad }] }
    const { cliente_id, productos } = req.body;

    // Validación básica de la entrada
    if (!cliente_id || !productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ message: 'Faltan datos del cliente o productos para la reserva.' });
    }

    const client = await pool.connect(); // Obtenemos un cliente del pool para la transacción

    try {
        await client.query('BEGIN'); // Inicia la transacción

        let total_reserva = 0;

        // 1. Verificamos el stock y calculamos el total
        for (const producto of productos) {
            const stockResult = await client.query('SELECT stock, precio FROM productos WHERE id = $1 FOR UPDATE', [producto.id]);
            // 'FOR UPDATE' bloquea la fila para evitar que otro proceso la modifique durante la transacción
            
            if (stockResult.rows.length === 0) {
                throw new Error(`El producto con ID ${producto.id} no existe.`);
            }

            const stockDisponible = stockResult.rows[0].stock;
            if (stockDisponible < producto.cantidad) {
                throw new Error(`Stock insuficiente para el producto con ID ${producto.id}. Disponible: ${stockDisponible}`);
            }
            total_reserva += stockResult.rows[0].precio * producto.cantidad;
        }
        
        // 2. Creamos la reserva en la tabla 'reservas'
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 2); // Vencimiento en 2 días

        const reservaQuery = `
            INSERT INTO reservas (cliente_id, fecha_vencimiento_pago, total_reserva)
            VALUES ($1, $2, $3) RETURNING id, estado, fecha_reserva;
        `;
        const reservaResult = await client.query(reservaQuery, [cliente_id, fechaVencimiento, total_reserva]);
        const newReservaId = reservaResult.rows[0].id;

        // 3. Insertamos cada producto en 'detalle_reserva' y actualizamos el stock
        for (const producto of productos) {
             const productoInfo = await client.query('SELECT precio FROM productos WHERE id = $1', [producto.id]);

            // Insertar en detalle_reserva
            const detalleQuery = `
                INSERT INTO detalle_reserva (reserva_id, producto_id, cantidad_reservada, precio_unitario)
                VALUES ($1, $2, $3, $4);
            `;
            await client.query(detalleQuery, [newReservaId, producto.id, producto.cantidad, productoInfo.rows[0].precio]);
            
            // Actualizar stock en productos
            const updateStockQuery = `
                UPDATE productos SET stock = stock - $1 WHERE id = $2;
            `;
            await client.query(updateStockQuery, [producto.cantidad, producto.id]);
        }

        await client.query('COMMIT'); // Si todo salió bien, confirmamos los cambios
        res.status(201).json({ 
            message: 'Reserva creada exitosamente', 
            reserva_id: newReservaId,
            ...reservaResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Si algo falló, revertimos todo
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    } finally {
        client.release(); // Liberamos el cliente para que vuelva al pool
    }
};


// --- OBTENER TODAS LAS RESERVAS ---
const getAllReservas = async (req, res) => {
    try {
        // Unimos las tablas para obtener también el nombre y email del cliente
        const query = `
            SELECT r.id, r.fecha_reserva, r.estado, r.total_reserva, c.nombre, c.apellido, c.email
            FROM reservas r
            JOIN clientes c ON r.cliente_id = c.id
            ORDER BY r.fecha_reserva DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

const getReservaDetails = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Obtenemos los datos principales de la reserva y del cliente asociado
        const reservaQuery = `
            SELECT r.*, c.nombre, c.apellido, c.email, c.telefono, c.direccion
            FROM reservas r
            JOIN clientes c ON r.cliente_id = c.id
            WHERE r.id = $1;
        `;
        const reservaResult = await pool.query(reservaQuery, [id]);
        if (reservaResult.rows.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        const reserva = reservaResult.rows[0];

        // 2. Obtenemos todos los productos (ítems) de esa reserva
        const detalleQuery = `
            SELECT d.cantidad_reservada, d.precio_unitario, p.nombre, p.imagen_url
            FROM detalle_reserva d
            JOIN productos p ON d.producto_id = p.id
            WHERE d.reserva_id = $1;
        `;
        const detalleResult = await pool.query(detalleQuery, [id]);
        const detalles = detalleResult.rows;

        // 3. Devolvemos todo junto
        res.status(200).json({ reserva, detalles });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// --- ACTUALIZAR EL ESTADO DE UNA RESERVA ---
const updateReservaStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    
    // Lista de estados válidos que permitimos
    const estadosValidos = ['PENDIENTE', 'CONFIRMADA', 'ENTREGADO', 'CANCELADA'];

    if (!estado || !estadosValidos.includes(estado)) {
        return res.status(400).json({ message: 'Estado no válido o no proporcionado.' });
    }

    try {
        const result = await pool.query(
            'UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado', error: error.message });
    }
};

module.exports = {
    createReserva,
    getAllReservas,
    getReservaDetails,
    updateReservaStatus
    // Aquí podrías agregar getReservaById, updateReservaStatus, etc.
};