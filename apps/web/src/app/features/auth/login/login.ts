import { Component, ErrorHandler, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AuthService,
  EmailNaoPermitidoError,
  FalhaDeRedeError,
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandler);

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected readonly linkDeConfirmacao = signal<string | null>(null);
  protected readonly emailNaoPermitido = signal(false);
  protected readonly falhaDeRede = signal(false);

  protected solicitarLink(): void {
    this.linkDeConfirmacao.set(null);
    this.emailNaoPermitido.set(false);
    this.falhaDeRede.set(false);

    this.authService.solicitarLink(this.form.controls.email.value).subscribe({
      next: (link) => this.linkDeConfirmacao.set(link),
      error: (erro: unknown) => {
        if (erro instanceof EmailNaoPermitidoError) {
          this.emailNaoPermitido.set(true);
          return;
        }
        if (erro instanceof FalhaDeRedeError) {
          this.falhaDeRede.set(true);
          return;
        }
        this.errorHandler.handleError(erro);
      },
    });
  }
}
