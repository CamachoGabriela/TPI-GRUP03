function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    updateContentMargin();
}

function updateContentMargin() {
    const sidebar = document.getElementById('sidebar');
    const contenido = document.querySelector('.contenido');

    if (sidebar.classList.contains('active')) {
        contenido.style.marginLeft = '350px'; // Ajusta según el ancho de tu sidebar
    } else {
        contenido.style.marginLeft = '0';
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const botonMenu = document.querySelector('.boton-menu');

    // Verifica si el clic fue fuera del menú y el botón
    if (!sidebar.contains(event.target) && !botonMenu.contains(event.target)) {
        sidebar.classList.remove('active');
        updateContentMargin();
    }
});

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


function redireccionar() {
    
    window.location.href="/Index.html";
}