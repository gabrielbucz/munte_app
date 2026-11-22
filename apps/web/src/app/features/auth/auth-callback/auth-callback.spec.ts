import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../core/services/auth.service';

describe('AuthCallback (confirmação do link)', () => {
  let confirmarLink: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    confirmarLink = vi.fn(() => of('valido'));
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        {
          provide: AuthService,
          useValue: {
            confirmarLink,
            sessao: signal({ email: 'fulano@alunos.utfpr.edu.br' }),
            autenticado: signal(true),
          },
        },
      ],
    }).compileComponents();
  });

  it('CA2: com link válido, confirma o token da URL e leva o aluno à tela Início', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/auth/callback?token=token-valido');
    await harness.fixture.whenStable();

    expect(confirmarLink).toHaveBeenCalledWith('token-valido');
    expect(TestBed.inject(Router).url).toBe('/inicio');
    expect(harness.routeNativeElement?.textContent).toContain(
      'Você entrou como fulano@alunos.utfpr.edu.br',
    );
  });

  it('CA3: com link inválido ou já usado, exibe "e-mail não permitido ou link inválido" e não navega', async () => {
    confirmarLink.mockReturnValue(of('invalido'));
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/auth/callback?token=token-adulterado');
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(confirmarLink).toHaveBeenCalledWith('token-adulterado');
    expect(TestBed.inject(Router).url).toBe('/auth/callback?token=token-adulterado');
    const alerta = harness.routeNativeElement?.querySelector('[role="alert"]');
    expect(alerta?.textContent?.trim()).toBe('e-mail não permitido ou link inválido');
    expect(harness.routeNativeElement?.textContent).not.toContain('Acesso bloqueado');
  });
});
