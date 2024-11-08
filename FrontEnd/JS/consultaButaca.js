document.getElementById('boton_consultar').addEventListener('click', async function() {
    const $div = document.getElementById('butacas_cargadas');
    const $selectS = document.getElementById('sala_select');
    const idSala = $selectS.options[$selectS.selectedIndex].value;
    const $selectF =  document.getElementById('funcion_select');
    const funcion =  $selectF.options[$selectF.selectedIndex].value;
    const $ocultar = document.getElementById('hide');
    $div.innerHTML = '';
    let images = '';
    $ocultar.style.display = 'none';
    $div.style.display = 'flex'; 
    try
    {
        await fetch(`https://localhost:7170/api/Butaca/Sala/${idSala}`)
        .then(res => {
            if (!res.ok)
                {
                    console.error('Ha ocurrido un error al cargar los datos: ' + res.statusText);
                }
            return res.json();
        })
        .then(data => {
            console.log('Datos cargados con exito. cant: ' + data.length)
            
            let top;
            let left;
            let left_init = 300; //posicion de inicio
            let cont = 0;
            for (let i = 0; i < data.length/10; i++) {
                for (let j = 0; j < 10; j++) {
                    top =  138 + i * 70;
                    left =  left_init + j * 66;
                    if (j === 2 || j === 6){left += 132} //pasillos entre las butacas
                    images +=
                    `
                    <div class="butaca" onclick="toggleSelected(this)"data-id="${data[cont].idButaca}">
                        <img class="butaca_img" src="/IMAGES/butaca.png" alt="butaca" style="top: ${top}px;left: ${left}px;">
                        <p class="align-middle mb-2" style="font-size: 0.6em;">${data[cont].nroButaca}</p>
                    </div>
                    `
                    cont ++;
                }
                left_init = 300;
            }
            $div.innerHTML = images
        })
    }catch(error){
        alert('error al cargar los datos');
    }
})

function toggleSelected(element) {
    element.classList.toggle('selected');
}

async function datos_butaca(idButaca,idSala,fila,funcion){
    const $div = document.getElementById('datos_butaca')
    $div.innerHTML = '';

    try
    {
        await fetch(`https://localhost:7170/api/Butaca/EstaDisponible?idSala=${idSala}&idFuncion=${funcion}&idButaca=${idButaca}`)
        .then(res => {
            if (!res.ok)
                {
                    console.error('Ah ocurrido un error al cargar los datos: ' + res.statusText);
                }
            return res.text();
        })
        .then(data => {
            $div.innerHTML =
            `
                <h3>Datos de la butaca</h3>
                <p>N° de butaca: ${idButaca}</p>
                <p>Fila: ${fila}</p>
                <p>Estado: ${data}</p>
            `
        })
    }catch{alert('error al cargar los datos');}

}

/*
<h3>Datos de la butaca</h3>
<p>N° de la butaca: </p>
<p>Sala de la butaca: </p>
<p>Estado: </p>
<h4>Funciones de la Reserva</h4>
<p>Funcion: </p>
*/