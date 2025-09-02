// Función para navegar a la descripción específica
function irADescripcion(id) {
    window.location.href = `descripcion.html?from=galeria#${id}`;
}

// Función para mostrar la descripción correcta cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el hash de la URL (el ID de la obra)
    const hash = window.location.hash.substring(1);
    
    // Obtener el parámetro 'from' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    
    if (hash) {
        // Ocultar todas las descripciones
        document.querySelectorAll('.obra-detalle').forEach(obra => {
            obra.style.display = 'none';
        });

        // Mostrar solo la descripción seleccionada
        const obraSeleccionada = document.getElementById(hash);
        if (obraSeleccionada) {
            obraSeleccionada.style.display = 'flex';
            // Hacer scroll suave hasta la obra
            obraSeleccionada.scrollIntoView({ behavior: 'smooth' });

            // Crear botón Volver
            const botonVolver = document.createElement('button');
            
            // Determinar el texto y destino del botón según el origen
            if (from === 'autores') {
                botonVolver.textContent = '← Volver a Autores';
                botonVolver.addEventListener('click', () => {
                    window.location.href = 'autores.html';
                });
            } else {
                botonVolver.textContent = '← Volver a la Galería';
                botonVolver.addEventListener('click', () => {
                    window.location.href = 'galeria.html';
                });
            }
            
            botonVolver.className = 'boton-volver';

            // Insertar el botón después de la sección (fuera del flex container)
            obraSeleccionada.parentNode.insertBefore(botonVolver, obraSeleccionada.nextSibling);
        }
    }
});