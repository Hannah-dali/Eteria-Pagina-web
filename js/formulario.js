document.addEventListener('DOMContentLoaded', function() {
    console.log('Formulario JS cargado');
    const formulario = document.getElementById('formularioContacto');
    const mensajeExito = document.getElementById('mensajeExito');

    if (!formulario) {
        console.error('No se encontró el formulario');
        return;
    }

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado');

        // Obtener los datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('correo').value,
            mensaje: document.getElementById('mensaje').value,
            fecha: new Date().toISOString()
        };

        // Obtener formularios existentes o crear array vacío
        let formularios = JSON.parse(localStorage.getItem('formularios') || '[]');
        
        // Agregar nuevo formulario
        formularios.push(formData);
        
        try {
            // Guardar en localStorage
            localStorage.setItem('formularios', JSON.stringify(formularios));
            
            // Enviar al servidor PHP
            fetch('guardar_mensaje.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
            })
            .catch(error => {
                console.error('Error al guardar en archivo:', error);
                // El formulario aún se guarda en localStorage aunque falle el servidor
                mensajeExito.style.display = 'block';
            });

            console.log('Datos guardados:', formData);
            
            // Mostrar mensaje de éxito
            // Limpiar formulario
            formulario.reset();

            // Mostrar mensaje de éxito con animación
            mensajeExito.style.display = 'block';
            requestAnimationFrame(() => {
                mensajeExito.classList.add('mostrar');
            });

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                mensajeExito.classList.remove('mostrar');
                setTimeout(() => {
                    mensajeExito.style.display = 'none';
                }, 300);
            }, 5000);
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error al guardar el mensaje. Por favor, intente nuevamente.');
        }
    });
});