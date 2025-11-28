// datos/local-storage-adapter.js
export class LocalStorageAdapter {
    async guardar(key, data) {
        return new Promise((resolve) => {
            localStorage.setItem(key, JSON.stringify(data));
            resolve(true);
        });
    }

    async obtener(key) {
        return new Promise((resolve) => {
            const data = localStorage.getItem(key);
            resolve(data ? JSON.parse(data) : null);
        });
    }

    async eliminar(key) {
        return new Promise((resolve) => {
            localStorage.removeItem(key);
            resolve(true);
        });
    }

    async limpiar() {
        return new Promise((resolve) => {
            localStorage.clear();
            resolve(true);
        });
    }
}
