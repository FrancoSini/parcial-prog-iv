import type { Producto } from "../models/Producto.js";

export class ProductoService {
  constructor(private readonly productos: readonly Producto[]) {}

  listar(): Producto[] {
    return this.productos as Producto[];
  }
}