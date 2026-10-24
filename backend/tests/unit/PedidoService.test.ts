import { describe, it, expect, beforeEach } from 'vitest';
import { PedidoService } from '../../src/services/PedidoService.js';
import { ProductoService } from '../../src/services/ProductoService.js';
import type { Producto } from '../../src/models/Producto.js';

// Producto de mentira con el precio que yo elija
const productoFalso = (id: number, precio: number) =>
  ({ id, nombre: `Producto ${id}`, tipo: 'Falso', precioBase: 0, calcularPrecio: () => precio }) as Producto;

const CAFE = 1;   // $5.000
const MUFFIN = 2; // $2.500

describe('PedidoService', () => {
  let service: PedidoService;

  // crear() recibe datos de un body HTTP: los tests pueden pasarle cualquier cosa
  const crear = (items: unknown) => service.crear(items as unknown[]);

  beforeEach(() => {
    const productos = new ProductoService([productoFalso(CAFE, 5000), productoFalso(MUFFIN, 2500)]);
    service = new PedidoService(productos);
  });

  describe('crear() - total del pedido', () => {
    it('debería calcular el total de un item como precio × cantidad', () => {
      const pedido = crear([{ productoId: CAFE, cantidad: 2 }]);

      expect(pedido.total).toBe(10000);
    });

    it('debería sumar los totales de varios items', () => {
      const pedido = crear([
        { productoId: CAFE, cantidad: 2 },   // 10.000
        { productoId: MUFFIN, cantidad: 3 }, // 7.500
      ]);

      expect(pedido.total).toBe(17500);
    });
  });

  describe('crear() - datos del pedido', () => {
    it('debería asignar ids incrementales empezando en 1', () => {
      const p1 = crear([{ productoId: MUFFIN, cantidad: 1 }]);
      const p2 = crear([{ productoId: MUFFIN, cantidad: 1 }]);
      const p3 = crear([{ productoId: MUFFIN, cantidad: 1 }]);

      expect([p1.id, p2.id, p3.id]).toEqual([1, 2, 3]);
    });
  });
});