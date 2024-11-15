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
    const token = localStorage.getItem('jwt');

    if (!validarFechas(fechaInicio, fechaFin)) { return; }

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`https://localhost:7170/api/VistaDetallesCompra/detalles-por-fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
            throw new Error('Error al consultar los reportes de venta');
        }
        const data = await response.json();
        llenarTablaDetallesCompras(data);
    } catch (error) {
        console.error('Error al buscar reportes de venta:', error);
        mostrarToast('Ocurrió un error al buscar los reportes de venta', 'danger');
    }
}

function llenarTablaDetallesCompras(data) {
    const tbody = document.getElementById('detallesCompraBody');
    if (!tbody) return;  // Verificar si el elemento existe antes de intentar usarlo
    
    tbody.innerHTML = '';
    if (data.length === 0) { 
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay registros disponibles</td></tr>'; 
        return; 
    }
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
    const token = localStorage.getItem('jwt');
   
    
    if (!validarFechas(fechaInicio, fechaFin)) { return;}

    try {
        const response = await fetch(`https://localhost:7170/api/AnalisisOcupacion/ocupacion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al consultar el análisis de ocupación');
        }
        const data = await response.json();
        console.log(data);
        llenarTablaAnalisisOcupacion(data);
        generarGraficoOcupacion(data);
    } catch (error) {
        console.error('Error al buscar análisis de ocupación:', error);
        mostrarToast('Ocurrió un error al buscar el análisis de ocupación', 'danger');
    }
}

function llenarTablaAnalisisOcupacion(data) {
    const tbody = document.getElementById('analisisOcupacionBody');
    if (!tbody) return;  // Verificar si el elemento existe antes de intentar usarlo

    tbody.innerHTML = '';
    if (data.length === 0) { 
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay registros disponibles</td></tr>'; 
        return; 
    }
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
function validarFechas(fechaInicio, fechaFin) { 
    if (new Date(fechaInicio) > new Date(fechaFin)) { 
        mostrarToast('La fecha de inicio debe ser inferior a la fecha de fin', 'warning'); 
        return false;
    } 
    return true; 
}

// Función para mostrar toast 
function mostrarToast(mensaje, tipo = 'info') { 
    const toastContainer = document.getElementById('toastContainer'); 
    const toastEl = document.createElement('div'); 
    toastEl.classList.add('toast', 'align-items-center', 'text-bg-' + tipo, 'border-0'); 
    toastEl.setAttribute('role', 'alert'); 
    toastEl.setAttribute('aria-live', 'assertive'); 
    toastEl.setAttribute('aria-atomic', 'true'); 
    toastEl.innerHTML = 
        ` 
            <div class="d-flex"> 
                <div class="toast-body"> ${mensaje} </div> 
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div> 
        `;
    toastContainer.appendChild(toastEl); 
    const toast = new bootstrap.Toast(toastEl); 
    toast.show(); 
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