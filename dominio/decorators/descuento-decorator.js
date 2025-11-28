// dominio/decorators/descuento-decorator.js
import { PantallaDecorator } from './pantalla-decorator.js';

export class DescuentoDecorator extends PantallaDecorator {
    constructor(pantalla, porcentaje) {
        super(pantalla);
        this.porcentaje = porcentaje;
        this.decoradoresAplicados.push(`10% Descuento`);
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