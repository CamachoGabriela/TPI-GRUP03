document.getElementById('boton_consultar').addEventListener('click', async function() {
    datos_butaca(null); //limpiar datos de la butaca
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
                //valida si es una butaca reservable
                if(data[cont].estado == 1 ){butaca_img =  'Ocupado.png';clase = 'butaca_ocupada';}
                //si es una butaca pendiente le pone la imagen correspondiente
                if(data[cont].estado == 2){butaca_img = 'reservado.png';clase = 'butaca_ocupada';}
                images += //creando las butacas
                `
                <div class="butaca" data-id="${data[cont].idButaca}" data-sala="${fpartes[0]}" data-pelicula="${$selectP.options[$selectP.selectedIndex].textContent}" data-funcion="${fpartes[2]}" data-precio="${fpartes[3]}" onclick="handleButacaClick(this)">
                    <img class="butaca_img" src="/IMAGES/${butaca_img}" alt="butaca">
                    <p class="align-middle mb-2" id="" style="font-size: 0.6em;">${data[cont].nroButaca}</p>
                </div>
                `
                cont ++;
            }
        }
        $div.innerHTML = images
    }catch(error){
        alert('error al cargar las butacas');
    }
})

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
    const id = element.getAttribute('data-id');
    const sala = element.getAttribute('data-sala');
    const pelicula = element.getAttribute('data-pelicula');
    const funcion = element.getAttribute('data-funcion');
    const precio = element.getAttribute('data-precio');

    // Llamar a toggleSelected para manejar la selección
    toggleSelected(element);

    // Si la butaca está seleccionada, mostrar sus datos
    if (element.classList.contains('selected')) {
        datos_butaca(`${id},${sala},${pelicula},${funcion},${precio}`);
        document.getElementById('datos_butaca').style.display = 'block'; // Mostrar datos_butaca
    } else {
        datos_butaca(null); // Limpiar los datos si se deselecciona
    }
}


document.getElementById('pelicula_select').addEventListener('change', cargar_funciones); //escucha de cambio del select de peliculas
async function cargar_funciones(){
    // Obtener funciones
    const $selectP = document.getElementById('pelicula_select');
    const $selectF =  document.getElementById('funcion_select');
    try
    {
        $selectF.innerHTML = ''
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

        //desactivar boton cuando el select no tenga ningún option
        if($selectF.childElementCount == 0) {
            document.getElementById('boton_consultar').disabled = true;
        }else if(document.getElementById('boton_consultar').disabled == true){
            document.getElementById('boton_consultar').disabled = false;
        }
    }
    catch (error) {console.error('Ha ocurrido un error al cargar las funciones: ', error);}
}

async function datos_butaca(datos = null){ //opcion de ser nulo para que si no se le pasa ningún parametro limpie los datos
    const $div = document.getElementById('datos_butaca')
    if(datos != null) {
        const bpartes = datos.split(','); //separando los datos recibidos desde un string
        const res = await fetch('https://localhost:7170/api/Butaca/Salas')
        if(!res.ok) {
            alert('error al cargar las salas');
            return
        }
        const data = await res.json();
        let sala = data.find(s => s.idSala == bpartes[1]) //obteniendo el nombre de las salas
        let precio = bpartes[3];
        $div.innerHTML = 
        `
            <div>
            <p>N° de la butaca: <span style="color: white;">${bpartes[0]}</span></p>        <!--el span es para poner los datos en color blanco-->
            <p>Sala de la butaca: <span style="color: white;">${sala.descripcion}</span></p>
            <p>Pelicula: <span style="color: white;">${bpartes[2]}</span></p>
            <p>Precio: <span style="color: white;">$${precio}</span></p>
            <div class="contenedor-btn d-flex justify-content-center">
            <input id="boton_reservar" type="button" class="btn btn-primary button" value="Reservar">
            <input id="boton_cancelar" type="button" class="btn btn-danger button" value="Cancelar">
            </div>
            <br><br><br><br><br><br><br>                <!--espacio para ver bien los datos, arreglar en css <3-->
            </div>
            `
    }
    else {
        $div.innerHTML = '';
    }
}
