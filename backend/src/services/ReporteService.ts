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

  cantidadVendidaPorProducto(): Record<string, number> {
    return this.pedidoService
      .listar()
      .flatMap((pedido) => pedido.items)
      .reduce<Record<string, number>>((acc, item) => {
        const tipo = this.productoService.obtener(item.productoId).tipo;
        return { ...acc, [tipo]: (acc[tipo] ?? 0) + item.cantidad };
      }, {});
  }
}