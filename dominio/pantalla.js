// dominio/pantalla.js
export class Pantalla {
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