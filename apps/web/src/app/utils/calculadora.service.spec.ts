import { CalculadoraService } from './calculadora.service';

describe('CalculadoraService (lógica pura)', () => {
  let service: CalculadoraService;

  beforeEach(() => {
    service = new CalculadoraService();
  });

  it('deve somar dois números', () => {
    expect(service.somar(2, 3)).toBe(5);
  });

  it('deve subtrair dois números', () => {
    expect(service.subtrair(10, 4)).toBe(6);
  });

  it('deve multiplicar dois números', () => {
    expect(service.multiplicar(3, 7)).toBe(21);
  });

  it('deve dividir dois números', () => {
    expect(service.dividir(10, 2)).toBe(5);
  });

  it('deve lançar erro ao dividir por zero', () => {
    expect(() => service.dividir(5, 0)).toThrow('Divisão por zero não é permitida');
  });
});