// dominio/observers/observador-ui.js
import { InventarioPantallas } from '../inventario-pantallas.js';

export class ObservadorUI {
    actualizar(accion, pantalla) {
        this.mostrarNotificacion(accion, pantalla);
        this.actualizarListaVisual();
    }

    mostrarNotificacion(accion, pantalla) {
        const divNotificaciones = document.getElementById('notificaciones');
        const notificacion = document.createElement('div');
        
        if (accion === 'agregar') {
            notificacion.className = 'notificacion exito';
            notificacion.innerHTML = `
                <span></span>
                <span><strong>Pantalla agregada:</strong> "${pantalla.modelo}" por $${pantalla.obtenerPrecio().toFixed(2)}</span>
            `;
        } else if (accion === 'eliminar') {
            notificacion.className = 'notificacion error';
            notificacion.innerHTML = `
                <span></span>
                <span><strong>Pantalla eliminada:</strong> "${pantalla.modelo}"</span>
            `;
        }

        divNotificaciones.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 4000);
    }

    actualizarListaVisual() {
        const inventario = InventarioPantallas.obtenerInstancia();
        const divInventario = document.getElementById('listaInventario');
        const pantallas = inventario.obtenerTodas();

        if (pantallas.length === 0) {
            divInventario.innerHTML = '<p class="empty-message">No hay pantallas en el inventario. Agrega la primera pantalla arriba.</p>';
            return;
        }

        divInventario.innerHTML = '';

        pantallas.forEach(pantalla => {
            const card = document.createElement('div');
            card.className = 'pantalla-card';
            
            const decoradoresHTML = pantalla.decoradoresAplicados && pantalla.decoradoresAplicados.length > 0
                ? `<div class="decoradores-aplicados">
                     <strong>Opciones:</strong>
                     ${pantalla.decoradoresAplicados.map(d => `<span>${d}</span>`).join('')}
                   </div>`
                : '';

            const precioBaseHTML = pantalla.precioBase !== pantalla.obtenerPrecio() 
                ? `<div class="precio-base">Precio base: $${pantalla.precioBase.toFixed(2)}</div>` 
                : '';

            card.innerHTML = `
                <h3>${pantalla.modelo}</h3>
                <div class="precio-info">
                    ${precioBaseHTML}
                    <div class="precio-final">Precio Final: $${pantalla.obtenerPrecio().toFixed(2)}</div>
                </div>
                ${decoradoresHTML}
                <button class="btn-danger" onclick="app.eliminarPantalla('${pantalla.id}')">
                    Eliminar 
                </button>
            `;

            divInventario.appendChild(card);
        });
    }
}