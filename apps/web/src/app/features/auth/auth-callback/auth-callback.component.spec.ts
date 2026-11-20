import '@angular/compiler';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthCallbackComponent } from './auth-callback.component';
import { AuthService } from '../../../core/services/auth.service';

class AuthServiceMock {
  verifyOtp = vi.fn();
  getSession = vi.fn();
}

describe('AuthCallbackComponent (CA2 — validação do link de confirmação)', () => {
  let component: AuthCallbackComponent;
  let authService: AuthServiceMock;

  beforeEach(() => {
    authService = new AuthServiceMock();
    const route = { snapshot: { queryParams: {} } };
    component = new AuthCallbackComponent(route as any, authService);
  });

  it('deve estabelecer sessão quando o token_hash é válido dentro do prazo', async () => {
    component.route.snapshot.queryParams = { token_hash: 'token-hash-valido' };
    authService.verifyOtp.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    authService.getSession.mockResolvedValue({ data: { session: { access_token: 'token-valido' } }, error: null });

    await component.validateToken();

    expect(authService.verifyOtp).toHaveBeenCalledWith({
      token_hash: 'token-hash-valido',
      type: 'email',
    });
    expect(authService.getSession).toHaveBeenCalled();
    expect(component.sessaoEstabelecida).toBe(true);
    expect(component.erro).toBe('');
  });

  it('não deve estabelecer sessão quando não há token_hash na URL', async () => {
    component.route.snapshot.queryParams = {};

    await component.validateToken();

    expect(authService.verifyOtp).not.toHaveBeenCalled();
    expect(component.sessaoEstabelecida).toBe(false);
    expect(component.erro).toContain('link inválido');
  });

  it('não deve estabelecer sessão quando o token_hash é expirado ou inválido', async () => {
    component.route.snapshot.queryParams = { token_hash: 'token-hash-expirado' };
    authService.verifyOtp.mockResolvedValue({ data: null, error: { message: 'expired' } });
    authService.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await component.validateToken();

    expect(authService.verifyOtp).toHaveBeenCalledWith({
      token_hash: 'token-hash-expirado',
      type: 'email',
    });
    expect(component.sessaoEstabelecida).toBe(false);
    expect(component.erro).toContain('link inválido');
  });

  it('não deve estabelecer sessão quando o token_hash já foi utilizado', async () => {
    component.route.snapshot.queryParams = { token_hash: 'token-hash-ja-utilizado' };
    authService.verifyOtp.mockResolvedValue({ data: null, error: { message: 'already_used' } });
    authService.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await component.validateToken();

    expect(component.sessaoEstabelecida).toBe(false);
    expect(component.erro).toContain('link inválido');
  });
});
