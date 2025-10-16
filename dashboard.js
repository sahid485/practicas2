const API_URL = 'http://localhost:4000/api';

// Verificar autenticación al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Verificar token con el servidor
        const response = await fetch(`${API_URL}/auth/verificar`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!data.success) {
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }
        
        // Cargar información del usuario
        cargarDatosUsuario(data.usuario);
        
    } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.clear();
        window.location.href = 'login.html';
    }
    
    // Inicializar componentes
    inicializarDropdown();
    inicializarGrafico();
});

// Cargar datos del usuario
function cargarDatosUsuario(usuario) {
    const userName = document.getElementById('userName');
    if (usuario && usuario.nombre) {
        userName.textContent = usuario.nombre;
    } else if (usuario && usuario.email) {
        userName.textContent = usuario.email.split('@')[0];
    }
}

// Dropdown del menú de usuario
function inicializarDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', () => {
        userDropdown.classList.remove('show');
    });
    
    // Prevenir que el dropdown se cierre al hacer click dentro
    userDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Cerrar sesión
document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
});

// Botón Nuevo Documento
document.getElementById('btnNuevoDoc').addEventListener('click', () => {
    alert('Funcionalidad de nuevo documento en desarrollo 🚀');
});

// Inicializar gráfico simple con Canvas
function inicializarGrafico() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Datos de ejemplo
    const datos = [12, 19, 15, 25, 22, 30, 28, 35, 32, 38, 42, 40];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const maxValor = Math.max(...datos);
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar estilos
    ctx.strokeStyle = '#60a5fa';
    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.lineWidth = 3;
    
    // Dibujar línea y área
    ctx.beginPath();
    
    datos.forEach((valor, index) => {
        const x = padding + (index * (width - padding * 2) / (datos.length - 1));
        const y = height - padding - ((valor / maxValor) * (height - padding * 2));
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    // Dibujar línea
    ctx.stroke();
    
    // Rellenar área bajo la curva
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Dibujar puntos
    ctx.fillStyle = '#3b82f6';
    datos.forEach((valor, index) => {
        const x = padding + (index * (width - padding * 2) / (datos.length - 1));
        const y = height - padding - ((valor / maxValor) * (height - padding * 2));
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Dibujar etiquetas de los meses
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    
    meses.forEach((mes, index) => {
        const x = padding + (index * (width - padding * 2) / (datos.length - 1));
        ctx.fillText(mes, x, height - 15);
    });
}

// Redimensionar gráfico al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    inicializarGrafico();
});