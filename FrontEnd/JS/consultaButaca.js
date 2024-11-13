async function cargar_butacas() { 
    datos_butaca([]); //limpiar datos de la butaca
    const $div = document.getElementById('butacas_cargadas');
    const $selectP = document.getElementById('pelicula_select');
    const $selectF =  document.getElementById('funcion_select');
    const funcion =  $selectF.options[$selectF.selectedIndex].value;
    
    $div.innerHTML = '';
    let images = '';
   
    $div.style.display = 'flex'; 
    try
    {
        const fpartes = await funcion.split(','); //al recibir un string y luego separarlo, se pueden asignar más de un id en el value de un option
        console.log(fpartes)
        let res = await fetch(`https://localhost:7170/api/Butaca/SalaFuncion?idSala=${fpartes[0]}&idFuncion=${fpartes[1]}`);
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
        $div.innerHTML = images
    }catch(error){
        console.error('error al cargar las butacas',error);
    }
}
// Función para actualizar el estado de una butaca 
async function actualizarEstadoButaca(idButaca, idFuncion, estado) { 
    try { 

        const response = await fetch(`https://localhost:7170/api/Reserva/actualizar-estado/${idButaca}?estado=${estado}&idFuncion=${idFuncion}`, {
            method: 'PUT', 
            headers: { 
                'Content-Type': 'application/json' 
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
        document.getElementById('datos_butaca').style.display = 'block'; // Mostrar el contenedor de datos
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

        const responseFunciones = await fetch(`https://localhost:7170/api/Funcion/Film/${$selectP.options[$selectP.selectedIndex].value}`);
        if (!responseFunciones.ok) {
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

async function datos_butaca(datosArray = []){ //opcion de ser nulo para que si no se le pasa ningún parametro limpie los datos
    const $div = document.getElementById('datos_butaca')
    if (!$div) { 
        console.error('No se encontró el elemento "datos_butaca" en el DOM.'); 
        return; 
    }

    $div.innerHTML = '';

    if(Array.isArray(datosArray) && datosArray.length > 0) {
        try {
            //const bpartes = datosArray.split(','); //separando los datos recibidos desde un string
            const res = await fetch('https://localhost:7170/api/Butaca/Salas')
            if(!res.ok) {
                alert('error al cargar las salas');
                return
            }
            const data = await res.json();
            //let sala = data.find(s => s.idSala == bpartes[1]) //obteniendo el nombre de las salas
            datosArray.forEach((datos) => {
                const bpartes = datos.split(','); // Separar los datos de la butaca
                const sala = data.find(s => s.idSala == bpartes[1]); // Encontrar la sala correspondiente
                const precio = bpartes[4];
                const numeroButaca = bpartes[0];
                const pelicula = bpartes[2];
    
                $div.innerHTML += 
                `
                    <div>
                    <p>N° Butaca: <span style="color: white;">${numeroButaca}</span></p>        <!--el span es para poner los datos en color blanco-->
                    <p>Película: <span style="color: white;">${pelicula}</span></p>
                    <p>Sala: <span style="color: white;">${sala.descripcion}</span></p>
                    <p>Precio: <span style="color: white;">$${precio}</span></p>
                    </div>
                    `;
            })
            $div.innerHTML += 
            `
                <div class="contenedor-btn d-flex justify-content-center">
                    <input id="boton_reservar" type="button" class="btn btn-secondary button" value="Reservar">
                    <input id="boton_cancelar" type="button" class="btn btn-dark button" value="Cancelar">
                </div>
            `;

            $div.addEventListener('click', function (event) {
                if (event.target.id === 'boton_cancelar') {
                    const confirmCancelToastElement = document.getElementById('confirmCancelToast');
                    const confirmCancelToast = new bootstrap.Toast(confirmCancelToastElement);
                    confirmCancelToast.show();
                } 
                else if (event.target.id === 'boton_reservar') {
                    const idCliente = 1  //document.getElementById('clienteId').value  agregar idCliente
                    const idFuncion = document.getElementById('funcion_select').value.split(',')[0];
                    const fechaReserva = new Date().toISOString();
                    const butacasSeleccionadas = document.querySelectorAll('.butaca.selected');
                    const cantidadEntradas =butacasSeleccionadas.length;
                    const idEstado = 2;
                    const idCompra = null;
                    let nombreSala = '';
                    let Precio = '';

                    datosArray.forEach((datos) => {
                        const bpartes = datos.split(','); // Separar los datos de la butaca
                        nombreSala = data.find(s => s.idSala == bpartes[1]); // Encontrar la sala correspondiente
                        Precio = bpartes[3];
                    });

                    const reservarData = {
                        idCliente: idCliente,
                        idFuncion: idFuncion,
                        fechaReserva: fechaReserva,
                        cantidadEntradas: cantidadEntradas,
                        idEstado: idEstado,
                        idCompra: idCompra,
                        pelicula: document.getElementById('pelicula_select').selectedOptions[0]?.text,
                        sala: nombreSala.descripcion,
                        funcion: document.getElementById('funcion_select').selectedOptions[0]?.text,
                        precio: Precio,  // Ajusta según la lógica de cálculo de precios
                    };
                    //obtener ids butacas seleccionadas
                    const butacasIds = Array.from(butacasSeleccionadas).map(b => b.getAttribute('data-id'));
                    //reservar
                    realizarReserva(butacasIds, reservarData);
                }
            });
        
            // Delegación de eventos para los botones del toast
            document.body.addEventListener('click', function (event) {
                if (event.target.id === 'confirmYes') {
                    const confirmCancelToastElement = document.getElementById('confirmCancelToast');
                    const confirmCancelToast = new bootstrap.Toast(confirmCancelToastElement);
                    confirmCancelToast.hide();
        
                    const cancelToastElement = document.getElementById('cancelToast');
                    const cancelToast = new bootstrap.Toast(cancelToastElement);
                    cancelToast.show();

                    document.getElementById('main-content').style.display = 'none';
                    
                } 
                else if (event.target.id === 'confirmNo') {
                    const confirmCancelToastElement = document.getElementById('confirmCancelToast');
                    const confirmCancelToast = new bootstrap.Toast(confirmCancelToastElement);
                    confirmCancelToast.hide();
                }
            });
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }           
}

async function realizarReserva(butacasIds, reservaData) {
    try {
        
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
                'Content-Type': 'application/json'
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
        }   else {
                throw new Error('No se pudo realizar la reserva');
        }
    } catch (error) {
        console.error('Error al realizar la reserva:', error);
        const errorToastElement = document.getElementById('errorToast');
        if (errorToastElement) {
            const errorToast = new bootstrap.Toast(errorToastElement);
            errorToast.show();
        }
    }
}
function mostrarTickets(butacasIds, reservaData) {
    const mainContent = document.getElementById('main-content');
    const $hideDiv = document.getElementById('hide');
    const $contenedor = document.getElementById('contenedor-butacas');
    if ($hideDiv) {
        $hideDiv.style.display = 'none';
    } else {
        console.warn("Elemento 'hide' no encontrado");
    }

    if ($contenedor) {
        $contenedor.style.display = 'none';
    } else {
        console.warn("Elemento 'contenedor-butacas' no encontrado");
    }
     
    if (mainContent) {
        const ticktetsContainer = document.createElement('div');
        ticktetsContainer.className = 'ticktets-container p-4 rounded mb-4';

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
                <p class="barcode">|||||||||||||||||||||||||||||||||||||||</p>
            `;
            ticktetsContainer.appendChild(ticket);
        });
        mainContent.appendChild(ticktetsContainer);
    } else {
        console.error("Elemento 'main-content' no encontrado en el DOM");
    }
}

