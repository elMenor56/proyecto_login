const API_URL = 'http://localhost:3000/api';

const registroForm = document.getElementById('registroForm');
const mensajeDiv = document.getElementById('mensaje');

document.addEventListener('DOMContentLoaded', () => {
    registroForm.addEventListener('submit', manejarRegistro);

    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
        window.location.href = 'index_template.html';
    }
});

async function manejarRegistro(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const clave = document.getElementById('clave').value;
    const confirmarClave = document.getElementById('confirmarClave').value;

    if (clave !== confirmarClave) {
        mostrarMensaje('Las contraseñas no coinciden', false);
        return;
    }

    const usuario = {
        nombre,
        apellido,
        telefono,
        email,
        clave,
        rol: 'cliente' 
    };

    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const resultado = await response.json();
        if (resultado.success) {
            mostrarMensaje('Registro exitoso. Redirigiendo al inicio de sesión...', true);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarMensaje(resultado.message, false);
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        mostrarMensaje('Error en el servidor. Inténtalo más tarde.', false);
    }
}

function mostrarMensaje(texto, esExito) {
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = 'block';

    if(esExito) {
        mensajeDiv.style.backgroundcolor = '#d4edda';
        mensajeDiv.style.color = '#155724';
    } else{
        mensajeDiv.style.backgroundColor = '#f8d7da';
        mensajeDiv.style.Color = '#721c24';
    }
}