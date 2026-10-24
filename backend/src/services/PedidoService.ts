import { Pedido, type ItemPedido } from "../models/Pedido.js";
import { NotFoundError } from "../errors/index.js";
import type { ProductoService } from "./ProductoService.js";

export class PedidoService {
  private pedidos: Pedido[] = [];
  private siguienteId = 1;

  constructor(private readonly productoService: ProductoService) {}

  crear(items: unknown[]): Pedido {
    const total = (items as ItemPedido[]).reduce(
      (acc, item) =>
        acc + this.productoService.obtener(item.productoId).calcularPrecio() * item.cantidad,
      0,
    );

    const pedido = new Pedido(this.siguienteId++, items as ItemPedido[], "pendiente", total);
    this.pedidos = [...this.pedidos, pedido];
    return pedido;
  }

  listar(): Pedido[] {
    return [...this.pedidos];
  }

  obtener(id: number): Pedido {
    const pedido = this.pedidos.find((p) => p.id === id);
    if (!pedido) {
      throw new NotFoundError(`Pedido ${id} no encontrado`);
    }
    return pedido;
  }
}