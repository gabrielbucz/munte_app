import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label for="email">E-mail institucional</label>
      <input id="email" formControlName="email" type="email" placeholder="seu-email@utfpr.edu.br" />

      @if (form.get('email')?.invalid && form.get('email')?.touched) {
        <p class="erro">E-mail obrigatório e deve ser válido.</p>
      }

      <button type="submit" [disabled]="enviando || form.invalid">
        {{ enviando ? 'Enviando…' : 'Enviar link de confirmação' }}
      </button>

      @if (mensagem) {
        <p class="sucesso">{{ mensagem }}</p>
      }

      @if (erro) {
        <p class="alerta">{{ erro }}</p>
      }
    </form>
  `,
})
export class LoginComponent {
  protected readonly form: FormGroup;
  protected mensagem = '';
  protected erro = '';
  protected enviando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit(): Promise<void> {
    this.mensagem = '';
    this.erro = '';

    if (this.form.invalid) {
      return;
    }

    const email = this.form.get('email')?.value ?? '';
    this.enviando = true;

    try {
      await this.authService.requestMagicLink(email);
      this.mensagem = 'link enviado';
    } catch {
      this.erro = 'e-mail não permitido ou link inválido';
    } finally {
      this.enviando = false;
    }
  }
}
