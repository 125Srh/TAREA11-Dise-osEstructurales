// dominio/inventario-pantallas.js
import { Pantalla } from './pantalla.js';
import { DescuentoDecorator } from './decorators/descuento-decorator.js';
import { GarantiaDecorator } from './decorators/garantia-decorator.js';
import { LocalStorageAdapter } from '../datos/local-storage-adapter.js';

export class InventarioPantallas {
    constructor() {
        if (InventarioPantallas.instancia) {
            return InventarioPantallas.instancia;
        }

        this.pantallas = [];
        this.observadores = [];
        this.storageAdapter = new LocalStorageAdapter();
        
        this.inicializarDatos();
        InventarioPantallas.instancia = this;
    }

    static obtenerInstancia() {
        if (!InventarioPantallas.instancia) {
            InventarioPantallas.instancia = new InventarioPantallas();
        }
        return InventarioPantallas.instancia;
    }

    async inicializarDatos() {
        const datosGuardados = await this.storageAdapter.obtener('inventarioPantallas');
        if (!datosGuardados || datosGuardados.length === 0) {
            // Datos de ejemplo
            const pantallasEjemplo = [
                { id: '1', modelo: 'Samsung A 30s" incell', precioBase: 250, decoradoresAplicados: [] },
                { id: '2', modelo: 'Spark 8c', precioBase: 400, decoradoresAplicados: ['10% Descuento'] },
                { id: '3', modelo: 'Xiaomi note 11 pro', precioBase: 550, decoradoresAplicados: ['Garantía Ext. +bs50'] }
            ];
            
            this.pantallas = pantallasEjemplo.map(p => {
                let pantalla = new Pantalla(p.id, p.modelo, p.precioBase);
                pantalla.decoradoresAplicados = p.decoradoresAplicados;
                return pantalla;
            });
            
            await this.guardarEnStorage();
        } else {
            this.pantallas = datosGuardados.map(p => {
                let pantalla = new Pantalla(p.id, p.modelo, p.precioBase);
                pantalla.decoradoresAplicados = p.decoradoresAplicados || [];
                return pantalla;
            });
        }
    }

    async guardarEnStorage() {
        await this.storageAdapter.guardar('inventarioPantallas', this.pantallas);
    }

    async agregarPantallaConDecoradores(modelo, precioBase, conDescuento, conGarantia) {
        let pantalla = new Pantalla(this.generarId(), modelo, precioBase);

        if (conDescuento) {
            pantalla = new DescuentoDecorator(pantalla, 10);
        }

        if (conGarantia) {
            pantalla = new GarantiaDecorator(pantalla, 50);
        }

        await this.agregar(pantalla);
        return pantalla;
    }

    async agregar(pantalla) {
        this.pantallas.push(pantalla);
        await this.guardarEnStorage();
        this.notificarObservadores('agregar', pantalla);
    }

    async eliminar(id) {
        const index = this.pantallas.findIndex(p => p.id === id);
        if (index !== -1) {
            const pantallaEliminada = this.pantallas.splice(index, 1)[0];
            await this.guardarEnStorage();
            this.notificarObservadores('eliminar', pantallaEliminada);
        }
    }

    obtenerTodas() {
        return this.pantallas;
    }

    buscar(termino) {
        return this.pantallas.filter(p => 
            p.modelo.toLowerCase().includes(termino.toLowerCase())
        );
    }

    agregarObservador(observador) {
        this.observadores.push(observador);
    }

    notificarObservadores(accion, pantalla) {
        this.observadores.forEach(obs => obs.actualizar(accion, pantalla));
    }

    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}