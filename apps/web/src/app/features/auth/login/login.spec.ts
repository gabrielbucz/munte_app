import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../core/services/auth.service';
import { Login } from './login';

describe('Login (tela Entrar)', () => {
  const linkDoCallback = '/auth/callback?token=token-de-teste';
  let solicitarLink: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    solicitarLink = vi.fn(() => of(linkDoCallback));
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), { provide: AuthService, useValue: { solicitarLink } }],
    }).compileComponents();
  });

  async function abrirTelaEntrar(): Promise<{ harness: RouterTestingHarness; raiz: HTMLElement }> {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/entrar', Login);
    return { harness, raiz: harness.routeNativeElement as HTMLElement };
  }

  function digitarEmail(harness: RouterTestingHarness, raiz: HTMLElement, email: string): void {
    const campo = raiz.querySelector<HTMLInputElement>('input[type="email"]');
    expect(campo).toBeTruthy();
    campo!.value = email;
    campo!.dispatchEvent(new Event('input'));
    harness.detectChanges();
  }

  function botaoSolicitar(raiz: HTMLElement): HTMLButtonElement {
    const botao = raiz.querySelector<HTMLButtonElement>('button[type="submit"]');
    expect(botao).toBeTruthy();
    return botao!;
  }

  function quadroEmailSimulado(raiz: HTMLElement): HTMLElement | undefined {
    return Array.from(raiz.querySelectorAll<HTMLElement>('section')).find(
      (secao) => secao.querySelector('h2')?.textContent?.trim() === 'E-mail simulado',
    );
  }

  it('CA1: a rota /entrar apresenta a tela Entrar', async () => {
    const { raiz } = await abrirTelaEntrar();

    expect(raiz.querySelector('input[type="email"]')).toBeTruthy();
    expect(quadroEmailSimulado(raiz)).toBeUndefined();
  });

  it('CA1: ao solicitar acesso com e-mail @alunos.utfpr.edu.br, chama solicitarLink e exibe o quadro "E-mail simulado" com o link clicável', async () => {
    const { harness, raiz } = await abrirTelaEntrar();

    digitarEmail(harness, raiz, 'fulano@alunos.utfpr.edu.br');
    botaoSolicitar(raiz).click();
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(solicitarLink).toHaveBeenCalledOnce();
    expect(solicitarLink).toHaveBeenCalledWith('fulano@alunos.utfpr.edu.br');

    const quadro = quadroEmailSimulado(raiz);
    expect(quadro).toBeTruthy();
    const link = quadro!.querySelector<HTMLAnchorElement>('a');
    expect(link?.getAttribute('href')).toBe(linkDoCallback);
  });

  it.each(['', 'fulano', 'fulano@'])(
    'CA1: o botão fica desabilitado com o campo "%s" (vazio ou fora do formato de e-mail)',
    async (email) => {
      const { harness, raiz } = await abrirTelaEntrar();

      digitarEmail(harness, raiz, email);

      const botao = botaoSolicitar(raiz);
      expect(botao.disabled).toBe(true);
      botao.click();
      harness.detectChanges();
      expect(solicitarLink).not.toHaveBeenCalled();
    },
  );
});
