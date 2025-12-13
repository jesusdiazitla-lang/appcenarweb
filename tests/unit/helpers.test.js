const { describe, test, expect } = require('@jest/globals');

describe('Helpers de Handlebars', () => {
  // Mock de helpers que se usan en la app
  const helpers = {
    formatCurrency: (amount) => {
      if (!amount && amount !== 0) return 'RD$ 0.00';
      return `RD$${Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    },
    
    formatDate: (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    eq: (a, b) => a == b,
    add: (a, b) => Number(a) + Number(b),
    multiply: (a, b) => Number(a) * Number(b)
  };

  describe('formatCurrency', () => {
    test('debe formatear correctamente montos positivos', () => {
      expect(helpers.formatCurrency(100)).toBe('RD$100.00');
      expect(helpers.formatCurrency(1000)).toBe('RD$1,000.00');
      expect(helpers.formatCurrency(1234.56)).toBe('RD$1,234.56');
    });

    test('debe manejar valores nulos o indefinidos', () => {
      expect(helpers.formatCurrency(null)).toBe('RD$ 0.00');
      expect(helpers.formatCurrency(undefined)).toBe('RD$ 0.00');
      expect(helpers.formatCurrency(0)).toBe('RD$0.00');
    });
  });

  describe('eq', () => {
    test('debe comparar valores correctamente', () => {
      expect(helpers.eq(1, 1)).toBe(true);
      expect(helpers.eq('1', 1)).toBe(true);
      expect(helpers.eq(1, 2)).toBe(false);
    });
  });

  describe('add', () => {
    test('debe sumar correctamente', () => {
      expect(helpers.add(10, 5)).toBe(15);
      expect(helpers.add(100, 200)).toBe(300);
      expect(helpers.add('10', '5')).toBe(15);
    });
  });

  describe('multiply', () => {
    test('debe multiplicar correctamente', () => {
      expect(helpers.multiply(10, 5)).toBe(50);
      expect(helpers.multiply(100, 2)).toBe(200);
    });
  });
});