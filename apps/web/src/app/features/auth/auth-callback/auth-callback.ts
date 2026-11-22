import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ResultadoDaConfirmacao } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  imports: [RouterLink],
  templateUrl: './auth-callback.html',
})
export class AuthCallback implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly token = input<string>();

  protected readonly bloqueio = signal<Exclude<ResultadoDaConfirmacao, 'valido'> | null>(null);

  ngOnInit(): void {
    this.authService.confirmarLink(this.token() ?? '').subscribe((resultado) => {
      if (resultado === 'valido') {
        void this.router.navigateByUrl('/inicio');
        return;
      }
      this.bloqueio.set(resultado);
    });
  }
}
