document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'Administrador.html';
        return;
    }

    const listaNotificaciones = document.getElementById('listaNotificaciones');
    const buscarInput = document.getElementById('buscarNotificacion');
    const filtroFecha = document.getElementById('filtroFecha');
    const btnCerrarSesion = document.getElementById('cerrarSesion');

    // Función para cargar las notificaciones
    async function cargarNotificaciones() {
        try {
            // Cargar desde localStorage
            const formularios = JSON.parse(localStorage.getItem('formularios') || '[]');
            console.log('Formularios desde localStorage:', formularios);
            
            // Cargar desde el archivo
            const response = await fetch('data/mensajes.json');
            console.log('Respuesta del archivo:', response);
            const data = await response.json();
            console.log('Datos del archivo:', data);
            
            // Combinar mensajes de ambas fuentes y eliminar duplicados
            const todosMensajes = [...formularios, ...(data.mensajes || [])];
            const mensajesUnicos = todosMensajes.filter((mensaje, index, self) =>
                index === self.findIndex((m) => m.fecha === mensaje.fecha)
            );
            
            // Limpiar lista actual
            listaNotificaciones.innerHTML = '';

            if (mensajesUnicos.length === 0) {
                listaNotificaciones.innerHTML = '<p class="no-notificaciones">No hay notificaciones disponibles.</p>';
                return;
            }

            // Mostrar cada notificación
            mensajesUnicos.forEach(form => {
                const notificacion = document.createElement('div');
                notificacion.className = 'notificacion';
                notificacion.innerHTML = `
                    <div class="notificacion-header">
                        <h3>${form.nombre} ${form.apellido}</h3>
                        <span class="notificacion-fecha">${new Date(form.fecha).toLocaleDateString()}</span>
                    </div>
                    <div class="notificacion-contenido">
                        <div class="notificacion-contacto">
                            <span><i class="far fa-envelope"></i> ${form.email}</span>
                            <span><i class="far fa-phone"></i> ${form.telefono}</span>
                        </div>
                        <div class="notificacion-mensaje">
                            ${form.mensaje}
                        </div>
                    </div>
                `;
                listaNotificaciones.appendChild(notificacion);
            });
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
            listaNotificaciones.innerHTML = '<p class="no-notificaciones">Error al cargar las notificaciones.</p>';
        }
            
            // Combinar mensajes de ambas fuentes y eliminar duplicados
            const todosMensajes = [...formularios, ...(data.mensajes || [])];
            const mensajesUnicos = todosMensajes.filter((mensaje, index, self) =>
                index === self.findIndex((m) => m.fecha === mensaje.fecha)
            );
            
            // Limpiar lista actual
            listaNotificaciones.innerHTML = '';

            if (mensajesUnicos.length === 0) {
                listaNotificaciones.innerHTML = '<p class="no-notificaciones">No hay notificaciones disponibles.</p>';
                return;
            }

            // Mostrar cada notificación
            mensajesUnicos.forEach(form => {
            const notificacion = document.createElement('div');
            notificacion.className = 'notificacion';
            notificacion.innerHTML = `
                <div class="notificacion-header">
                    <h3>${form.nombre} ${form.apellido}</h3>
                    <span class="notificacion-fecha">${new Date(form.fecha).toLocaleDateString()}</span>
                </div>
                <div class="notificacion-contenido">
                    <div class="notificacion-contacto">
                        <span>📧 ${form.email}</span>
                        <span>📞 ${form.telefono}</span>
                    </div>
                    <div class="notificacion-mensaje">
                        ${form.mensaje}
                    </div>
                </div>
            `;
            listaNotificaciones.appendChild(notificacion);
        });
    }

    // Función para filtrar notificaciones
    function filtrarNotificaciones() {
        const busqueda = buscarInput.value.toLowerCase();
        const filtro = filtroFecha.value;
        const notificaciones = document.querySelectorAll('.notificacion');

        notificaciones.forEach(notif => {
            const texto = notif.textContent.toLowerCase();
            const fecha = new Date(notif.querySelector('.notificacion-fecha').textContent);
            let mostrar = texto.includes(busqueda);

            if (mostrar && filtro !== 'todos') {
                const hoy = new Date();
                const diff = hoy - fecha;
                const dias = diff / (1000 * 60 * 60 * 24);

                switch(filtro) {
                    case 'hoy':
                        mostrar = dias < 1;
                        break;
                    case 'semana':
                        mostrar = dias < 7;
                        break;
                    case 'mes':
                        mostrar = dias < 30;
                        break;
                }
            }

            notif.style.display = mostrar ? 'block' : 'none';
        });
    }

    // Event listeners
    buscarInput.addEventListener('input', filtrarNotificaciones);
    filtroFecha.addEventListener('change', filtrarNotificaciones);

    btnCerrarSesion.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'Administrador.html';
    });

    // Agregar funcionalidad al botón de limpiar notificaciones
    const btnLimpiarNotificaciones = document.getElementById('limpiarNotificaciones');
    btnLimpiarNotificaciones.addEventListener('click', async function() {
        try {
            // Limpiar localStorage
            localStorage.removeItem('formularios');
            
            // Limpiar el archivo JSON
            await fetch('guardar_mensaje.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'clear' })
            });

            // Limpiar la interfaz
            listaNotificaciones.innerHTML = '<p class="no-notificaciones">No hay notificaciones disponibles.</p>';

            // Mostrar confirmación
            alert('Todas las notificaciones han sido eliminadas.');
        } catch (error) {
            console.error('Error al limpiar notificaciones:', error);
            alert('Error al limpiar las notificaciones. Por favor, intente de nuevo.');
        }
    });

    // Cargar notificaciones iniciales
    cargarNotificaciones();
});