import '@angular/compiler';

import { FormBuilder } from '@angular/forms';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

class AuthServiceMock {
  requestMagicLink = vi.fn();
}

describe('LoginComponent (CA1 — envio de link de confirmação)', () => {
  let component: LoginComponent;
  let authService: AuthServiceMock;
  let fb: FormBuilder;

  beforeEach(() => {
    authService = new AuthServiceMock();
    fb = new FormBuilder();
    component = new LoginComponent(fb, authService);
  });

  it('deve chamar requestMagicLink com e-mail institucional e exibir "link enviado" ao submeter', async () => {
    authService.requestMagicLink.mockResolvedValue(undefined);
    component.form.setValue({ email: 'aluno@utfpr.edu.br' });

    await component.onSubmit();

    expect(authService.requestMagicLink).toHaveBeenCalledWith('aluno@utfpr.edu.br');
    expect(component.mensagem).toBe('link enviado');
    expect(component.erro).toBe('');
  });

  it('não deve chamar requestMagicLink quando o e-mail tem formato inválido', async () => {
    component.form.setValue({ email: '' });

    await component.onSubmit();

    expect(authService.requestMagicLink).not.toHaveBeenCalled();
  });

  it('deve chamar requestMagicLink com e-mail de domínio não institucional e exibir erro', async () => {
    authService.requestMagicLink.mockRejectedValue(new Error('e-mail não permitido'));
    component.form.setValue({ email: 'usuario@gmail.com' });

    await component.onSubmit();

    expect(authService.requestMagicLink).toHaveBeenCalledWith('usuario@gmail.com');
    expect(component.erro).toContain('e-mail não permitido');
    expect(component.mensagem).toBe('');
  });
});

