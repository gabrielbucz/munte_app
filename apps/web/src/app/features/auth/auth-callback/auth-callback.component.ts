import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: ``,
})
export class AuthCallbackComponent {
  sessaoEstabelecida = false;
  erro = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  async validateToken(): Promise<void> {
    this.erro = '';
    this.sessaoEstabelecida = false;

    const tokenHash = this.route.snapshot.queryParams['token_hash'];

    if (!tokenHash) {
      this.erro = 'link inválido ou expirado';
      return;
    }

    const { error } = await this.authService.verifyOtp({
      token_hash: tokenHash,
      type: 'email',
    });

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
