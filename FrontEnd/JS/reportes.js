document.addEventListener('DOMContentLoaded', () => {
    const compraForm = document.getElementById('compraForm');
    const ocupacionForm = document.getElementById('ocupacionForm');

    if (compraForm) {
        compraForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await buscarDetallesCompras();
        });
    }

    if (ocupacionForm) {
        ocupacionForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await buscarAnalisisOcupacion();
        });
    }
});

async function buscarDetallesCompras() {
    const fechaInicio = document.getElementById('fechaInicioCompra').value;
    const fechaFin = document.getElementById('fechaFinCompra').value;
    try {
        const response = await fetch(`https://localhost:7170/api/VistaDetallesCompra/detalles-por-fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        if (!response.ok) {
            throw new Error('Error al consultar los reportes de venta');
        }
        const data = await response.json();
        llenarTablaDetallesCompras(data);
    } catch (error) {
        console.error('Error al buscar reportes de venta:', error);
    }
}

function llenarTablaDetallesCompras(data) {
    const tbody = document.getElementById('detallesCompraBody');
    if (!tbody) return;  // Verificar si el elemento existe antes de intentar usarlo
    
    tbody.innerHTML = '';
    data.forEach(compra => {
        tbody.innerHTML += `
            <tr>
                <td>${compra.nombreCliente}</td>
                <td>${new Date(compra.fechaCompra).toLocaleDateString()}</td>
                <td>${compra.butacaReservada}</td>
                <td>${compra.sala}</td>
                <td>${compra.precioTotal}</td>
            </tr>
        `;
    });
}

async function buscarAnalisisOcupacion() {
    const fechaInicio = document.getElementById('fechaInicioOcupacion').value;
    const fechaFin = document.getElementById('fechaFinOcupacion').value;
    
    try {
        const response = await fetch(`https://localhost:7170/api/AnalisisOcupacion/ocupacion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        if (!response.ok) {
            throw new Error('Error al consultar el análisis de ocupación');
        }
        const data = await response.json();
        console.log(data);
        llenarTablaAnalisisOcupacion(data);
        generarGraficoOcupacion(data);
    } catch (error) {
        console.error('Error al buscar análisis de ocupación:', error);
    }
}

function llenarTablaAnalisisOcupacion(data) {
    const tbody = document.getElementById('analisisOcupacionBody');
    if (!tbody) return;  // Verificar si el elemento existe antes de intentar usarlo

    tbody.innerHTML = '';
        data.forEach(ocupacion => { 
            tbody.innerHTML += ` 
            <tr> 
                <td>${ocupacion.totalReservas}</td> 
                <td>${ocupacion.totalCompradas}</td> 
                <td>${ocupacion.porcentajeOcupacion}</td> 
                <td>${ocupacion.clienteConMasReservas}</td> 
                <td>${ocupacion.peliculaMasVista}</td> 
            </tr> `; 
        });
}
function generarGraficoOcupacion(data) { 
    const ctx = document.getElementById('ocupacionChart').getContext('2d'); 
    // Datos para el gráfico 
    const totalReservas = data.reduce((acc, curr) => acc + curr.totalReservas, 0); 
    const totalCompradas = data.reduce((acc, curr) => acc + curr.totalCompradas, 0); 
    // Destruir gráfico anterior si existe 
    if (window.myChart) { 
        window.myChart.destroy(); 
    } 
    // Crear nuevo gráfico 
    window.myChart = new Chart(ctx, { 
        type: 'doughnut', 
        data: { 
            labels: ['Total Reservas', 'Total Compradas'], 
            datasets: [{ 
                data: [totalReservas, totalCompradas], 
                backgroundColor: ['#36A2EB', '#FF6384'], 
                hoverBackgroundColor: ['#36A2EB', '#FF6384'] 
            }] }, 
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { 
                        position: 'top', 
                    }, 
                    title: { 
                        display: true, 
                        text: 'Análisis de Ocupación' 
                    } 
                } 
            } }); 
        }