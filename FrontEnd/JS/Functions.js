function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    updateContentMargin();
}

function updateContentMargin() {
    const sidebar = document.getElementById('sidebar');
    const contenido = document.querySelector('.contenido');

    if (sidebar.classList.contains('active')) {
        contenido.style.marginLeft = '100px'; // Ajusta según el ancho de tu sidebar
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

function ValidarLogin(){
    const login={
        usu: 'PEpe',
        clave: 'clave123'
    }
    const $usuario = document.getElementById('Usu')
    const $clave = document.getElementById('i-con')

    if($usuario.value === ''){
        alert('¡Debe ingresar un Usuario!')
        return false
    }
    if($clave.value === ''){
        alert('¡Debe ingresar un contraseña!')
        return false
    }
    if($usuario.value != login.usu || $clave.value != login.clave){
        alert('¡Usuario o contraseña incorrectas!')
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