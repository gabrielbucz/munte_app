import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected readonly linkDeConfirmacao = signal<string | null>(null);

  protected solicitarLink(): void {
    this.authService
      .solicitarLink(this.form.controls.email.value)
      .subscribe((link) => this.linkDeConfirmacao.set(link));
  }
}
