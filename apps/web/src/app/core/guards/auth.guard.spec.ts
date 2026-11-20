import '@angular/compiler';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

class AuthServiceMock {
  getSession = vi.fn();
}

describe('AuthGuard (CA2 — bloqueio de rotas protegidas)', () => {
  let guard: AuthGuard;
  let authService: AuthServiceMock;

  beforeEach(() => {
    authService = new AuthServiceMock();
    guard = new AuthGuard(authService);
  });

  it('deve bloquear acesso (retornar false) quando não há sessão autenticada', async () => {
    authService.getSession.mockResolvedValue({ data: { session: null }, error: null });

    const resultado = await guard.canActivate();

    expect(resultado).toBe(false);
  });

  it('deve permitir acesso (retornar true) quando há sessão válida', async () => {
    authService.getSession.mockResolvedValue({
      data: { session: { access_token: 'token-valido' } },
      error: null,
    });

    const resultado = await guard.canActivate();

    expect(resultado).toBe(true);
  });
});
