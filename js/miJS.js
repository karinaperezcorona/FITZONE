
class Usuario {
    constructor(user, pass, rol, url) {
        this.user = user;
        this.pass = pass;
        this.rol = rol;
        this.url = url;
    }

    validar(inputUser, inputPass) {
        return this.user.toLowerCase() === inputUser.toLowerCase() && this.pass === inputPass;
    }
}

const base = [
   
    new Usuario('cliente', '123', 'cliente', 'perfil.html'),
    new Usuario('entrenador', '123', 'entrenador', 'perfilEntrenador.html'),
    new Usuario('admin', '123', 'admin', 'administrador.html'),
   
    

    new Usuario('cliente@fitzone.com', '123', 'cliente', 'perfil.html'),
    new Usuario('entrenador@fitzone.com', '123', 'entrenador', 'perfilEntrenador.html'),
    new Usuario('admin@fitzone.com', '123', 'admin', 'administrador.html'),
    new Usuario('karina@gmail.com', '123', 'cliente', 'perfil.html'),
    new Usuario('alex@fitzone.com', '123', 'entrenador', 'perfilEntrenador.html')
];


// Iniciar sesión
function iniciarSesion(e) {
    if (e) e.preventDefault();

    const inputUser = document.querySelector('input[type="email"], input[type="text"]').value.trim();
    const inputPass = document.querySelector('input[type="password"]').value.trim();

    const usuarioAutenticado = base.find(u => u.validar(inputUser, inputPass));

    if (usuarioAutenticado) {
     
        sessionStorage.setItem('sesionActiva', JSON.stringify(usuarioAutenticado));

        window.location.href = usuarioAutenticado.url;
    } else {
        alert('Credenciales incorrectas.\n\nEjemplos para entrar:\n- Rol Cliente: usuario "cliente" o "cliente@fitzone.com" y clave "123"\n- Rol Entrenador: usuario "entrenador" o "entrenador@fitzone.com" y clave "123"\n- Rol Admin: usuario "admin" o "admin@fitzone.com" y clave "123"');
    }
}

// Cerrar sesión
function cerrarSesion(e) {
    if (e) e.preventDefault();
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmar) {
        sessionStorage.removeItem('sesionActiva');
        window.location.href = 'iniciarSesion.html';
    }
}


function verificarAcceso(rolRequerido) {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));

    if (!sesion) {
      
        alert('Debes iniciar sesión para acceder a este perfil.');
        window.location.href = 'iniciarSesion.html';
    } else if (sesion.rol !== rolRequerido && sesion.rol !== 'admin') {
        
        alert('No tienes permiso para ver este perfil. Redirigiendo a tu página correspondiente...');
        window.location.href = sesion.url;
    }
}


function saltarLoginSiAutenticado() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (sesion) {
        window.location.href = sesion.url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pagina = window.location.pathname.toLowerCase();

    if (pagina.includes('iniciarsesion.html')) {
        saltarLoginSiAutenticado();

        const form = document.querySelector('.login-form');
        const btnLogin = document.querySelector('.btn-neon');

        if (form) {
            form.noValidate = true;
            form.addEventListener('submit', iniciarSesion);
        }
        if (btnLogin) btnLogin.addEventListener('click', iniciarSesion);

    } else if (pagina.includes('administrador.html')) {
        verificarAcceso('admin');

        const btnsCerrar = document.querySelectorAll('.menu-logout, .btn-logout-header');
        btnsCerrar.forEach(btn => btn.addEventListener('click', cerrarSesion));

    } else if (pagina.includes('perfilentrenador.html')) {
        verificarAcceso('entrenador');

        const btnsCerrar = document.querySelectorAll('.btn-logout-header, header a[href="iniciarSesion.html"]');
        btnsCerrar.forEach(btn => btn.addEventListener('click', cerrarSesion));

  
    } else if (pagina.includes('perfil.html')) {
        verificarAcceso('cliente');

        const btnCerrar = document.querySelector('.menu-logout');
        if (btnCerrar) btnCerrar.addEventListener('click', cerrarSesion);
    }
});
