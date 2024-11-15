async function cargar_butacas() { 
    datos_butaca([]); //limpiar datos de la butaca
    const $div = document.getElementById('butacas_cargadas');
    const $selectP = document.getElementById('pelicula_select');
    const $selectF =  document.getElementById('funcion_select');
    const funcion =  $selectF.options[$selectF.selectedIndex].value;
    const token = localStorage.getItem('jwt');

    
    $div.innerHTML = '';
    let images = '';
   
    $div.style.display = 'flex'; 
    try
    {
        const fpartes = await funcion.split(','); //al recibir un string y luego separarlo, se pueden asignar más de un id en el value de un option
        console.log(fpartes)
        let res = await fetch(`https://localhost:7170/api/Butaca/SalaFuncion?idSala=${fpartes[0]}&idFuncion=${fpartes[1]}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }); 
        if (!res.ok)
            {
                console.error('Ha ocurrido un error al cargar los datos: ' + res.statusText);
                return;
            }
        const data = await res.json();
        console.log('Datos cargados con éxito. cant: ' + data.length);
        let cont = 0;
        for (let i = 0; i < data.length/10; i++) {
            for (let j = 0; j < 10; j++) {
                let butaca_img =  'Libre.png'
                let clase = 'butaca' //cambia el comportamiento del css
                let onclick = 'handleButacaClick(this)' //evita que se implemente la funcion de seleccionar
                //valida si es una butaca reservable
                if (data[cont]) { 
                    const estadoButaca = data[cont].estado;
                    switch (estadoButaca) { 
                        case 1: 
                            butaca_img = 'Ocupado.png'; clase = 'butaca_ocupada'; onclick = ''; 
                            break; 
                        case 2: 
                            butaca_img = 'Reservado.png'; clase = 'butaca_ocupada'; onclick = ''; 
                            break; 
                        case 3: 
                            butaca_img = 'Libre.png'; clase = 'butaca'; onclick = `actualizarEstadoButaca(${data[cont].idButaca}, ${fpartes[1]}, 2)`;
                            break; 
                        default: butaca_img = 'Libre.png'; clase = 'butaca'; onclick = 'handleButacaClick(this)'; 
                    } 
                }
                console.log(`Butaca ${data[cont]?.idButaca}: Estado ${data[cont]?.estado}, Imagen ${butaca_img}, Clase ${clase}`);

                images += //creando las butacas
                `
                <div 
                    class="${clase}" 
                    data-id="${data[cont]?.idButaca}" 
                    data-sala="${fpartes[0]}" 
                    data-pelicula="${$selectP.options[$selectP.selectedIndex].textContent}" 
                    data-funcion="${fpartes[1]}" 
                    data-precio="${fpartes[2]}"
                    data-estado="${data[cont]?.estado}" 
                    onclick="${onclick}"
                >
                    <img class="butaca_img" src="/IMAGES/${butaca_img}" alt="butaca">
                    <p class="align-middle mb-2" id="" style="font-size: 0.6em;">${data[cont]?.nroButaca}</p>
                </div>
                `
                cont++;
            }
        }
      // Limpiar descripciones previas si ya existen
      const existingDescriptions = document.getElementById('descripciones_butacas');
      if (existingDescriptions) {
          existingDescriptions.remove();
      }

       const estadosDescripcion = `
       <div id="descripciones_butacas">
           <div class="rows d-flex">
               <div class="butaca-descripcion">
                   <img src="/IMAGES/Libre.png" alt="Butaca Libre" class="img-fluid">
                   <p>Disponible</p>
               </div>
               <div class="butaca-descripcion">
                   <img src="/IMAGES/Ocupado.png" alt="Butaca Ocupada" class="img-fluid">
                   <p>Confirmada</p>
               </div>
               <div class="butaca-descripcion">
                   <img src="/IMAGES/Reservado.png" alt="Butaca Reservada" class="img-fluid">
                   <p>Pendiente</p>
               </div>
           </div>
       </div>
       `;

       // Concatenar las descripciones fuera del contenedor de las butacas
       $div.innerHTML = images;
       document.getElementById('contenedor-butacas').insertAdjacentHTML('beforeend', estadosDescripcion); // Añadir descripciones

    }catch(error){
        console.error('error al cargar las butacas',error);
    }
}
// Función para actualizar el estado de una butaca 
async function actualizarEstadoButaca(idButaca, idFuncion, estado) { 
    const token = localStorage.getItem('jwt');
    try { 

        const response = await fetch(`https://localhost:7170/api/Reserva/actualizar-estado/${idButaca}?estado=${estado}&idFuncion=${idFuncion}`, {
            method: 'PUT', 
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
            if (!response.ok) { 
                throw new Error(`No se pudo actualizar el estado de la butaca ${idButaca}`); 
            } 
            // Recargar butacas después de actualizar el estado 
            await cargar_butacas(); 
        } catch (error) { 
            console.error('Error al actualizar el estado de la butaca', error); 
        } 
    }

function toggleSelected(element) {
    const img = element.querySelector('.butaca_img');
    const isSelected = element.classList.toggle('selected');
    if(isSelected) {
        element.setAttribute('data-original-src', img.src);
        img.src = '/IMAGES/Seleccionado.png';
    } else {
        img.src = element.getAttribute('data-original-src');
    }
}
function handleButacaClick(element) {
    // Llamar a toggleSelected para manejar la selección
    toggleSelected(element);

    const selectedButacas = document.querySelectorAll('.butaca.selected');

     // Construir un array con los datos de cada butaca seleccionada
     const datosArray = Array.from(selectedButacas).map(butaca => {
        const id = butaca.getAttribute('data-id');
        const sala = butaca.getAttribute('data-sala');
        const pelicula = butaca.getAttribute('data-pelicula');
        const funcion = butaca.getAttribute('data-funcion');
        const precio = butaca.getAttribute('data-precio');
        return `${id},${sala},${pelicula},${funcion},${precio}`;
    });

    if (datosArray.length > 0) {
        datos_butaca(datosArray); // Mostrar los datos de las butacas seleccionadas
    } else {
        datos_butaca(null); // Limpiar los datos si se deselecciona
        document.getElementById('datos_butaca').style.display = 'none'; // Ocultar el contenedor de datos
    }
}

async function cargar_funciones(){
    // Obtener funciones
    const $selectP = document.getElementById('pelicula_select');
    const $selectF =  document.getElementById('funcion_select');
    const $contenedor = document.getElementById('butacas_cargadas');
    const token = localStorage.getItem('jwt');
    try
    {        
        if (!$selectP || !$selectF || !$contenedor) { 
            console.error('Uno o más elementos no se encontraron en el DOM.'); 
            return;
        }

        $selectF.innerHTML = '';

        // Añadir una opción en blanco al principio 
        const emptyOption = document.createElement('option'); 
        emptyOption.value = ''; 
        emptyOption.text = 'Seleccione una función'; 
        $selectF.appendChild(emptyOption);

        const responseFunciones = await fetch(`https://localhost:7170/api/Funcion/Film/${$selectP.options[$selectP.selectedIndex].value}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });if (!responseFunciones.ok) {
            throw new Error('Error al cargar las funciones: ' + responseFunciones.statusText);
        }
        const funcionesData = await responseFunciones.json();

        funcionesData.forEach(funcion => {
            // Formateo de fecha de la función (YYYY-MM-DD a DD/MM/YYYY)
            const partes = funcion.fechaFuncion.split('-');
            const fechaFormateada = `${partes[2].substring(0, 2)}/${partes[1]}/${partes[0]}`;

            // Crear y agregar la opción al select
            const option = document.createElement('option');
            option.text = `${fechaFormateada} - ${funcion.hsInicio.substring(0, 5)} Hs.`;
            option.value = `${funcion.idSala},${funcion.idFuncion},${funcion.precioBase},${option.text}`; // {idSala,idFuncion,precioBase,funcion}; //{idSala,idFuncion,funcion} datos para pasar a las butacas
            $selectF.appendChild(option);
        });
        // Ocultar el contenedor de butacas si la opción vacía está seleccionada 
        $selectF.addEventListener('change', function() { 
            if ($selectF.value === '') { 
                $contenedor.style.display = 'none'; 
                $contenedor.innerHTML = ''; // Limpiar el contenido del contenedor 
            } else { 
                $contenedor.style.display = 'flex'; 
                cargar_butacas(); // Cargar butacas si se selecciona una función 
            } 
        }); 
        if ($selectF.value === '') { 
            $contenedor.style.display = 'none';
        }
        
    } catch (error) { 
        console.error('Ha ocurrido un error al cargar las funciones: ', error);
    }
}

    async function datos_butaca(datosArray = []) {
        // Se obtiene el div que podría contener datos, pero en este caso ya no se usará para mostrar información
        const $div = document.getElementById('datos_butaca');
        const token = localStorage.getItem('jwt');
        if (!$div) { 
            console.error('No se encontró el elemento "datos_butaca" en el DOM.'); 
            return; 
        }
    
        // Limpiamos el contenido del div para no mostrar detalles de butacas
        $div.innerHTML = '';
    
        // Si hay datos en datosArray, procederemos con la lógica de reserva
        if (Array.isArray(datosArray) && datosArray.length > 0) {
            try {
                const res = await fetch('https://localhost:7170/api/Butaca/Salas',{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    alert('Error al cargar las salas');
                    return;
                }
                const data = await res.json();
                
                const botonReservar = document.getElementById('boton_reservar');
            /* const botonCancelar = document.getElementById('boton_cancelar'); */

            if (botonReservar) {
                botonReservar.addEventListener('click', function () {
                    // Datos de reserva
                    const idCliente = 1;  // Puedes actualizar con el ID del cliente real si es necesario
                    const idFuncion = document.getElementById('funcion_select').value.split(',')[0];
                    const fechaReserva = new Date().toISOString();
                    const butacasSeleccionadas = document.querySelectorAll('.butaca.selected');
                    const cantidadEntradas = butacasSeleccionadas.length;
                    const idEstado = 2;
                    const idCompra = null;
                    let nombreSala = '';
                    let precio = '';

                    // Extraer datos de sala y precio de cada butaca
                    datosArray.forEach((datos) => {
                        const bpartes = datos.split(',');
                        nombreSala = data.find(s => s.idSala == bpartes[1]);
                        precio = bpartes[4];
                    });

                    // Datos de reserva que serán enviados
                    const reservarData = {
                        idCliente,
                        idFuncion,
                        fechaReserva,
                        cantidadEntradas,
                        idEstado,
                        idCompra,
                        pelicula: document.getElementById('pelicula_select').selectedOptions[0]?.text,
                        sala: nombreSala.descripcion,
                        funcion: document.getElementById('funcion_select').selectedOptions[0]?.text,
                        precio,
                    };

                    // IDs de las butacas seleccionadas
                    const butacasIds = Array.from(butacasSeleccionadas).map(b => b.getAttribute('data-id'));

                    // Llamar a realizarReserva
                    realizarReserva(butacasIds, reservarData);
                });
            }
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        }           
    }

async function realizarReserva(butacasIds, reservaData) {
    const token = localStorage.getItem('jwt');
    try {
        console.log(butacasIds.length);
        // Validación: máximo 6 butacas por reserva
        if (butacasIds.length > 6) {
            console.error('No se puede reservar más de 6 butacas por persona');
            
            const errorToastElement = document.getElementById('errorToast');
            if (errorToastElement) {
                errorToastElement.classList.add('toast-error');
                errorToastElement.innerText = 'No se puede reservar más de 6 butacas por persona';
                const errorToast = new bootstrap.Toast(errorToastElement);
                errorToast.show();
            }
            return; 
        } else {
            console.log("Número de butacas reservadas:", butacasIds.length);
        }
        const bodyData = {
            reserva: {
                idCliente: reservaData.idCliente,
                idFuncion: reservaData.idFuncion,
                fechaReserva: reservaData.fechaReserva,
                cantidadEntradas: reservaData.cantidadEntradas,
                idEstado: reservaData.idEstado,
                idCompra: reservaData.idCompra
            },
            butacasIds: butacasIds
        };

        const response = await fetch('https://localhost:7170/api/Reserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bodyData),
        });
        console.log(response.body)
        if (response.ok) {
            const successToastElement = document.getElementById('successToast');
            if (successToastElement) {
                const successToast = new bootstrap.Toast(successToastElement);
                successToast.show();
            }

            mostrarTickets(butacasIds, reservaData);
            // Cambiar el estado de las butacas seleccionadas
            for (const idButaca of butacasIds) {
                const butacaElement = document.querySelector(`[data-id="${idButaca}"]`);
                if (butacaElement) {
                    // Cambiar imagen y clase a "reservado"
                    butacaElement.querySelector('.butaca_img').src = '/IMAGES/Reservado.png';
                    butacaElement.classList.remove('butaca');
                    butacaElement.classList.add('butaca_ocupada');
                    butacaElement.setAttribute('onclick', ''); // Deshabilitar clic en la butaca
                }
            }
        }   else {
            const errorData = await response.json(); // Captura el cuerpo de la respuesta de error
            console.error('Error en la respuesta:', errorData);

            // Muestra el mensaje de error en el toast
            const errorToastElement = document.getElementById('errorToast');
            if (errorToastElement) {
                errorToastElement.classList.add('toast-error');
                errorToastElement.innerText = `Error al realizar la reserva: ${errorData.message || 'Error desconocido'}`;
                const errorToast = new bootstrap.Toast(errorToastElement);
                errorToast.show();
            }
                throw new Error('No se pudo realizar la reserva');
        }
    } catch (error) {
        console.error('Error al realizar la reserva:', error);
        const errorToastElement = document.getElementById('errorToast');
        if (errorToastElement) {
            errorToastElement.classList.add('toast-error');
            errorToastElement.innerText = `Error al realizar la reserva: ${error.message}`;
            const errorToast = new bootstrap.Toast(errorToastElement);
            errorToast.show();
        }
    }
}
function mostrarTickets(butacasIds, reservaData) {
    
    const mainContent = document.getElementById('contenedor_tickets');
    
     
    if (mainContent) {
        

        butacasIds.forEach((id) => {
            const ticket = document.createElement('div');
            ticket.className = 'ticket bg-light text-dark p-4 rounded mb-3 shadow-sm';
            ticket.innerHTML = `
                <h3 class="text-center mb-3">Ticket de Reserva</h3>
                <p><strong>N° Butaca:</strong> ${id}</p>
                <p><strong>Película:</strong> ${reservaData.pelicula}</p>
                <p><strong>Sala:</strong> ${reservaData.sala}</p>
                <p><strong>Función:</strong> ${reservaData.funcion}</p>
                <p><strong>Precio:</strong> $${reservaData.precio}</p>
                <p class="barcode">|||||||||||||||||||||||</p>
                `;
            mainContent.appendChild(ticket);
        });
        //mainContent.appendChild(ticktetsContainer);
    } else {
        console.error("Elemento 'main-content' no encontrado en el DOM");
    }
}
function limpiarTicket() {
    // Ocultar el contenedor del ticket
    const tickets = document.querySelectorAll('.ticket'); // Selecciona todos los elementos con la clase 'ticket'
  tickets.forEach(ticket => {
    ticket.remove(); // Elimina cada ticket del DOM
    console.log('Limpiando tickets...');
    const contenedorTickets = document.getElementById('contenedor_tickets'); 
    if (contenedorTickets) { 
        contenedorTickets.innerHTML = ''; 
    }
  });
}

