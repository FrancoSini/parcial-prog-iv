import { Producto } from './Producto.js';
export class Pasteleria extends Producto {
    get tipo(): string {
        return 'Pastelería';
    }

    calcularPrecio(): number {
        return 0;
    }
}