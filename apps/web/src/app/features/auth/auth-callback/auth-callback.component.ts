import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: ``,
})
export class AuthCallbackComponent {
  sessaoEstabelecida = false;
  erro = '';

  constructor(private readonly authService: AuthService) {}

  async validateToken(token: string): Promise<void> {
    this.erro = '';
    this.sessaoEstabelecida = false;

    const { error } = await this.authService.verifyOtp({ token, type: 'email' });

    if (error) {
      this.erro = 'link inválido ou expirado';
      return;
    }

    const { data, error: sessionError } = await this.authService.getSession();

    if (sessionError || !data?.session) {
      this.erro = 'link inválido ou expirado';
      return;
    }

    this.sessaoEstabelecida = true;
  }
}
