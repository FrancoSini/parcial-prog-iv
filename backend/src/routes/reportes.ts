import { Router } from "express";
import type { ReporteService } from "../services/ReporteService.js";

export function makeReportesRouter(_service: ReporteService) {
  const router = Router();

  return router;
}