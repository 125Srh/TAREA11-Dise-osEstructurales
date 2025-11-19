class InventarioPantallas {
    constructor() {
        // Si ya existe una instancia, retornar esa instancia existente
        if (InventarioPantallas.instancia) {
            return InventarioPantallas.instancia;
        }

        // Inicializar el inventario vacío
        this.pantallas = [];
        
        // Lista de observadores (para el patrón Observer)
        this.observadores = [];
        
        // Guardar esta instancia como la única instancia
        InventarioPantallas.instancia = this;
    }

    // Método estático para obtener la instancia única del inventario
    static obtenerInstancia() {
        if (!InventarioPantallas.instancia) {
            InventarioPantallas.instancia = new InventarioPantallas();
        }
        return InventarioPantallas.instancia;
    }

    // Agregar una pantalla al inventario
    agregar(pantalla) {
        this.pantallas.push(pantalla);
        this.notificarObservadores('agregar', pantalla);
    }

    // Eliminar una pantalla del inventario por su ID
    eliminar(id) {
        const index = this.pantallas.findIndex(p => p.id === id);
        if (index !== -1) {
            const pantallaEliminada = this.pantallas.splice(index, 1)[0];
            this.notificarObservadores('eliminar', pantallaEliminada);
        }
    }

    // Obtener todas las pantallas del inventario
    obtenerTodas() {
        return this.pantallas;
    }

    // Buscar pantallas por término de búsqueda
    buscar(termino) {
        return this.pantallas.filter(p => 
            p.modelo.toLowerCase().includes(termino.toLowerCase())
        );
    }

    // Métodos para el patrón Observer
    agregarObservador(observador) {
        this.observadores.push(observador);
    }

    notificarObservadores(accion, pantalla) {
        this.observadores.forEach(obs => obs.actualizar(accion, pantalla));
    }
}


// ============================================
// CLASE BASE: Pantalla
// ============================================
/**
 * Clase base que representa una pantalla en el inventario.
 * Esta clase será decorada por los decoradores para agregar funcionalidades.
 */
class Pantalla {
    constructor(id, modelo, precioBase) {
        this.id = id;
        this.modelo = modelo;
        this.precioBase = precioBase;
        this.decoradoresAplicados = []; // INICIALIZAR SIEMPRE EL ARRAY
    }

    obtenerPrecio() {
        return this.precioBase;
    }

    obtenerDescripcion() {
        return this.modelo;
    }
}
// Decorador base
class PantallaDecorator {
    constructor(pantalla) {
        this.pantalla = pantalla;
        this.id = pantalla.id;
        this.modelo = pantalla.modelo;
        this.precioBase = pantalla.precioBase;
        // HEREDAR el array de decoradores aplicados
        this.decoradoresAplicados = pantalla.decoradoresAplicados || [];
    }

    obtenerPrecio() {
        return this.pantalla.obtenerPrecio();
    }

    obtenerDescripcion() {
        return this.pantalla.obtenerDescripcion();
    }
}

// Decorador concreto: Descuento
class DescuentoDecorator extends PantallaDecorator {
    constructor(pantalla, porcentaje) {
        super(pantalla);
        this.porcentaje = porcentaje;
    }

    obtenerPrecio() {
        const precioOriginal = this.pantalla.obtenerPrecio();
        const descuento = precioOriginal * (this.porcentaje / 100);
        return precioOriginal - descuento;
    }

    obtenerDescripcion() {
        return `${this.pantalla.obtenerDescripcion()} [Descuento ${this.porcentaje}%]`;
    }
}

// Decorador concreto: Garantía Extendida
class GarantiaDecorator extends PantallaDecorator {
    constructor(pantalla, costoGarantia) {
        super(pantalla);
        this.costoGarantia = costoGarantia;
    }

    obtenerPrecio() {
        return this.pantalla.obtenerPrecio() + this.costoGarantia;
    }

    obtenerDescripcion() {
        return `${this.pantalla.obtenerDescripcion()} [+Garantía Extendida]`;
    }
}
class ObservadorUI {
    actualizar(accion, pantalla) {
        // Mostrar notificación visual del cambio
        this.mostrarNotificacion(accion, pantalla);
        
        // Actualizar la lista visual del inventario
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

        // Auto-eliminar la notificación después de 4 segundos
        setTimeout(() => {
            notificacion.remove();
        }, 4000);
    }

