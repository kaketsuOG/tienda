const pool = require('../config/database');

// --- CREAR UN NUEVO PAGO (CON TRANSACCIÓN) ---
const createPago = async (req, res) => {
    const { reserva_id, monto, metodo, referencia_transaccion } = req.body;

    if (!reserva_id || !monto || !metodo) {
        return res.status(400).json({ message: 'ID de reserva, monto y método son requeridos.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Inicia la transacción

        // 1. Verificar que la reserva exista y esté pendiente
        const reservaResult = await client.query('SELECT * FROM reservas WHERE id = $1', [reserva_id]);
        if (reservaResult.rows.length === 0) {
            throw new Error('La reserva no existe.');
        }
        if (reservaResult.rows[0].estado !== 'PENDIENTE') {
            throw new Error('La reserva ya ha sido pagada o fue cancelada.');
        }

        // 2. Insertar el nuevo pago en la tabla 'pagos'
        const pagoQuery = `
            INSERT INTO pagos (reserva_id, monto, metodo, referencia_transaccion)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const pagoValues = [reserva_id, monto, metodo, referencia_transaccion];
        const newPago = await client.query(pagoQuery, pagoValues);

        // 3. Actualizar el estado de la reserva a 'CONFIRMADA'
        const updateReservaQuery = `
            UPDATE reservas SET estado = 'CONFIRMADA' WHERE id = $1;
        `;
        await client.query(updateReservaQuery, [reserva_id]);

        await client.query('COMMIT'); // Confirmamos los cambios si todo fue exitoso
        res.status(201).json({ 
            message: 'Pago registrado y reserva confirmada exitosamente.',
            pago: newPago.rows[0] 
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Revertimos todo si algo falla
        
        // Manejo de error para pago duplicado en la misma reserva
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Ya existe un pago registrado para esta reserva.' });
        }

        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    } finally {
        client.release(); // Liberamos el cliente
    }
};

// --- OBTENER TODOS LOS PAGOS ---
const getAllPagos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pagos ORDER BY fecha_pago DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = {
    createPago,
    getAllPagos
};