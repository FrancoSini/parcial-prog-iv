import type { PedidoService } from "./PedidoService.js";
import type { ProductoService } from "./ProductoService.js";

export class ReporteService {
  constructor(
    private readonly pedidoService: PedidoService,
    private readonly productoService: ProductoService,
  ) {}

  facturacionTotal(): number {
    return this.pedidoService.listar().reduce((acc, pedido) => acc + pedido.total, 0);
  }
}