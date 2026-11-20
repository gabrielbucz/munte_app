import '@angular/compiler';

import { FormBuilder } from '@angular/forms';
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
    component = new AuthCallbackComponent(authService);
  });

  it('deve estabelecer sessão quando o token de confirmação é válido dentro do prazo', async () => {
    authService.verifyOtp.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    authService.getSession.mockResolvedValue({ data: { session: { access_token: 'token-valido' } }, error: null });

    await component.validateToken('token-valido');

    expect(authService.verifyOtp).toHaveBeenCalledWith({
      token: 'token-valido',
      type: 'email',
    });
    expect(authService.getSession).toHaveBeenCalled();
    expect(component.sessaoEstabelecida).toBe(true);
    expect(component.erro).toBe('');
  });

  it('não deve estabelecer sessão quando o token é expirado ou inválido', async () => {
    authService.verifyOtp.mockResolvedValue({ data: null, error: { message: 'expired' } });
    authService.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await component.validateToken('token-expirado');

    expect(authService.verifyOtp).toHaveBeenCalledWith({
      token: 'token-expirado',
      type: 'email',
    });
    expect(component.sessaoEstabelecida).toBe(false);
    expect(component.erro).toContain('link inválido');
  });

  it('não deve estabelecer sessão quando o token já foi utilizado', async () => {
    authService.verifyOtp.mockResolvedValue({ data: null, error: { message: 'already_used' } });
    authService.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await component.validateToken('token-ja-utilizado');

    expect(component.sessaoEstabelecida).toBe(false);
    expect(component.erro).toContain('link inválido');
  });
});
