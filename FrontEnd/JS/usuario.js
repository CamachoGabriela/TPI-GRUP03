let clienteId = 1; //usuario logeado
const token = localStorage.getItem('jwt');
async function cargar_pagina() {
  const $contenido = document.getElementById('contenido');
  const resF = await fetch('https://localhost:7170/api/Funcion/FuncionesNavi',{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}); 
  if (!resF.ok)
  {
    console.error('Ha ocurrido un error al cargar las funciones: ' + resF.statusText);
    return;
  }
  const funciones = await resF.json();
  let cargaReservas = ''
  let butacasReservadas = ''
  let cont = 0;

  let resR = await fetch(`https://localhost:7170/api/Reserva/Cliente/${clienteId}`,{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}); 
  if (!resR.ok)
  {
    console.error('Ha ocurrido un error al cargar las funciones: ' + resR.statusText);
    return;
  }
  const reservas = await resR.json();

  if(reservas != null)
  {
    await reservas.forEach(r => {

      r.butacasReservada.forEach(br => {
        const funcion = funciones.find(f => f.idFuncion === r.idFuncion)
        const funcDesc = funcion.descripcion
        const peli = funcion.peliculaDescripcion
        const sala = funcion.salaDescripcion
        console.log('esto no se muestra')
        let butacaR = funcDesc+','+peli+','+funcion.precioBase+','+br.idButaca+','+sala+','+funcion.idFuncion+','+funcion.idSala+'|'

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
      <div class="reserva " data-id="${r.idReserva}">
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
  let resU = await fetch(`https://localhost:7170/api/Cliente/${clienteId}`,{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}); 
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
    <div class="datos-usuario">${datosUsuario}</div>
  </div>
  <button class="btn btn-danger" type="button" onclick="editar_usuario('delete')">Eliminar Usuario</button>
  <button class="btn btn-warning" type="button" onclick="editar_usuario('update')">Editar Perfil</button>
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
    let idFuncion = datos[5]
    let idSala = datos[6]

    detallesReservas +=
    `
      <div class="cancelar-reserva">
        <div class="item"><b>Pelicula:${' '+peliculaDesc}</b></div>
        <div class="item" id="funcion-r" data-id="${idFuncion}" data-idSala="${idSala}"><b>función:${' '+funcionDesc}</b></div>
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
        <label for="detalle-${i+1}">${'N° '+partes[3]+':'}</label>
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
        <button onclick="confirmar_update(${id})" class="btn btn-success">Confirmar</button>
        <button onclick="cargar_pagina()" class="btn btn-danger">Cancelar</button>
      </div>
      <div id="toast">exaple</div>
    `
  }
}

function showToast(result,texto) {
  var toast = document.getElementById("toast");
  if (result === 'error') {
    toast.style.backgroundColor = 'red';
  } else if (result === 'success') {
    toast.style.backgroundColor = 'green';
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
      'Authorization': `Bearer ${token}`
    }
  });

  await cargar_pagina();

  if (res.ok) {
    showToast('success', 'Reserva cancelada correctamente');
  } else {
    showToast('error', 'Error al cancelar la reserva');
  }
}

async function confirmar_update(id) {
  let cancelar = false;
  const nButacas = document.getElementsByClassName('form-control')
  const divFuncion = document.getElementById('funcion-r')
  const idFuncion = Number(divFuncion.getAttribute('data-id'))
  const idSala = Number(divFuncion.getAttribute('data-idSala'))
  const resSala = await fetch('https://localhost:7170/api/Butaca/Salas',{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
  const salas = await resSala.json()
  const tamanioSala = salas.find(s => s.idSala === idSala).capacidad
  console.log('tamaño de la sala es:'+tamanioSala)

  let idButacas = []
  for (let i = 0; i < nButacas.length; i++) {

    idButacas.push(Number(nButacas[i].value))

    if(nButacas[i].value === '' || nButacas[i].value < 1 || nButacas[i].value > tamanioSala) {
      cancelar = true;
      showToast('error', 'Ingrese correctamente los números de las butacas');
      break
    }

    const resValidar = await fetch(`https://localhost:7170/api/Butaca/EstaDisponible?idSala=${idSala}&idFuncion=${idFuncion}&idButaca=${idButacas[i]}`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`
      }
    });if (resValidar.ok){
      const dataValidar = await resValidar.text()
      if(dataValidar === 'Butaca Ocupada') {
        cancelar = true;
        showToast('error', `La butaca N° ${idButacas[i]} está ocupada`);
        break
      }
    }

  }

  for (let i = 0; i < idButacas.length; i++) {
    for (let j = 0; j < idButacas.length; j++) {
      if(idButacas[j] === idButacas[i] && j != i){
        cancelar = true;
        showToast('error', `Hay números repetidos, ingrese nuevamente las butacas`);
        break
      }
    }
  }

  if(cancelar == true){
    return
  }

  const res = await fetch(`https://localhost:7170/api/Reserva/cambiar-butacas/${id}`, {
    method: 'PUT',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }, body: JSON.stringify(idButacas)
  });
  
  if (res.ok) {
    await cargar_pagina();
    showToast('success', 'Reserva actualizada con exito!');
  } else {
    showToast('error', 'Error al actualizar la reserva');
  }

}

async function editar_usuario(evento) {
  const $contenido = document.getElementById('contenido');
  const resU = await fetch(`https://localhost:7170/api/Cliente/${clienteId}`,{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
  if (!resU.ok)
  {
    console.error('Ha ocurrido un error al cargar las funciones: ' + resU.statusText);
    return;
  }
  const cliente = await resU.json();

  const partes = cliente.fechaNac.split('-');
  const fechaNac = `${partes[2].substring(0, 2)}/${partes[1]}/${partes[0]}`;
  let modif;
  let buttons;
  let tittle;
  if(evento == 'update')
  {
    tittle = '<h2><b>Editar Perfil</b></h2>'
    modif =
    `
      <div class="item-update">
          <label for="barrios"><b>Barrio: </b>${cliente.idBarrioNavigation.barrio1}</label>
          <select class="form-control" id="barrios"></select>
        </div>
        <div class="item-update">
          <label for="calle"><b>Calle: </b>${cliente.calle}<label>
          <input class="form-control" type="text" name="calle" id="calle">
        </div>
        <div class="item-update">
          <label for="altura"><b>Altura: </b>${cliente.altura}</label>
          <input class="form-control" type="number" name="altura" id="altura">
      </div>
    `
    buttons =
    `
      <h4><b>¿Está seguro de actualizar los datos?</b></h4>
      <button onclick="confirmar_usuario_update()" class="btn btn-success">Confirmar</button>
      <button onclick="cargar_pagina()" class="btn btn-danger">Cancelar</button>
    `
  } else {
    tittle = '<h2><b>Eliminar Perfil</b></h2>'
    modif =
    `
      <div class="item-update">
          <p>Barrio: ${cliente.idBarrioNavigation.barrio1}</p>
        </div>
        <div class="item-update">
          <p>Calle: ${cliente.calle}</p>
        </div>
        <div class="item-update">
          <p>Altura: ${cliente.altura}</p>
      </div>
    `
    buttons =
    `
      <h4><b>¿Está seguro de eliminar su perfil?</b></h4>
      <button onclick="confirmar_delete_usuario()" class="btn btn-success">Confirmar</button>
      <button onclick="cargar_pagina()" class="btn btn-danger">Cancelar</button>
    `
  }

  $contenido.innerHTML =
  `
    ${tittle}
    <div class="usuario-update">
      <form id="formulario-update" class="form">
        <div class="item-update">
          <p>Usuario: ${cliente.nombre+' '+cliente.apellido}</p>
        </div>
        <div class="item-update">
          <p>Email: ${cliente.usuarios[0].email}</p>
        </div>
        <div class="item-update">
          <p>Rol: ${cliente.usuarios[0].rol}</p>
        </div>
        <div class="item-update">
          <p>Documento: ${cliente.idTipoDocNavigation.tipoDoc+' - '+cliente.nroDoc}</p>
        </div>
        <div class="item-update">
          <p>Fecha de nacimiento: ${fechaNac}</p>
        </div>
        ${modif}
      </form>
      <div class="botones-update">
        ${buttons}
      </div>
    </div>
    <div id="toast">exaple</div>
  `
  const $selectB = document.getElementById('barrios')
  const resB = await fetch(`https://localhost:7170/api/Cliente/Barrios`,{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
  if (resB.ok)
  {
    const barrios = await resB.json();

    let opDefault = document.createElement('option');
    opDefault.value = -1;
    opDefault.textContent = 'Seleccione un barrio'
    $selectB.appendChild(opDefault)

    barrios.forEach(e => {
      let op = document.createElement('option')
      op.value = e.idBarrio
      op.textContent = e.barrio1
      $selectB.appendChild(op)
    });
  } else {
    console.error('Ha ocurrido un error al cargar los barrios: ' + resB.statusText);
    return;
  }

}

async function confirmar_usuario_update() {
  let cancelar = false;
  const $barriosS = document.getElementById('barrios');
  const $calleI = document.getElementById('calle');
  const $alturaI = document.getElementById('altura');

  if($barriosS.value == -1 && $calleI.value == '' && $alturaI.value == ''){
    cancelar = true;
    showToast('error','Debe ingresar al menos un dato para actualizar')
    return
  }
  if($alturaI.value != '') {
    if($alturaI.value <= 0 || $alturaI.value > 10000) {
      cancelar = true;
      showToast('error','Ingrese datos válidos para la edición')
      return
    }
  }

  if(cancelar == false) {
    let idBarrioI = -1;
    if($barriosS.value != -1){
      idBarrioI = $barriosS.value
    }
    let calleI = 'nulo';
    if($calleI.value != ''){
      calleI = $calleI.value
    }
    let alturaI = -1;
    if($alturaI.value != ''){
      alturaI = $alturaI.value
    }

    let clienteUpdate = {
      idCliente: clienteId,
      idBarrio: idBarrioI,
      calle: calleI,
      altura: alturaI
    }

    const resValidar = await fetch(`https://localhost:7170/api/Cliente/${clienteId}`, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, body: JSON.stringify(clienteUpdate)
    })

    if (resValidar.ok){
      await cargar_pagina();
      showToast('success','Datos guardados con exito!');
    } else {
      showToast('error','Error al guardar los datos')
    }

  }
}

async function confirmar_delete_usuario() {
  const res = await fetch(`https://localhost:7170/api/Cliente/${clienteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (res.ok) {
    window.location.href = '/index.html';
  } else {
    showToast('error', 'Error al eliminar el usuario');
  }
}