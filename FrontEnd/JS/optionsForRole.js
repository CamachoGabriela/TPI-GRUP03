// Función para mostrar contenido según el rol del usuario
function mostrarContenidoSegunRol(role) {
    console.log("Rol recibido:", role);  // Verifica qué valor está recibiendo 'role'

    const elements = {
        $indexLink: document.getElementById("index-link"),
        $loginLink: document.getElementById("login-link"),
        $registerLink: document.getElementById("register-link"),
        $reservarLink: document.getElementById("reserva-link"),
        $reportLink: document.getElementById("report-link"),
        $reportvLink: document.getElementById("reportV-link"),
        $analisisLink: document.getElementById("analisis-link"),
        $logoutItem: document.getElementById("logout-item"),
        $indexSidebar: document.getElementById("index-sidebar-link"),
        $loginSidebar: document.getElementById("login-sidebar-link"),
        $registerSidebar: document.getElementById("register-sidebar-link"),
        $reservarSidebar: document.getElementById("reserva-sidebar-link"),
        $reportSidebar: document.getElementById("report-sidebar-link"),
        $reportvSidebar: document.getElementById("reportv-sidebar-link"),
        $analisisSidebar: document.getElementById("analisis-sidebar-link"),
        $userlink: document.getElementById("user-link")
    };

    // Comprobar si los elementos existen
    for (const key in elements) {
        if (!elements[key]) {
            console.error(`Error: El elemento con id "${key}" no se encuentra en el DOM.`);
            return;  // Si algún elemento no se encuentra, salimos de la función
        }
    }

    // Primero ocultamos todos los enlaces de la barra de navegación y el sidebar
    for (const key in elements) {
        elements[key].style.display = 'none';
    }

    // Si no hay rol (usuario no autenticado), mostrar solo Home y Login/Register
    if (!role) {
        elements.$indexLink.style.display = 'block';
        elements.$loginLink.style.display = 'block';
        elements.$registerLink.style.display = 'block';
        elements.$indexSidebar.style.display = 'block';
        elements.$loginSidebar.style.display = 'block';
        elements.$registerSidebar.style.display = 'block';
    } else if (role === 'User') {
        elements.$indexLink.style.display = 'block';
        elements.$reservarLink.style.display = 'block';
        elements.$indexSidebar.style.display = 'block';
        elements.$reservarSidebar.style.display = 'block';
        elements.$userlink.style.display = 'block';
    } else if (role === 'Admin') {
        elements.$indexLink.style.display = 'block';
        elements.$reservarLink.style.display = 'block';
        elements.$reportLink.style.display = 'block';
        elements.$reportvLink.style.display = 'block';
        elements.$analisisLink.style.display = 'block';
        elements.$indexSidebar.style.display = 'block';
        elements.$reservarSidebar.style.display = 'block';
        elements.$reportSidebar.style.display = 'block';
        elements.$reportvSidebar.style.display = 'block';
        elements.$analisisSidebar.style.display = 'block';
        elements.$userlink.style.display = 'block';
    }

    // Mostrar el botón de cerrar sesión solo si el usuario está autenticado
    if (role) {
        elements.$logoutItem.style.display = 'block';
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("jwt");  // Obtener el token del localStorage

    // Decodifica el token si existe y obtén el rol
    if (token) {
        const payload = decodificarToken(token); // Tu función para decodificar el token
        const role = payload ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;
        mostrarContenidoSegunRol(role);  // Mostrar contenido basado en el rol
    } else {
        mostrarContenidoSegunRol(null);  // Si no hay token, mostrar solo las opciones de login
    }
});