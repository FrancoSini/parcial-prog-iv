import type { Producto } from "../models/Producto.js";

export class ProductoService {
  constructor(private readonly productos: readonly Producto[]) {}

  listar(): Producto[] {
    return [...this.productos];
  }

  obtener(id: number): Producto {
    return this.productos.find((p) => p.id === id) as Producto;
  }
}