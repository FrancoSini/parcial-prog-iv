import type { PedidoService } from "./PedidoService.js";
import type { ProductoService } from "./ProductoService.js";

export class ReporteService {
  constructor(
    private readonly pedidoService: PedidoService,
    private readonly productoService: ProductoService,
  ) {}

  facturacionTotal(): number {
    return 0;
  }
}