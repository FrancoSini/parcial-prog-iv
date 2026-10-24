import { describe, it, expect, beforeEach } from 'vitest';
import { PedidoService } from '../../src/services/PedidoService.js';
import { ProductoService } from '../../src/services/ProductoService.js';
import { NotFoundError, ValidationError } from '../../src/errors/index.js';
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

    it('debería crear el pedido en estado pendiente', () => {
      expect(crear([{ productoId: MUFFIN, cantidad: 1 }]).estado).toBe('pendiente');
    });

    it('debería guardar los items del pedido', () => {
      const pedido = crear([{ productoId: MUFFIN, cantidad: 2 }]);

      expect(pedido.items).toEqual([{ productoId: MUFFIN, cantidad: 2 }]);
    });
  });

  describe('listar()', () => {
    it('debería devolver una lista vacía si todavía no hay pedidos', () => {
      expect(service.listar()).toEqual([]);
    });

    it('debería devolver los pedidos en el orden en que se crearon', () => {
      crear([{ productoId: MUFFIN, cantidad: 1 }]);
      crear([{ productoId: MUFFIN, cantidad: 2 }]);

      expect(service.listar().map((p) => p.total)).toEqual([2500, 5000]);
    });

    it('debería devolver una copia: modificarla no afecta al service', () => {
      crear([{ productoId: MUFFIN, cantidad: 1 }]);

      service.listar().pop();

      expect(service.listar()).toHaveLength(1);
    });
  });

  describe('obtener(id)', () => {
    it('debería devolver el pedido que tiene ese id', () => {
      crear([{ productoId: MUFFIN, cantidad: 1 }]);
      const segundo = crear([{ productoId: MUFFIN, cantidad: 2 }]);

      expect(service.obtener(2)).toBe(segundo);
    });

    it('debería lanzar NotFoundError si el pedido no existe', () => {
      expect(() => service.obtener(42)).toThrow(NotFoundError);
    });
  });

  describe('crear() - validaciones', () => {
    it.each([
      ['no es un array', 'hola'],
      ['es undefined', undefined],
      ['es null', null],
      ['es un objeto', { productoId: MUFFIN, cantidad: 1 }],
      ['está vacío', []],
    ])('debería lanzar ValidationError si items %s', (_caso, items) => {
      expect(() => crear(items)).toThrow(ValidationError);
    });
  });
});