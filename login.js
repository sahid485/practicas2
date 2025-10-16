const API_URL = 'http://localhost:4000/api';

// Verificar si ya hay sesión activa
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensaje');
    
    // Limpiar mensaje anterior
    mensaje.className = 'mensaje';
    mensaje.textContent = '';
    
    // Validaciones
    if (!email || !password) {
        mostrarMensaje('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            mostrarMensaje('¡Login exitoso! Redirigiendo...', 'success');
            
            // Redirigir al dashboard después de 1 segundo
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            mostrarMensaje(data.message || 'Credenciales incorrectas', 'error');
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