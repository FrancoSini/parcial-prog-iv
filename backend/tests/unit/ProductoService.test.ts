import { describe, it, expect } from 'vitest';
import { ProductoService } from '../../src/services/ProductoService.js';
import type { Producto } from '../../src/models/Producto.js';

// Producto de mentira: el test no depende de los modelos reales
const falso = (id: number) =>
  ({ id, nombre: `Producto ${id}`, tipo: 'Falso', precioBase: 0, calcularPrecio: () => 0 }) as Producto;

describe('ProductoService', () => {
  describe('listar()', () => {
    it('debería devolver los productos que recibe por constructor', () => {
      const p1 = falso(1);
      const p2 = falso(2);
      const service = new ProductoService([p1, p2]);

      expect(service.listar()).toEqual([p1, p2]);
    });
  });
});