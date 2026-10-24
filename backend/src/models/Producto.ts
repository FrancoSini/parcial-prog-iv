export abstract class Producto {
  constructor(readonly id: number, readonly nombre: string, readonly precioBase: number) {}
  abstract get tipo(): string;
  abstract calcularPrecio(): number;
}