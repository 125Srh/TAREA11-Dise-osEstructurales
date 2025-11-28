// app.js - Punto de entrada principal MODIFICADO
import { InventarioPantallas } from './dominio/inventario-pantallas.js';
import { ObservadorUI } from './dominio/observers/observador-ui.js';
import { UIManager } from './presentacion/ui-manager.js';

class App {
    constructor() {
        this.inicializarApp();
    }

    async inicializarApp() {
        try {
            // PATRÓN SINGLETON: Obtener la instancia única del inventario
            this.inventario = InventarioPantallas.obtenerInstancia();
            
            // PATRÓN OBSERVER: Crear y registrar el observador de UI
            this.observadorUI = new ObservadorUI();
            this.inventario.agregarObservador(this.observadorUI);
            
            // PATRÓN DECORATOR: Listo para aplicar decoradores dinámicamente
            this.uiManager = new UIManager(this.inventario);
            this.uiManager.inicializar();
            
            console.log(' Aplicación inicializada con arquitectura de 3 capas');
            console.log(' Patrones implementados: Singleton, Decorator, Observer');
            console.log(' Principios SOLID aplicados correctamente');
            
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }

    async eliminarPantalla(id) {
        if (confirm('¿Estás seguro de eliminar esta pantalla del inventario?')) {
            await this.inventario.eliminar(id);
        }
    }
}

// Hacer la aplicación globalmente disponible
window.app = new App();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app.inicializarApp();
});