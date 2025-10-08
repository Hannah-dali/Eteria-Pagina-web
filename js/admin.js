document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMensaje = document.getElementById('error-mensaje');

    // Agregar evento beforeunload para cerrar sesión al salir
    window.addEventListener('beforeunload', function() {
        if (!window.location.href.includes('Administrador.html')) {
            localStorage.removeItem('adminLoggedIn');
        }
    });

    // Agregar evento para detectar cambios de página
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden' && !window.location.href.includes('Administrador.html')) {
            localStorage.removeItem('adminLoggedIn');
        }
    });

    // Credenciales fijas
    const CREDENCIALES = {
        username: 'admin',
        password: 'admin1234'
    };

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validar credenciales
        if (username === CREDENCIALES.username && password === CREDENCIALES.password) {
            // Guardar estado de login
            localStorage.setItem('adminLoggedIn', 'true');
            
            // Redirigir a notificaciones
            window.location.href = 'notificaciones-admin.html';
        } else {
            // Mostrar error
            errorMensaje.textContent = 'Usuario o contraseña incorrectos';
            errorMensaje.classList.add('visible');
            
            // Limpiar mensaje de error después de 3 segundos
            setTimeout(() => {
                errorMensaje.classList.remove('visible');
            }, 3000);
        }
    });

    // Verificar si ya está logueado
    if (localStorage.getItem('adminLoggedIn') === 'true' && 
        !window.location.href.includes('notificaciones-admin.html')) {
        window.location.href = 'notificaciones-admin.html';
    }
});