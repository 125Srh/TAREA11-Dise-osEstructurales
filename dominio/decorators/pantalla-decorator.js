// dominio/decorators/pantalla-decorator.js
import { Pantalla } from '../pantalla.js';

export class PantallaDecorator extends Pantalla {
    constructor(pantalla) {
        super(pantalla.id, pantalla.modelo, pantalla.precioBase);
        this.pantalla = pantalla;
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