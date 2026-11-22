import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

const SESSAO = { email: 'fulano@alunos.utfpr.edu.br' };

function configurar(comSessao: boolean): void {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(routes, withComponentInputBinding()),
      {
        provide: AuthService,
        useValue: {
          sessao: signal(comSessao ? SESSAO : null),
          autenticado: signal(comSessao),
        },
      },
    ],
  });
}

function executarGuard(): ReturnType<typeof authGuard> {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('authGuard', () => {
  it('CA2: com sessão, libera a rota (retorna true)', () => {
    configurar(true);

    expect(executarGuard()).toBe(true);
  });

  it('CA3: sem sessão, bloqueia e devolve um UrlTree para /entrar', () => {
    configurar(false);

    const resultado = executarGuard();

    expect(resultado).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/entrar');
  });

  it('CA2: com as rotas reais e com sessão, navegar para / leva à tela Início', async () => {
    configurar(true);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/');

    expect(TestBed.inject(Router).url).toBe('/inicio');
    expect(harness.routeNativeElement?.textContent).toContain(
      'Você entrou como fulano@alunos.utfpr.edu.br',
    );
  });

  it('CA2/CA3: com as rotas reais e sem sessão, navegar para / não exibe a Início e leva a /entrar', async () => {
    configurar(false);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/');

    expect(TestBed.inject(Router).url).toBe('/entrar');
    expect(harness.routeNativeElement?.textContent).not.toContain('Você entrou como');
  });
});
