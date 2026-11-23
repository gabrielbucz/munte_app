import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { Neighborhood } from '../../../core/models/neighborhood';
import { AuthService } from '../../../core/services/auth.service';
import { NeighborhoodService } from '../../../core/services/neighborhood.service';
import { RideOfferForm } from './ride-offer-form';

const BAIRROS: Neighborhood[] = [
  {
    id: '1',
    name: 'Centro',
    pickupPoints: [
      { id: '1', neighborhoodId: '1', label: 'Praça central', order: 1 },
      { id: '2', neighborhoodId: '1', label: 'Igreja matriz', order: 2 },
      { id: '3', neighborhoodId: '1', label: 'Terminal central', order: 3 },
    ],
  },
  {
    id: '2',
    name: 'Vila Nova',
    pickupPoints: [
      { id: '4', neighborhoodId: '2', label: 'Escola estadual', order: 1 },
      { id: '5', neighborhoodId: '2', label: 'Posto de saúde', order: 2 },
      { id: '6', neighborhoodId: '2', label: 'Mercado do bairro', order: 3 },
    ],
  },
];

function configurar(comSessao: boolean): void {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(routes, withComponentInputBinding()),
      {
        provide: AuthService,
        useValue: {
          sessao: signal(comSessao ? { email: 'fulano@alunos.utfpr.edu.br' } : null),
          autenticado: signal(comSessao),
        },
      },
      { provide: NeighborhoodService, useValue: { listar: () => of(BAIRROS) } },
    ],
  });
}

function campoPorRotulo<T extends HTMLElement>(raiz: HTMLElement, rotulo: string): T {
  const label = Array.from(raiz.querySelectorAll('label')).find(
    (l) => l.textContent?.trim() === rotulo,
  );
  expect(label, `rótulo "${rotulo}"`).toBeTruthy();
  const campo = raiz.querySelector<T>(`#${label!.htmlFor}`);
  expect(campo, `campo do rótulo "${rotulo}"`).toBeTruthy();
  return campo!;
}

async function abrirFormulario(): Promise<{ harness: RouterTestingHarness; raiz: HTMLElement }> {
  configurar(true);
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl('/ofertas/nova', RideOfferForm);
  harness.detectChanges();
  return { harness, raiz: harness.routeNativeElement as HTMLElement };
}

function mensagemDoCampo(raiz: HTMLElement, campo: HTMLElement): string | undefined {
  const id = campo.getAttribute('aria-describedby');
  if (!id) return undefined;
  return raiz.querySelector(`#${id}`)?.textContent?.trim();
}

function sair(harness: RouterTestingHarness, campo: HTMLElement): void {
  campo.dispatchEvent(new Event('blur'));
  harness.detectChanges();
}

function escolher(harness: RouterTestingHarness, select: HTMLSelectElement, texto: string): void {
  const opcao = Array.from(select.options).find((o) => o.textContent?.trim() === texto);
  expect(opcao, `opção "${texto}"`).toBeTruthy();
  select.value = opcao!.value;
  select.dispatchEvent(new Event('change'));
  harness.detectChanges();
}

describe('RideOfferForm (formulário de nova oferta)', () => {
  it('CA13: sem sessão, abrir /ofertas/nova leva à tela Entrar', async () => {
    configurar(false);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/ofertas/nova');

    expect(TestBed.inject(Router).url).toBe('/entrar');
  });

  it('CA13/CA15: com sessão, /ofertas/nova mostra os campos sentido, bairro, ponto, horário, vagas e observações', async () => {
    configurar(true);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/ofertas/nova', RideOfferForm);
    harness.detectChanges();
    const raiz = harness.routeNativeElement as HTMLElement;

    expect(TestBed.inject(Router).url).toBe('/ofertas/nova');

    const sentido = Array.from(raiz.querySelectorAll('fieldset')).find(
      (f) => f.querySelector('legend')?.textContent?.trim() === 'Sentido',
    );
    expect(sentido).toBeTruthy();
    const opcoesDeSentido = Array.from(
      sentido!.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ).map((radio) => radio.closest('label')?.textContent?.trim());
    expect(opcoesDeSentido).toEqual(['Ida', 'Volta']);

    const bairro = campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro');
    expect(bairro.tagName).toBe('SELECT');
    const nomesDosBairros = Array.from(bairro.options).map((o) => o.textContent?.trim());
    expect(nomesDosBairros).toEqual(expect.arrayContaining(['Centro', 'Vila Nova']));

    expect(campoPorRotulo(raiz, 'Ponto').tagName).toBe('SELECT');
    expect(campoPorRotulo<HTMLInputElement>(raiz, 'Horário').type).toBe('datetime-local');
    expect(campoPorRotulo<HTMLInputElement>(raiz, 'Vagas').type).toBe('number');
    expect(campoPorRotulo(raiz, 'Observações').tagName).toBe('TEXTAREA');
  });
});

