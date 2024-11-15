
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clienteForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await confirmarDatos();
    });
});

function isJson(response) { 
    const contentType = response.headers.get('content-type'); 
    return contentType && contentType.indexOf('application/json') !== -1; 
}

async function confirmarDatos() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const idTipoDoc = document.getElementById('idTipoDoc').value;
    const nroDoc = document.getElementById('nroDoc').value;
    const fechaNac = document.getElementById('fechaNac').value;
    const idBarrio = document.getElementById('idBarrio').value;
    const calle = document.getElementById('calle').value;
    const altura = document.getElementById('altura').value;
    const email = document.getElementById('email').value;
    const contrasenha = document.getElementById('contrasenha').value;
    const confirmarContrasenha = document.getElementById('confirmarContrasenha').value; 
    const rol = 'User'; // Asignación del rol por defecto
    
    if (contrasenha !== confirmarContrasenha) { 
        alert('Las contraseñas no coinciden.'); 
        return; 
    }

    // Datos para la solicitud POST a /api/Cliente
    const clienteData = {
        nombre: nombre,
        apellido: apellido,
        idTipoDoc: parseInt(idTipoDoc),
        nroDoc: nroDoc,
        fechaNac: new Date(fechaNac).toISOString(),
        idBarrio: parseInt(idBarrio),
        calle: calle,
        altura: parseInt(altura),
        estado: true
    };

    // Hacer la solicitud POST a /api/Cliente
    try {
        const clienteResponse = await fetch('https://localhost:7170/api/Cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        });

        if (!clienteResponse.ok) {
            throw new Error('Error al crear cliente');
        }

         // Esperar un momento para que el registro se complete en la base de datos
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Obtener el último cliente con el nombre y apellido ingresados
        const filtrarClienteResponse = await fetch(`https://localhost:7170/api/Cliente/Filtrar?nombre=${nombre}&apellido=${apellido}`);
        if (!filtrarClienteResponse.ok) {
        throw new Error('Error al filtrar clientes');
        }

        const clienteFiltrado = await filtrarClienteResponse.json();
        
        // Ordenar clientes filtrados por idCliente y seleccionar el último
        const idCliente = Array.isArray(clienteFiltrado) ? clienteFiltrado.sort((a, b) => b.idCliente - a.idCliente)[0].idCliente : clienteFiltrado.idCliente;

        if (!idCliente) {
        throw new Error('No se encontró el cliente recién creado');
        }

        // Datos para la solicitud POST a /api/Usuario
        const usuarioData = {
            email: email,
            contrasenha: contrasenha,
            rol: rol,
            idCliente: idCliente,
            estado: true
        };

        // Hacer la solicitud POST a /api/Usuario
        const usuarioResponse = await fetch('https://localhost:7170/api/Usuario/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioData)
        });

        if (!usuarioResponse.ok) {
            const errorText = await usuarioResponse.text
            throw new Error('Error al crear usuario: ' + errorText);
        }

        alert('Cliente y usuario creados exitosamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar la solicitud.');
    }
}

document.addEventListener('DOMContentLoaded', async () => { 
    try {
        await cargar_tipos_doc();
    } catch (error) {
        console.error('Ha ocurrido un error al cargar los tipos de documento:', error);
    }
});

async function cargar_tipos_doc() {
    const $docSelect = document.getElementById('idTipoDoc');

    try {
        // Añadir una opción en blanco al principio
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.text = 'Seleccione el tipo de documento';
        $docSelect.appendChild(emptyOption);

        // Obtener tipos de documento sin necesidad de token
        const responseDoc = await fetch('https://localhost:7170/api/Cliente/TipoDoc', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!responseDoc.ok) {
            throw new Error('Error al cargar los tipos de documento: ' + responseDoc.statusText);
        }

        // Verifica la estructura de los datos recibidos
        const tiposDocData = await responseDoc.json();
    

        // Usar las propiedades correctas (idTipoDoc y tipoDoc)
        tiposDocData.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.idTipoDoc;       // Usa idTipoDoc como el valor
            option.text = tipo.tipoDoc;          // Usa tipoDoc como el texto visible
            $docSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando los tipos de documento:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => { 
    try {
        await cargar_barrios();
    } catch (error) {
        console.error('Ha ocurrido un error al cargar los barrios:', error);
    }
});

async function cargar_barrios() {
    const $barriosSelect = document.getElementById('idBarrio');  // Cambié el nombre de la variable para reflejar que es para barrios

    try {
        // Añadir una opción en blanco al principio
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.text = 'Seleccione el barrio';
        $barriosSelect.appendChild(emptyOption);

        // Haciendo la solicitud a la API para cargar los barrios
        const responseBarrios = await fetch('https://localhost:7170/api/Cliente/Barrio', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!responseBarrios.ok) {
            throw new Error('Error al cargar los barrios: ' + responseBarrios.statusText);
        }

        const barriosData = await responseBarrios.json();
        // Itera sobre los barrios y agrega las opciones al select
        barriosData.forEach(bar => {
            const option = document.createElement('option');
            option.value = bar.idBarrio;   // Usa idBarrio como valor
            option.text = bar.barrio1;     // Usa barrio1 como nombre visible
            $barriosSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando los barrios:', error);
    }
}