    actualizarListaVisual() {
        const inventario = InventarioPantallas.obtenerInstancia();
        const divInventario = document.getElementById('listaInventario');
        const pantallas = inventario.obtenerTodas();

        // Si no hay pantallas, mostrar mensaje
        if (pantallas.length === 0) {
            divInventario.innerHTML = '<p class="empty-message">No hay pantallas en el inventario. Agrega la primera pantalla arriba.</p>';
            return;
        }

        // Limpiar el contenido actual
        divInventario.innerHTML = '';

        // Renderizar cada pantalla como una tarjeta
        pantallas.forEach(pantalla => {
            const card = document.createElement('div');
            card.className = 'pantalla-card';
            
            // Mostrar los decoradores aplicados si existen
            const decoradoresHTML = pantalla.decoradoresAplicados && pantalla.decoradoresAplicados.length > 0
                ? `<div class="decoradores-aplicados">
                     <strong>Opciones:</strong>
                     ${pantalla.decoradoresAplicados.map(d => `<span>${d}</span>`).join('')}
                   </div>`
                : '';

            // Mostrar precio base solo si fue modificado por decoradores
            const precioBaseHTML = pantalla.precioBase !== pantalla.obtenerPrecio() 
                ? `<div class="precio-base">Precio base: $${pantalla.precioBase.toFixed(2)}</div>` 
                : '';

            card.innerHTML = `
                <h3> ${pantalla.modelo}</h3>
                <div class="precio-info">
                    ${precioBaseHTML}
                    <div class="precio-final">Precio Final: $${pantalla.obtenerPrecio().toFixed(2)}</div>
                </div>
                ${decoradoresHTML}
                <button class="btn-danger" onclick="eliminarPantalla('${pantalla.id}')">
                     Eliminar 
                </button>
            `;

            divInventario.appendChild(card);
        });
    }
}


// ============================================
// FUNCIONES DE LA APLICACIÓN
// ============================================

/**
 * Generar un ID único para cada pantalla
 */
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Agregar pantalla desde el formulario
 */
function agregarPantalla(evento) {
    evento.preventDefault();

    // Obtener valores del formulario
    const modelo = document.getElementById('modelo').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const conDescuento = document.getElementById('descuento').checked;
    const conGarantia = document.getElementById('garantia').checked;

    // Validar que el precio sea válido
    if (precio <= 0) {
        alert('El precio debe ser mayor a 0');
        return;
    }

    // Crear pantalla base
    let pantalla = new Pantalla(generarId(), modelo, precio);

    // APLICAR PATRÓN DECORATOR:
    // Aplicar decoradores si fueron seleccionados
    if (conDescuento) {
        pantalla = new DescuentoDecorator(pantalla, 10);
        pantalla.decoradoresAplicados.push('10% Descuento');
    }

    if (conGarantia) {
        pantalla = new GarantiaDecorator(pantalla, 50);
        pantalla.decoradoresAplicados.push('Garantía Ext. +$50');
    }

    // USAR PATRÓN SINGLETON:
    // Agregar al inventario único de la aplicación
    const inventario = InventarioPantallas.obtenerInstancia();
    inventario.agregar(pantalla);

    // Limpiar el formulario
    document.getElementById('formAgregar').reset();
}

/**
 * Eliminar pantalla del inventario
 */
function eliminarPantalla(id) {
    if (confirm('¿Estás seguro de eliminar esta pantalla del inventario?')) {
        const inventario = InventarioPantallas.obtenerInstancia();
        inventario.eliminar(id);
    }
}

/**
 * Buscar pantallas por modelo
 */
function buscarPantallas() {
    const termino = document.getElementById('buscar').value.trim();
    const inventario = InventarioPantallas.obtenerInstancia();
    const divInventario = document.getElementById('listaInventario');

    // Si no hay término de búsqueda, mostrar todas
    if (termino === '') {
        const observador = new ObservadorUI();
        observador.actualizarListaVisual();
        return;
    }

    // Buscar pantallas que coincidan con el término
    const resultados = inventario.buscar(termino);

    if (resultados.length === 0) {
        divInventario.innerHTML = '<p class="empty-message">No se encontraron pantallas con ese modelo</p>';
        return;
    }

    // Mostrar resultados de la búsqueda
    divInventario.innerHTML = '';

    resultados.forEach(pantalla => {
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
            <h3> ${pantalla.modelo}</h3>
            <div class="precio-info">
                ${precioBaseHTML}
                <div class="precio-final">Precio Final: $${pantalla.obtenerPrecio().toFixed(2)}</div>
            </div>
            ${decoradoresHTML}
            <button class="btn-danger" onclick="eliminarPantalla('${pantalla.id}')">
                 Eliminar
            </button>
        `;

        divInventario.appendChild(card);
    });
}
// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('='.repeat(50));
    console.log(' INICIANDO APLICACIÓN - TIENDA DE PANTALLAS');
    console.log('='.repeat(50));

    // PATRÓN SINGLETON: Obtener la instancia única del inventario
    const inventario = InventarioPantallas.obtenerInstancia();
   
    // PATRÓN OBSERVER: Crear y registrar el observador de UI
    const observadorUI = new ObservadorUI();
    inventario.agregarObservador(observadorUI);
  
    // PATRÓN DECORATOR: Listo para aplicar decoradores dinámicamente
 
    // Configurar event listeners
    document.getElementById('formAgregar').addEventListener('submit', agregarPantalla);
    document.getElementById('buscar').addEventListener('input', buscarPantallas);

});