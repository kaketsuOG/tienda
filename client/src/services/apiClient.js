import axios from 'axios';

// Creamos una instancia de axios con la configuración base
const apiClient = axios.create({
    // La URL base de tu backend que está corriendo en el puerto 3001
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;