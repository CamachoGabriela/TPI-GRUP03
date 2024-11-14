// Función para realizar el login y obtener el token
async function realizarLogin(event) {
    event.preventDefault();  // Prevenir la recarga de la página al enviar el formulario

    const $email = document.getElementById("email").value;
    const $password = document.getElementById("i-con").value;

    // Validar si los campos están vacíos
    if (!$email || !$password) {
        showError("¡Por favor, ingresa tu email y contraseña!");
        return; // Detener la ejecución si los campos están vacíos
    }


    const datos = {
        email: $email,
        contrasenha: $password
    };

    console.log("Datos a enviar:", datos);  // Imprimir los datos antes de enviar

    try {
        const response = await fetch("https://localhost:7170/api/Usuario/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const errorData = await response.json();  // Obtener el cuerpo de la respuesta
            console.log('Error en la respuesta del servidor:', errorData);
            showError('Credenciales incorrectas');
            return; // Evitar continuar si la respuesta no es correcta
        }

        // Intentar parsear la respuesta JSON
        let data;
        try {
            data = await response.json();
            console.log("Respuesta del servidor:", data); // Imprimir la respuesta del servidor para ver si contiene el token
        } catch (jsonError) {
            showError('La respuesta no es un JSON válido');
            return;
        }

        // Si recibimos un token, lo almacenamos en localStorage
        if (data && data.token) {
            console.log("Token recibido:", data.token);  // Imprimir el token en la consola
            localStorage.setItem("jwt", data.token);  // Guardar el token en localStorage

            // Decodificar el token para obtener el rol y mostrarlo
            const decodedToken = decodificarToken(data.token);
            if (decodedToken) {
                const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                if (role) {
                    console.log("Rol del usuario:", role); // Mostrar el rol en consola
                } else {
                    console.error("Rol no encontrado en el token.");
                }
            }

            // Después de mostrar el rol, redirigimos a la página principal (o realizamos otras acciones)
            window.location.href = "/PAGES/consulta_butacas.html";  // Redirigir a la página principal después del login exitoso
        } else {
            showError('No se recibió un token válido');
        }
    } catch (error) {
        console.error('Error al iniciar sesión: ', error);
        showError(error.message);
    }
}

// Función para mostrar los mensajes de error
function showError(message) {
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.classList.remove("d-none");
    errorMessageElement.innerText = message;
}

// Función para decodificar el token JWT y mostrar el payload en consola
function decodificarToken(token) {
    try {
        // Separar el token en sus tres partes
        const partes = token.split('.');

        // Decodificar la segunda parte del JWT (Payload)
        const payloadBase64 = partes[1];

        // Decodificar de Base64Url a Base64 (porque JWT usa Base64Url, que es un poco diferente)
        const payloadBase64Decoded = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

        // Convertir de Base64 a texto
        const decodedPayload = atob(payloadBase64Decoded);

        // Convertir el texto JSON a objeto
        const payload = JSON.parse(decodedPayload);

        return payload;  // Devolver el payload decodificado
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
}




// Función para mostrar los mensajes de error
function showError(message) {
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.classList.remove("d-none");
    errorMessageElement.innerText = message;
}



// Asociar la función al evento de submit del formulario
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", realizarLogin);
})

function MostrarContra(){
    const $pass = document.getElementById("i-con");
    $icon = document.querySelector(".bx");
    $icon.addEventListener("click", e => {
    if($pass.type === "password"){
    $pass.type = "text";
    }else{
    $pass.type = "password";
    }
    })
}