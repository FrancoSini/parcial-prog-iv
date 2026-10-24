import { Pedido, type ItemPedido } from "../models/Pedido.js";
import type { ProductoService } from "./ProductoService.js";

export class PedidoService {
  private siguienteId = 1;

  constructor(private readonly productoService: ProductoService) {}

  crear(items: unknown[]): Pedido {
    const total = (items as ItemPedido[]).reduce(
      (acc, item) =>
        acc + this.productoService.obtener(item.productoId).calcularPrecio() * item.cantidad,
      0,
    );

    return new Pedido(this.siguienteId++, [], "pendiente", total);
  }
}