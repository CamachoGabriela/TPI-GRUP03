async function cargar_pagina() {
  const $contenido = document.getElementById('contenido');
  const resF = await fetch('https://localhost:7170/api/Funcion/FuncionesNavi');
  if (!resF.ok)
  {
    console.error('Ha ocurrido un error al cargar las funciones: ' + resF.statusText);
    return;
  }
  const funciones = await resF.json();
  let cargaReservas = ''
  let butacasReservadas = ''
  let clienteId = 6
  let cont = 0;

  const resR = await fetch(`https://localhost:7170/api/Reserva/Cliente/${clienteId}`)
  if (!resR.ok)
  {
    console.error('Ha ocurrido un error al cargar las funciones: ' + resR.statusText);
    return;
  }
  const reservas = await resR.json();

  if(resR != null)
  {
    await reservas.forEach(r => {

      r.butacasReservada.forEach(br => {
        const funcion = funciones.find(f => f.idFuncion === r.idFuncion)
        const funcDesc = funcion.descripcion
        const peli = funcion.peliculaDescripcion
        const sala = funcion.salaDescripcion
        
        let butacaR = funcDesc+','+peli+','+funcion.precioBase+','+br.idButaca+','+sala+'|'

        butacasReservadas += butacaR;
      })
      cont ++
      const funcion = funciones.find(f => f.idFuncion === r.idFuncion)
      const funcDesc = funcion.descripcion
      const peli = funcion.peliculaDescripcion
      const partes = r.fechaReserva.split('-');
      const fechaReserva = `${partes[2].substring(0, 2)}/${partes[1]}/${partes[0]}`;

      cargaReservas +=
      `
      <div class="reserva" data-id="${r.idReserva}">
        <div class="item"><b>#${cont}</b></div>
        <div class="item">Pelicula: <b>${peli}</b></div>
        <div class="item">Fecha de Reserva: <b>${fechaReserva}</b></div>
        <div class="item">Función: <b>${funcDesc}</b></div>
        <button class="btn btn-danger" onclick="modificar_reserva('${butacasReservadas}',${r.idReserva},'delete')" style="padding: 10px;"><i class="bi bi-x-square"></i></button>
        <button class="btn btn-warning" onclick="modificar_reserva('${butacasReservadas}',${r.idReserva},'update')" style="padding: 10px;"><i class="bi bi-pencil-square"></i></button>
      </div>
      `
      butacasReservadas = '';
    });
  }
  const resU = await fetch(`https://localhost:7170/api/Cliente/${clienteId}`);
  if (!resU.ok)
  {
    console.error('Ha ocurrido un error al cargar las funciones: ' + resU.statusText);
    return;
  }
  const cliente = await resU.json();

  const partes = cliente.fechaNac.split('-');
  const fechaNac = `${partes[2].substring(0, 2)}/${partes[1]}/${partes[0]}`;
  let datosUsuario =
  `
    <p><b>Usuario: </b>${cliente.nombre+' '+cliente.apellido}</p>
    <p><b>Email: </b>${cliente.usuarios[0].email}</p>
    <p><b>Rol: </b>${cliente.usuarios[0].rol}</p>
    <p><b>Documento: </b>${cliente.idTipoDocNavigation.tipoDoc+' - '+cliente.nroDoc}</p>
    <p><b>Fecha de nacimiento: </b>${fechaNac}</p>
    <p><b>Direccion: </b>${cliente.idBarrioNavigation.barrio1}, ${cliente.calle}, ${cliente.altura}</p>
  `

  $contenido.innerHTML =
  `
  <h2><b>Reservas</b></h2>
  <div class="reservas">${cargaReservas}</div>
  <div class="contenedor_usuario">
    <h2><b>Datos del Usuario</b></h2>
    <div class="datos_usuario">${datosUsuario}</div>
  </div>
  <div id="toast">exaple</div>
  `
}

function modificar_reserva(detalles,id,evento) {
  const $contenido = document.getElementById('contenido');
  let detallesReservas = '';
  let cadenaCorreccion = detalles.replace(/\|$/, ''); //quitar | del final
  const butacasR = cadenaCorreccion.split('|'); //separar cada butaca reservada

  butacasR.forEach(e => {
    const datos = e.split(',');

    let funcionDesc = datos[0] //nombre de la funcion
    let peliculaDesc = datos[1] //nombre peli
    let costeFuncion = datos[2] //coste de la funcion
    let butaca = datos[3] //id butaca
    let salaDesc = datos[4] //nombre de la sala

    detallesReservas +=
    `
      <div class="cancelar-reserva">
        <div class="item"><b>Pelicula:${' '+peliculaDesc}</b></div>
        <div class="item"><b>función:${' '+funcionDesc}</b></div>
        <div class="item"><b>Número de la butaca:${' '+butaca}</b></div>
        <div class="item"><b>Sala:${' '+salaDesc}</b></div>
        <div class="item"><b>Coste: $${costeFuncion}</b></div>
      </div>
    `
  });
  if(evento === 'delete'){
    $contenido.innerHTML = 
    `
      <h2><b>Cancelar Reserva</b></h2>
      <div class="detalles-reservas">
        ${detallesReservas}
      </div>
      <div class="cancelar-botones">
        <h5>¿Está seguro de cancelar la reserva?</h5>
        <button onclick="confirmar_delete(${id})" class="btn btn-success">Confirmar</button>
        <button onclick="cargar_pagina()" class="btn btn-danger">Cancelar</button>
      </div>
    `
  } else {
    let inputs = ''
    for (let i = 0; i < butacasR.length; i++) {
      const partes = butacasR[i].split(',');
      inputs +=
      `
        <label for="detalle-${i+1}">${partes[3]+':'}</label>
        <input class="form-control" type="number" style="width: 90px;" name="detalle-${i+1}" id="detalle-${i+1}">
      `
    }
    $contenido.innerHTML = 
    `
      <h2><b>Cambiar Butacas</b></h2>
      <div class="detalles-reservas">
        ${detallesReservas}
      </div>
      <div class="cancelar-botones">
        <h5>¿Está seguro de cambiar las butacas?</h5>
        <div class="form-update">
        <p>Ingrese el número de las butacas nuevas</p>
          <form class="form">
            ${inputs}
          </form>
        </div>
        <button onclick="" class="btn btn-success">Confirmar</button>
        <button onclick="cargar_pagina()" class="btn btn-danger">Cancelar</button>
      </div>
      <div id="toast">exaple</div>
    `
  }
}

function confirmar_update() {
  console.log('xd');
}

function showToast(result,texto) {
  var toast = document.getElementById("toast");
  if (result === 'error') {
    toast.style.backgroundColor = 'red'; // Color de fondo rojo para error
  } else if (result === 'success') {
    toast.style.backgroundColor = 'green'; // Color de fondo verde para éxito
  }
  toast.textContent = texto
  toast.className = "show";
  setTimeout(function(){toast.className = toast.className.replace("show", "");}, 3000);
}

async function confirmar_delete(id) {
  let idReserva = Number(id);
  const res = await fetch(`https://localhost:7170/api/Reserva/${idReserva}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  await cargar_pagina();

  if (res.ok) {
    showToast('success', 'Reserva cancelada correctamente');
  } else {
    showToast('error', 'Error al cancelar la reserva');
  }
}