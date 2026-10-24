import { Pedido } from "../models/Pedido.js";
import type { ProductoService } from "./ProductoService.js";

export class PedidoService {
  constructor(private readonly productoService: ProductoService) {}

  crear(items: unknown[]): Pedido {
    return new Pedido(1, [], "pendiente", 0);
  }
}