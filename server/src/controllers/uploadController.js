const supabase = require('../config/supabaseClient');

const uploadImage = async (req, res) => {
    console.log('--- Controlador de subida de imagen alcanzado ---'); // LOG #1
    console.log('Archivo recibido por multer:', req.file); // LOG #2
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    try {
        const file = req.file;
        // Creamos un nombre de archivo único con la fecha actual para evitar sobreescrituras
        const fileName = `${Date.now()}-${file.originalname}`;

        const { data, error } = await supabase.storage
            .from('product-images') // El nombre de tu bucket
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) {
            console.error('Error específico de Supabase:', error);
            throw error;
        }

        // Obtenemos la URL pública del archivo subido
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        res.status(200).json({ imageUrl: publicUrl });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ message: 'Error interno al subir la imagen.' });
    }
};

module.exports = { uploadImage };