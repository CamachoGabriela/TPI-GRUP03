function toggleMenu() {
    const $sidebar = document.getElementById('sidebar');
    const $container =document.querySelector('.container');
    
    $sidebar.classList.toggle('active');
    $container.classList.toggle('active');
}

function updateContentWidth() {
    const $sidebar = document.getElementById('sidebar');
    const $contenido = document.querySelector('.contenido');
    $contenido.style.width = $sidebar.classList.contains('active')? 'calc(100% - 240px)' : '100%'; // Ajusta según el ancho del sidebar
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const botonMenu = document.querySelector('.boton-menu');
    const container = document.querySelector('.container');

    // Verifica si el clic fue fuera del menú y el botón
    if (!sidebar.contains(event.target) && !botonMenu.contains(event.target)) {
        sidebar.classList.remove('active');
        updateContentWidth();
    }
});

function ValidarLogin(){
    const $usuario = document.getElementById('email') ////VER
    const $clave = document.getElementById('i-con')

    if($usuario.value === ''){
        alert('¡Debe ingresar un Usuario!')
        return false
    }
    if($clave.value === ''){
        alert('¡Debe ingresar un contraseña!')
        return false
    }

    
}



function ValidarRegister(){
    const $nomApe = document.getElementById("nom");
    const $email = document.getElementById('emailInput');
    const $clave = document.getElementById('i-con');


    if($nomApe.value === ''){
        alert('¡Debe ingresar un Nombre y Apellido!');
        return false;
    }



    if($email.value === ''){
        alert('¡Debe ingresar un email!');
        return false;
    }

    if($clave.value === ''){
        alert('¡Debe ingresar un contraseña!');
        return false;
    }
    
    redireccionar();
}




function redireccionar() {
    
    window.location.href="/Index.html";
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

// Ejemplo de función para verificar si la sesión está activa
function isSessionActive() {
    return localStorage.getItem('sessionToken') !== null;
  }
  
  // Ejemplo de función para obtener el rol del usuario
  function getUserRole() {
    // Aquí debes implementar tu lógica para obtener el rol del usuario
    // Por ejemplo, podrías obtener el rol del usuario desde localStorage
    return localStorage.getItem('userRole');
  }
  
  // Función para mostrar u ocultar los elementos del menú de navegación y la barra lateral
  function updateMenuVisibility() {
    const reservaLink = document.getElementById('reserva-link');
    const reportLink = document.getElementById('report-link');
    const logoutItem = document.getElementById('logout-item');
    const userLink = document.getElementById('user-link');
  
    const reservaSidebarLink = document.getElementById('reserva-sidebar-link');
    const reportSidebarLink = document.getElementById('report-sidebar-link');
    const logoutButton = document.getElementById('logout-button');
  
    if (!isSessionActive()) {
      reservaLink.style.display = 'none';
      reportLink.style.display = 'none';
      logoutItem.style.display = 'none';
      userLink.style.display = 'none';
  
      reservaSidebarLink.style.display = 'none';
      reportSidebarLink.style.display = 'none';
      logoutButton.style.display = 'none';
    }
  
    if (getUserRole() !== 'Admin') {
      reportLink.style.display = 'none';
      reportSidebarLink.style.display = 'none';
    }
  }
  
  // Llamar a la función cuando se cargue la página
  document.addEventListener('DOMContentLoaded', updateMenuVisibility);
  