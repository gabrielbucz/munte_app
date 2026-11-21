import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { routes } from '../../../app.routes';
import { AuthService, EmailNaoPermitidoError } from '../../../core/services/auth.service';
import { Login } from './login';

describe('Login (tela Entrar)', () => {
  const linkDoCallback = '/auth/callback?token=token-de-teste';
  const mensagemDeBloqueio = 'e-mail não permitido ou link inválido';
  let solicitarLink: ReturnType<typeof vi.fn>;
  let handleError: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    solicitarLink = vi.fn(() => of(linkDoCallback));
    handleError = vi.fn();
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: { solicitarLink } },
        { provide: ErrorHandler, useValue: { handleError } },
      ],
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

  async function submeter(
    harness: RouterTestingHarness,
    raiz: HTMLElement,
    email: string,
  ): Promise<void> {
    digitarEmail(harness, raiz, email);
    botaoSolicitar(raiz).click();
    harness.detectChanges();
    await harness.fixture.whenStable();
  }

  function mensagemDeErro(raiz: HTMLElement): HTMLElement | null {
    return raiz.querySelector<HTMLElement>('[role="alert"]');
  }

  function rejeitarComEmailNaoPermitido(): void {
    solicitarLink.mockReturnValueOnce(throwError(() => new EmailNaoPermitidoError()));
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

  it.each(['fulano@gmail.com', 'fulano@utfpr.edu.br'])(
    'CA3: ao solicitar acesso com "%s", exibe "e-mail não permitido ou link inválido" e não mostra o quadro "E-mail simulado"',
    async (email) => {
      rejeitarComEmailNaoPermitido();
      const { harness, raiz } = await abrirTelaEntrar();

      await submeter(harness, raiz, email);

      expect(solicitarLink).toHaveBeenCalledWith(email);
      const mensagem = mensagemDeErro(raiz);
      expect(mensagem?.textContent?.trim()).toBe(mensagemDeBloqueio);
      expect(quadroEmailSimulado(raiz)).toBeUndefined();

      const campo = raiz.querySelector<HTMLInputElement>('input[type="email"]');
      expect(mensagem?.id).toBeTruthy();
      expect(campo?.getAttribute('aria-describedby')).toBe(mensagem?.id);
      expect(campo?.getAttribute('aria-invalid')).toBe('true');
    },
  );

  it('CA3: sem erro, a tela não exibe a mensagem de bloqueio nem marca o campo como inválido', async () => {
    const { harness, raiz } = await abrirTelaEntrar();

    await submeter(harness, raiz, 'fulano@alunos.utfpr.edu.br');

    expect(mensagemDeErro(raiz)).toBeNull();
    const campo = raiz.querySelector<HTMLInputElement>('input[type="email"]');
    expect(campo?.hasAttribute('aria-describedby')).toBe(false);
    expect(campo?.hasAttribute('aria-invalid')).toBe(false);
  });

  it('CA3: errar e depois acertar — a mensagem de bloqueio some e o quadro "E-mail simulado" aparece', async () => {
    rejeitarComEmailNaoPermitido();
    const { harness, raiz } = await abrirTelaEntrar();

    await submeter(harness, raiz, 'fulano@gmail.com');
    expect(mensagemDeErro(raiz)).toBeTruthy();

    await submeter(harness, raiz, 'fulano@alunos.utfpr.edu.br');

    expect(mensagemDeErro(raiz)).toBeNull();
    expect(quadroEmailSimulado(raiz)).toBeTruthy();
  });

  it('CA3: acertar e depois errar — o quadro com o link antigo some e a mensagem de bloqueio aparece', async () => {
    const { harness, raiz } = await abrirTelaEntrar();

    await submeter(harness, raiz, 'fulano@alunos.utfpr.edu.br');
    expect(quadroEmailSimulado(raiz)).toBeTruthy();

    rejeitarComEmailNaoPermitido();
    await submeter(harness, raiz, 'fulano@gmail.com');

    expect(quadroEmailSimulado(raiz)).toBeUndefined();
    expect(raiz.querySelector(`a[href="${linkDoCallback}"]`)).toBeNull();
    expect(mensagemDeErro(raiz)?.textContent?.trim()).toBe(mensagemDeBloqueio);
  });

  it('erro que não é de e-mail não permitido não exibe a mensagem do CA3 e é repassado ao ErrorHandler', async () => {
    const falhaDeRede = new Error('falha de rede');
    solicitarLink.mockReturnValueOnce(throwError(() => falhaDeRede));
    const { harness, raiz } = await abrirTelaEntrar();

    await submeter(harness, raiz, 'fulano@alunos.utfpr.edu.br');

    expect(mensagemDeErro(raiz)).toBeNull();
    expect(quadroEmailSimulado(raiz)).toBeUndefined();
    expect(handleError).toHaveBeenCalledWith(falhaDeRede);
  });
});