function fieldsetSentido(raiz: HTMLElement): HTMLFieldSetElement {
  const fieldset = Array.from(raiz.querySelectorAll('fieldset')).find(
    (f) => f.querySelector('legend')?.textContent?.trim() === 'Sentido',
  );
  expect(fieldset, 'fieldset "Sentido"').toBeTruthy();
  return fieldset!;
}

function botaoPublicar(raiz: HTMLElement): HTMLButtonElement {
  const botao = Array.from(raiz.querySelectorAll('button')).find(
    (b) => b.textContent?.trim() === 'Publicar',
  );
  expect(botao, 'botão "Publicar"').toBeTruthy();
  return botao!;
}

function digitar(harness: RouterTestingHarness, campo: HTMLInputElement, valor: string): void {
  campo.value = valor;
  campo.dispatchEvent(new Event('input'));
  harness.detectChanges();
}

function horarioNoFuturo(): string {
  const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const doisDigitos = (n: number) => String(n).padStart(2, '0');
  return (
    `${amanha.getFullYear()}-${doisDigitos(amanha.getMonth() + 1)}-${doisDigitos(amanha.getDate())}` +
    `T${doisDigitos(amanha.getHours())}:${doisDigitos(amanha.getMinutes())}`
  );
}

type CampoObrigatorio = 'Sentido' | 'Bairro' | 'Ponto' | 'Horário' | 'Vagas';

