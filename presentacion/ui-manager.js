// presentacion/ui-manager.js
import { InventarioPantallas } from '../dominio/inventario-pantallas.js';

export class UIManager {
    constructor(inventario) {
        this.inventario = inventario;
    }

    inicializar() {
        this.configurarEventListeners();
        this.actualizarVista();
    }

    configurarEventListeners() {
        document.getElementById('formAgregar').addEventListener('submit', (e) => this.manejarAgregarPantalla(e));
        document.getElementById('buscar').addEventListener('input', () => this.manejarBusqueda());
    }

    async manejarAgregarPantalla(evento) {
        evento.preventDefault();

        const modelo = document.getElementById('modelo').value.trim();
        const precio = parseFloat(document.getElementById('precio').value);
        const conDescuento = document.getElementById('descuento').checked;
        const conGarantia = document.getElementById('garantia').checked;

        if (!modelo || precio <= 0) {
            this.mostrarNotificacion('Por favor complete todos los campos correctamente', 'error');
            return;
        }

        try {
            await this.inventario.agregarPantallaConDecoradores(modelo, precio, conDescuento, conGarantia);
            document.getElementById('formAgregar').reset();
        } catch (error) {
            this.mostrarNotificacion('Error al agregar pantalla: ' + error.message, 'error');
        }
    }

    manejarBusqueda() {
        const termino = document.getElementById('buscar').value.trim();
        const resultados = this.inventario.buscar(termino);
        this.mostrarResultadosBusqueda(resultados);
    }

    mostrarResultadosBusqueda(resultados) {
        const divInventario = document.getElementById('listaInventario');
        
        if (resultados.length === 0) {
            divInventario.innerHTML = '<p class="empty-message">No se encontraron pantallas con ese modelo</p>';
            return;
        }

        divInventario.innerHTML = '';

        resultados.forEach(pantalla => {
            const card = this.crearCardPantalla(pantalla);
            divInventario.appendChild(card);
        });
    }

    crearCardPantalla(pantalla) {
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

        return card;
    }

    mostrarNotificacion(mensaje, tipo) {
        const divNotificaciones = document.getElementById('notificaciones');
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.innerHTML = `<span>${tipo === 'exito' ? '✅' : '❌'}</span><span>${mensaje}</span>`;
        
        divNotificaciones.appendChild(notificacion);
        setTimeout(() => notificacion.remove(), 4000);
    }

    actualizarVista() {
        // Será llamado por el Observer
        const observadorUI = this.inventario.observadores.find(obs => obs.actualizarListaVisual);
        if (observadorUI) {
            observadorUI.actualizarListaVisual();
        }
    }
}