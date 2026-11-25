import { FormControl } from '@angular/forms';
import { horarioFuturo } from './horario-futuro.validator';

describe('horarioFuturo (CA5: o horário precisa ser no futuro)', () => {
  // Relógio parado em 23/11/2026 10:00:00.000, hora local (o datetime-local não tem fuso).
  const agora = new Date(2026, 10, 23, 10, 0, 0, 0);

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(agora);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function validar(valor: string) {
    return horarioFuturo(new FormControl(valor));
  }

  it('aceita um instante depois de agora (1 minuto depois)', () => {
    expect(validar('2026-11-23T10:01')).toBeNull();
  });

  it('recusa exatamente agora', () => {
    expect(validar('2026-11-23T10:00')).toEqual({ horarioFuturo: true });
  });

  it('recusa o passado (1 minuto antes)', () => {
    expect(validar('2026-11-23T09:59')).toEqual({ horarioFuturo: true });
  });

  it('deixa o vazio para o "preenchimento obrigatório"', () => {
    expect(validar('')).toBeNull();
  });
});
