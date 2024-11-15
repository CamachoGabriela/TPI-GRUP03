// Función para realizar el login y obtener el token
async function realizarLogin(event) {
    event.preventDefault();  // Prevenir la recarga de la página al enviar el formulario

    const $email = document.getElementById("email").value;
    const $password = document.getElementById("i-con").value;

    // Validar si los campos están vacíos
    if (!$email || !$password) {
        mostrarToast("¡Por favor, ingresa tu email y contraseña!", 'warning');
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
            mostrarToast('Datos incorrectos', 'danger');
            return; // Evitar continuar si la respuesta no es correcta
        }

        // Intentar parsear la respuesta JSON
        let data;
        try {
            data = await response.json();
            console.log("Respuesta del servidor:", data); // Imprimir la respuesta del servidor para ver si contiene el token
        } catch (jsonError) {
            console.error('La respuesta no es un JSON válido');
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
            mostrarToast('Inicio de sesión exitoso, redirigiendo...', 'success'); 
            setTimeout(() => { 
                window.location.href = "/PAGES/consulta_butacas.html"; 
            }, 2000); // 2 segundos de retraso
        } else {
            console.Error('No se recibió un token válido');
        }
    } catch (error) {
        mostrarToast('Contraseña o usuario incorrectos', 'danger');
    }
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
        ` <div class="d-flex"> 
            <div class="toast-body"> ${mensaje} </div> 
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button> 
          </div> 
        `; 
    toastContainer.appendChild(toastEl); const toast = new bootstrap.Toast(toastEl); toast.show();
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