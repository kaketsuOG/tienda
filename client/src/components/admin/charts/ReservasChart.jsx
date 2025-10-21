import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Importante para rellenar el área
} from 'chart.js';
import apiClient from '../../../services/apiClient';

// Registramos los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ReservasChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchChartData = async () => {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const response = await apiClient.get('/admin/stats/reservas-chart', config);
                const data = response.data;

                // Formateamos la fecha para que sea legible (ej: "20/10")
                const labels = data.map(item => 
                    new Date(item.dia).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })
                );
                const values = data.map(item => item.cantidad);

                // Configuramos los datos para Chart.js
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Reservas por Día',
                            data: values,
                            fill: true,
                            backgroundColor: 'rgba(231, 76, 60, 0.2)', // Relleno con opacidad (rojo/rosado de la plantilla)
                            borderColor: '#E74C3C', // Color de la línea (rojo/rosado)
                            tension: 0.3, // Curva suave
                            pointBackgroundColor: '#E74C3C',
                        },
                    ],
                });
            } catch (error) {
                console.error("Error al cargar datos del gráfico", error);
            }
        };
        fetchChartData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Ocultamos la leyenda como en la plantilla
            },
            title: {
                display: false, // Ocultamos el título
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    // Asegura que solo se muestren números enteros en el eje Y
                    stepSize: 1, 
                }
            }
        }
    };

    // Mostramos "Cargando..." mientras los datos no estén listos
    if (!chartData) {
        return <p>Cargando gráfico...</p>;
    }

    return <Line options={options} data={chartData} />;
};

export default ReservasChart;