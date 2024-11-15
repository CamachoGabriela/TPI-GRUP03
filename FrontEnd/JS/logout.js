// Función de logout
function realizarLogout() {
    // Eliminar el token del localStorage
    localStorage.removeItem("jwt");

    // Verificar que el token se haya eliminado
    console.log('Token eliminado', localStorage.getItem('jwt'));  // Esto debería mostrar 'null' después del logout

    // Llamar a la función que oculta las opciones según el rol
    mostrarContenidoSegunRol(null);  // `null` indica que el usuario no está autenticado

    // Redirigir al login (o cualquier otra página que quieras después del logout)
    window.location.href = '/PAGES/login.html';  // O la URL que desees redirigir
}

// Esperar el clic en el botón de logout
document.getElementById("logout-btn").addEventListener("click", function() {
    realizarLogout();  // Llamamos a la función de logout
});