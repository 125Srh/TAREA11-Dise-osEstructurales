// dominio/decorators/garantia-decorator.js
import { PantallaDecorator } from './pantalla-decorator.js';

export class GarantiaDecorator extends PantallaDecorator {
    constructor(pantalla, costoGarantia) {
        super(pantalla);
        this.costoGarantia = costoGarantia;
        this.decoradoresAplicados.push(`Garantía Ext. +$${costoGarantia}`);
    }

    obtenerPrecio() {
        return this.pantalla.obtenerPrecio() + this.costoGarantia;
    }

    obtenerDescripcion() {
        return `${this.pantalla.obtenerDescripcion()} [+Garantía Extendida]`;
    }
}