// Preenche com valores válidos todos os obrigatórios (bairro Centro, ponto Praça central), menos `deFora`.
function preencherTudoMenos(
  harness: RouterTestingHarness,
  raiz: HTMLElement,
  deFora?: CampoObrigatorio,
): void {
  if (deFora !== 'Sentido') {
    const ida = Array.from(
      fieldsetSentido(raiz).querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ).find((radio) => radio.closest('label')?.textContent?.trim() === 'Ida');
    expect(ida, 'opção "Ida"').toBeTruthy();
    ida!.click();
    harness.detectChanges();
  }
  if (deFora !== 'Bairro') {
    escolher(harness, campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro'), 'Centro');
  }
  // Sem bairro, o campo ponto não tem opções (CA10): deixar o bairro de fora deixa o ponto também.
  if (deFora !== 'Ponto' && deFora !== 'Bairro') {
    escolher(harness, campoPorRotulo<HTMLSelectElement>(raiz, 'Ponto'), 'Praça central');
  }
  if (deFora !== 'Horário') {
    digitar(harness, campoPorRotulo<HTMLInputElement>(raiz, 'Horário'), horarioNoFuturo());
  }
  if (deFora !== 'Vagas') {
    digitar(harness, campoPorRotulo<HTMLInputElement>(raiz, 'Vagas'), '2');
  }
}

describe('RideOfferForm: campos obrigatórios (CA4, CA9)', () => {
  const OBRIGATORIO = 'preenchimento obrigatório';

  function mensagensObrigatorio(raiz: HTMLElement): HTMLElement[] {
    return Array.from(raiz.querySelectorAll<HTMLElement>('[role="alert"]')).filter(
      (alerta) => alerta.textContent?.trim() === OBRIGATORIO,
    );
  }

  it('CA9: recém-aberto, nenhuma mensagem de erro aparece e "Publicar" está desligado', async () => {
    const { raiz } = await abrirFormulario();

    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(0);
    expect(raiz.textContent).not.toContain(OBRIGATORIO);
    expect(botaoPublicar(raiz).disabled).toBe(true);
  });

  it.each(['Bairro', 'Ponto', 'Horário', 'Vagas'] as const)(
    'CA4/CA9: sair de "%s" vazio mostra "preenchimento obrigatório" só nesse campo',
    async (rotulo) => {
      const { harness, raiz } = await abrirFormulario();
      const campo = campoPorRotulo(raiz, rotulo);

      sair(harness, campo);

      expect(mensagemDoCampo(raiz, campo)).toBe(OBRIGATORIO);
      expect(mensagensObrigatorio(raiz)).toHaveLength(1);
      expect(botaoPublicar(raiz).disabled).toBe(true);
    },
  );

  it('CA4/CA9: sair do sentido sem escolher mostra "preenchimento obrigatório" uma vez, junto ao fieldset', async () => {
    const { harness, raiz } = await abrirFormulario();
    const fieldset = fieldsetSentido(raiz);
    const radios = Array.from(fieldset.querySelectorAll<HTMLInputElement>('input[type="radio"]'));

    radios.forEach((radio) => sair(harness, radio));

    expect(mensagemDoCampo(raiz, fieldset)).toBe(OBRIGATORIO);
    expect(mensagensObrigatorio(raiz)).toHaveLength(1);
    expect(botaoPublicar(raiz).disabled).toBe(true);
  });

  it('CA9: com todos os obrigatórios preenchidos com valores válidos, "Publicar" liga', async () => {
    const { harness, raiz } = await abrirFormulario();

    preencherTudoMenos(harness, raiz);

    expect(botaoPublicar(raiz).disabled).toBe(false);
  });

  it.each(['Sentido', 'Ponto', 'Horário', 'Vagas'] as const)(
    'CA4/CA9: com "%s" vazio e o resto preenchido, "Publicar" fica desligado',
    async (deFora) => {
      const { harness, raiz } = await abrirFormulario();

      preencherTudoMenos(harness, raiz, deFora);

      expect(botaoPublicar(raiz).disabled).toBe(true);
    },
  );

  it('CA4/CA9/CA10: com "Bairro" vazio (e por isso sem ponto) e o resto preenchido, "Publicar" fica desligado', async () => {
    const { harness, raiz } = await abrirFormulario();

    preencherTudoMenos(harness, raiz, 'Bairro');

    expect(campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro').value).toBe('');
    expect(campoPorRotulo<HTMLSelectElement>(raiz, 'Ponto').value).toBe('');
    expect(botaoPublicar(raiz).disabled).toBe(true);
  });

  it('CA4: observações vazias não bloqueiam nem mostram mensagem', async () => {
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);
    const observacoes = campoPorRotulo(raiz, 'Observações');

    sair(harness, observacoes);

    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(0);
    expect(botaoPublicar(raiz).disabled).toBe(false);
  });
});

describe('RideOfferForm: pontos do bairro escolhido (CA10)', () => {
  function pontosListados(raiz: HTMLElement): (string | undefined)[] {
    return Array.from(campoPorRotulo<HTMLSelectElement>(raiz, 'Ponto').options)
      .filter((opcao) => opcao.value !== '')
      .map((opcao) => opcao.textContent?.trim());
  }

  it.each([
    ['Centro', ['Praça central', 'Igreja matriz', 'Terminal central']],
    ['Vila Nova', ['Escola estadual', 'Posto de saúde', 'Mercado do bairro']],
  ])('escolhido o bairro "%s", o campo ponto lista só os 3 pontos dele', async (bairro, pontos) => {
    const { harness, raiz } = await abrirFormulario();

    escolher(harness, campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro'), bairro);

    expect(pontosListados(raiz)).toEqual(pontos);
  });

  it('trocar de bairro desmarca o ponto escolhido antes, sem mostrar "preenchimento obrigatório" só por causa da troca', async () => {
    const { harness, raiz } = await abrirFormulario();
    const bairro = campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro');
    const ponto = campoPorRotulo<HTMLSelectElement>(raiz, 'Ponto');
    // Tudo válido, com bairro Centro e ponto Praça central: só o ponto pode desligar "Publicar" depois.
    preencherTudoMenos(harness, raiz);
    sair(harness, ponto);
    expect(ponto.value, 'ponto escolhido antes da troca').not.toBe('');
    expect(botaoPublicar(raiz).disabled, '"Publicar" antes da troca').toBe(false);

    escolher(harness, bairro, 'Vila Nova');

    // O <select> mostra vazio mesmo sem limpar o modelo (a opção do Centro sumiu da tela);
    // "Publicar" desligado é o que prova que o ponto foi desmarcado no formulário.
    expect(botaoPublicar(raiz).disabled, '"Publicar" depois da troca').toBe(true);
    expect(ponto.value).toBe('');
    expect(ponto.getAttribute('aria-invalid')).toBeNull();
    expect(mensagemDoCampo(raiz, ponto)).toBeUndefined();
    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(0);
  });
});

describe('RideOfferForm: vagas entre 1 e 4 (CA3, CA7, CA9)', () => {
  // Tudo válido menos Vagas: só o valor digitado em Vagas pode desligar "Publicar".
  async function preencherVagas(
    valor: string,
  ): Promise<{ raiz: HTMLElement; vagas: HTMLInputElement }> {
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz, 'Vagas');
    const vagas = campoPorRotulo<HTMLInputElement>(raiz, 'Vagas');
    digitar(harness, vagas, valor);
    sair(harness, vagas);
    return { raiz, vagas };
  }

  it.each(['1', '4'])('aceita %s vaga(s): sem mensagem e "Publicar" ligado', async (valor) => {
    const { raiz, vagas } = await preencherVagas(valor);

    expect(mensagemDoCampo(raiz, vagas)).toBeUndefined();
    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(0);
    expect(botaoPublicar(raiz).disabled).toBe(false);
  });

  it.each([
    ['0', 'mínimo 1 vaga'],
    ['-1', 'mínimo 1 vaga'],
    ['5', 'máximo 4 vagas'],
  ])('recusa %s vaga(s): mostra "%s" e "Publicar" fica desligado', async (valor, mensagem) => {
    const { raiz, vagas } = await preencherVagas(valor);

    expect(mensagemDoCampo(raiz, vagas)).toBe(mensagem);
    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(1);
    expect(botaoPublicar(raiz).disabled).toBe(true);
  });
});
