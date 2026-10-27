import { Router } from "express";
import type { ProductoService } from "../services/ProductoService.js";

export function makeProductosRouter(_service: ProductoService) {
  const router = Router();

  return router;
}