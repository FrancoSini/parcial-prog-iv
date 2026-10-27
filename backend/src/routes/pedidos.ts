import { Router } from "express";
import type { PedidoService } from "../services/PedidoService.js";

export function makePedidosRouter(_service: PedidoService) {
  const router = Router();

  return router;
}
