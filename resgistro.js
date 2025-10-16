const API_URL = 'http://localhost:4000/api';

document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const mensaje = document.getElementById('mensaje');
    
    // Limpiar mensaje anterior
    mensaje.className = 'mensaje';
    mensaje.textContent = '';
    
    // Validaciones
    if (!email || !password) {
        mostrarMensaje('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    if (password.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar token en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'success');
            
            // Redirigir al dashboard después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            mostrarMensaje(data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión. Verifica que el servidor esté corriendo en el puerto 4000.', 'error');
    }
});

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}