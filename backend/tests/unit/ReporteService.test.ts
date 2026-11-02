import { describe, it, expect, beforeEach } from 'vitest';
import { ReporteService } from '../../src/services/ReporteService.js';
import { PedidoService } from '../../src/services/PedidoService.js';
import { ProductoService } from '../../src/services/ProductoService.js';
import type { Producto } from '../../src/models/Producto.js';

// Producto de mentira con el precio y el tipo que yo elija
const productoFalso = (id: number, precio: number, tipo: string) =>
  ({ id, nombre: `Producto ${id}`, tipo, precioBase: 0, calcularPrecio: () => precio }) as Producto;

const EXPRESO = 1;         // $5.000
const FILTRADO = 2;        // $4.000
const MUFFIN = 3;          // $2.500
const EXPRESO_GRANDE = 4;  // $7.000 (otro Expreso, para probar que se suman por tipo)

describe('ReporteService', () => {
  let pedidos: PedidoService;
  let reportes: ReporteService;

  beforeEach(() => {
    const productos = new ProductoService([
      productoFalso(EXPRESO, 5000, 'Expreso'),
      productoFalso(FILTRADO, 4000, 'Filtrado'),
      productoFalso(MUFFIN, 2500, 'Pastelería'),
      productoFalso(EXPRESO_GRANDE, 7000, 'Expreso'),
    ]);
    pedidos = new PedidoService(productos);
    reportes = new ReporteService(pedidos, productos);
  });

  describe('facturacionTotal()', () => {
    it('debería ser 0 si no hay pedidos', () => {
      expect(reportes.facturacionTotal()).toBe(0);
    });

    it('debería sumar los totales de todos los pedidos', () => {
      pedidos.crear([{ productoId: EXPRESO, cantidad: 2 }]); // 10.000
      pedidos.crear([{ productoId: MUFFIN, cantidad: 1 }]);  // 2.500

      expect(reportes.facturacionTotal()).toBe(12500);
    });
  });

  describe('cantidadVendidaPorProducto()', () => {
    it('debería devolver un objeto vacío si no hay pedidos', () => {
      expect(reportes.cantidadVendidaPorProducto()).toEqual({});
    });

    it('debería agrupar las cantidades por tipo de producto', () => {
      pedidos.crear([
        { productoId: EXPRESO, cantidad: 3 },
        { productoId: FILTRADO, cantidad: 1 },
        { productoId: MUFFIN, cantidad: 2 },
      ]);

      expect(reportes.cantidadVendidaPorProducto()).toEqual({
        Expreso: 3,
        Filtrado: 1,
        Pastelería: 2,
      });
    });

    it('debería acumular las cantidades entre distintos pedidos', () => {
      pedidos.crear([{ productoId: EXPRESO, cantidad: 3 }]);
      pedidos.crear([{ productoId: EXPRESO, cantidad: 2 }]);

      expect(reportes.cantidadVendidaPorProducto()).toEqual({ Expreso: 5 });
    });

    it('debería sumar variantes distintas del mismo tipo', () => {
      pedidos.crear([
        { productoId: EXPRESO, cantidad: 1 },
        { productoId: EXPRESO_GRANDE, cantidad: 2 },
      ]);

      expect(reportes.cantidadVendidaPorProducto()).toEqual({ Expreso: 3 });
    });
  });

  describe('productoMasVendido()', () => {
    it('debería devolver undefined si no hay ventas', () => {
      expect(reportes.productoMasVendido()).toBeUndefined();
    });

    it('debería devolver el tipo con más unidades vendidas', () => {
      pedidos.crear([
        { productoId: EXPRESO, cantidad: 2 },
        { productoId: FILTRADO, cantidad: 4 },
        { productoId: MUFFIN, cantidad: 7 },
      ]);

      expect(reportes.productoMasVendido()).toEqual({ producto: 'Pastelería', cantidad: 7 });
    });

    it('debería comparar el acumulado de todos los pedidos, no un pedido suelto', () => {
      pedidos.crear([{ productoId: EXPRESO, cantidad: 2 }]);
      pedidos.crear([{ productoId: EXPRESO, cantidad: 2 }]);
      pedidos.crear([{ productoId: MUFFIN, cantidad: 3 }]);

      expect(reportes.productoMasVendido()).toEqual({ producto: 'Expreso', cantidad: 4 });
    });

    it('debería quedarse con el primero que se vendió si hay empate', () => {
      pedidos.crear([{ productoId: EXPRESO, cantidad: 2 }]);
      pedidos.crear([{ productoId: MUFFIN, cantidad: 2 }]);

      expect(reportes.productoMasVendido()?.producto).toBe('Expreso');
    });
  });
});