import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Subject, of, throwError } from 'rxjs';
import { routes } from '../../../app.routes';
import { Neighborhood } from '../../../core/models/neighborhood';
import { NovaRideOffer, RideOffer } from '../../../core/models/ride-offer';
import { AuthService, FalhaDeRedeError } from '../../../core/services/auth.service';
import { NeighborhoodService } from '../../../core/services/neighborhood.service';
import { RideOfferService } from '../../../core/services/ride-offer.service';
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

// O service devolve a oferta como o json-server a grava, com o id que ele deu.
function ofertaCriada(nova: NovaRideOffer): RideOffer {
  return {
    id: '42',
    driverId: 'fulano@alunos.utfpr.edu.br',
    availableSeats: nova.totalSeats,
    status: 'available',
    createdAt: new Date().toISOString(),
    ...nova,
  };
}

let criar: ReturnType<typeof vi.fn>;
let handleError: ReturnType<typeof vi.fn>;

function configurar(comSessao: boolean): void {
  criar = vi.fn((nova: NovaRideOffer) => of(ofertaCriada(nova)));
  handleError = vi.fn();
  TestBed.configureTestingModule({
    providers: [
      provideRouter(routes, withComponentInputBinding()),
      { provide: ErrorHandler, useValue: { handleError } },
      {
        provide: AuthService,
        useValue: {
          sessao: signal(comSessao ? { email: 'fulano@alunos.utfpr.edu.br' } : null),
          autenticado: signal(comSessao),
        },
      },
      { provide: NeighborhoodService, useValue: { listar: () => of(BAIRROS) } },
      // buscarPorId: a tela /ofertas/<id>, para onde o formulário leva depois de publicar.
      { provide: RideOfferService, useValue: { criar, buscarPorId: () => of(null) } },
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

function digitar(
  harness: RouterTestingHarness,
  campo: HTMLInputElement | HTMLTextAreaElement,
  valor: string,
): void {
  campo.value = valor;
  campo.dispatchEvent(new Event('input'));
  harness.detectChanges();
}

const UM_DIA = 24 * 60 * 60 * 1000;

// Texto "AAAA-MM-DDTHH:mm" do <input type="datetime-local">, em hora local (e não UTC).
function horarioLocal(deslocamentoEmMs: number): string {
  const instante = new Date(Date.now() + deslocamentoEmMs);
  const doisDigitos = (n: number) => String(n).padStart(2, '0');
  return (
    `${instante.getFullYear()}-${doisDigitos(instante.getMonth() + 1)}-${doisDigitos(instante.getDate())}` +
    `T${doisDigitos(instante.getHours())}:${doisDigitos(instante.getMinutes())}`
  );
}

function horarioNoFuturo(): string {
  return horarioLocal(UM_DIA);
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

describe('RideOfferForm: horário no futuro (CA5, CA9)', () => {
  it('horário no passado mostra "precisa ser no futuro" e "Publicar" fica desligado', async () => {
    const { harness, raiz } = await abrirFormulario();
    // Tudo válido menos Horário: só o horário digitado pode desligar "Publicar".
    preencherTudoMenos(harness, raiz, 'Horário');
    const horario = campoPorRotulo<HTMLInputElement>(raiz, 'Horário');

    digitar(harness, horario, horarioLocal(-UM_DIA));
    sair(harness, horario);

    expect(mensagemDoCampo(raiz, horario)).toBe('precisa ser no futuro');
    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(1);
    expect(botaoPublicar(raiz).disabled).toBe(true);
  });
});

describe('RideOfferForm: observações com no máximo 200 caracteres (CA8, CA9)', () => {
  // Tudo válido: só o tamanho das observações pode desligar "Publicar".
  async function preencherObservacoes(
    tamanho: number,
  ): Promise<{ raiz: HTMLElement; observacoes: HTMLTextAreaElement }> {
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);
    const observacoes = campoPorRotulo<HTMLTextAreaElement>(raiz, 'Observações');
    digitar(harness, observacoes, 'a'.repeat(tamanho));
    sair(harness, observacoes);
    return { raiz, observacoes };
  }

  it('aceita 200 caracteres: sem mensagem e "Publicar" ligado', async () => {
    const { raiz, observacoes } = await preencherObservacoes(200);

    expect(observacoes.getAttribute('aria-invalid')).toBeNull();
    expect(mensagemDoCampo(raiz, observacoes)).toBeUndefined();
    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(0);
    expect(botaoPublicar(raiz).disabled).toBe(false);
  });

  it('recusa 201 caracteres: mostra "máximo 200 caracteres" e "Publicar" fica desligado', async () => {
    const { raiz, observacoes } = await preencherObservacoes(201);

    expect(observacoes.getAttribute('aria-invalid')).toBe('true');
    expect(mensagemDoCampo(raiz, observacoes)).toBe('máximo 200 caracteres');
    expect(raiz.querySelectorAll('[role="alert"]')).toHaveLength(1);
    expect(botaoPublicar(raiz).disabled).toBe(true);
  });
});

describe('RideOfferForm: publicar a oferta (CA1, CA2)', () => {
  function escolherSentido(harness: RouterTestingHarness, raiz: HTMLElement, texto: string): void {
    const radio = Array.from(
      fieldsetSentido(raiz).querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ).find((r) => r.closest('label')?.textContent?.trim() === texto);
    expect(radio, `opção "${texto}"`).toBeTruthy();
    radio!.click();
    harness.detectChanges();
  }

  // O texto que o motorista digita no datetime-local é hora local, sem fuso. O ISO esperado sai
  // do mesmo instante montado em hora local, então o teste vale em qualquer fuso da máquina.
  const HORARIO_DIGITADO = '2030-01-15T07:30';
  const HORARIO_EM_ISO = new Date(2030, 0, 15, 7, 30).toISOString();

  async function preencherEPublicar(observacoes: string): Promise<void> {
    const { harness, raiz } = await abrirFormulario();
    escolherSentido(harness, raiz, 'Volta');
    escolher(harness, campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro'), 'Vila Nova');
    escolher(harness, campoPorRotulo<HTMLSelectElement>(raiz, 'Ponto'), 'Posto de saúde');
    digitar(harness, campoPorRotulo<HTMLInputElement>(raiz, 'Horário'), HORARIO_DIGITADO);
    digitar(harness, campoPorRotulo<HTMLInputElement>(raiz, 'Vagas'), '3');
    digitar(harness, campoPorRotulo<HTMLTextAreaElement>(raiz, 'Observações'), observacoes);
    expect(botaoPublicar(raiz).disabled, '"Publicar" antes do clique').toBe(false);

    botaoPublicar(raiz).click();
    await harness.fixture.whenStable();
  }

  it('CA1/CA2: publicar um formulário válido envia os dados digitados, com o horário em ISO', async () => {
    await preencherEPublicar('Espero 5 minutos');

    expect(criar).toHaveBeenCalledTimes(1);
    expect(criar).toHaveBeenCalledWith({
      direction: 'return',
      neighborhoodId: '2',
      pickupPointId: '5',
      departureTime: HORARIO_EM_ISO,
      totalSeats: 3,
      notes: 'Espero 5 minutos',
    } satisfies NovaRideOffer);
  });

  it('CA2: observações vazias são enviadas como texto vazio', async () => {
    await preencherEPublicar('');

    expect(criar).toHaveBeenCalledWith(expect.objectContaining({ notes: '' }));
  });

  it('CA1: depois de publicar, leva o motorista a /ofertas/<id>?publicada=1 com o id da oferta criada', async () => {
    await preencherEPublicar('Espero 5 minutos');

    expect(TestBed.inject(Router).url).toBe('/ofertas/42?publicada=1');
  });
});

describe('RideOfferForm: servidor sem resposta ao publicar (CA11)', () => {
  const MENSAGEM_DE_FALHA =
    'Não foi possível publicar a oferta. Verifique sua conexão e tente novamente.';
  const HORARIO_DIGITADO = '2030-01-15T07:30';

  function alertaDeFalha(raiz: HTMLElement): HTMLElement | undefined {
    return Array.from(raiz.querySelectorAll<HTMLElement>('[role="alert"]')).find(
      (alerta) => alerta.textContent?.trim() === MENSAGEM_DE_FALHA,
    );
  }

  function botaoComTexto(raiz: HTMLElement, texto: string): HTMLButtonElement | undefined {
    return Array.from(raiz.querySelectorAll('button')).find((b) => b.textContent?.trim() === texto);
  }

  async function clicar(harness: RouterTestingHarness, botao: HTMLButtonElement): Promise<void> {
    botao.click();
    harness.detectChanges();
    await harness.fixture.whenStable();
  }

  // Preenche tudo (inclusive observações) e publica com o service falhando por falta de rede.
  async function publicarSemRede(): Promise<{ harness: RouterTestingHarness; raiz: HTMLElement }> {
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);
    digitar(harness, campoPorRotulo<HTMLInputElement>(raiz, 'Horário'), HORARIO_DIGITADO);
    digitar(harness, campoPorRotulo<HTMLTextAreaElement>(raiz, 'Observações'), 'Espero 5 minutos');
    criar.mockReturnValueOnce(throwError(() => new FalhaDeRedeError()));

    await clicar(harness, botaoPublicar(raiz));
    return { harness, raiz };
  }

  it('mostra a mensagem de falha como alerta, fica no formulário e não vai ao ErrorHandler', async () => {
    const { raiz } = await publicarSemRede();

    expect(criar).toHaveBeenCalledTimes(1);
    expect(alertaDeFalha(raiz)).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/ofertas/nova');
    expect(handleError).not.toHaveBeenCalled();
  });

  it('o que foi preenchido continua no formulário', async () => {
    const { raiz } = await publicarSemRede();

    const ida = Array.from(
      fieldsetSentido(raiz).querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ).find((radio) => radio.closest('label')?.textContent?.trim() === 'Ida');
    expect(ida?.checked).toBe(true);
    expect(campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro').value).toBe('1');
    expect(campoPorRotulo<HTMLSelectElement>(raiz, 'Ponto').value).toBe('1');
    expect(campoPorRotulo<HTMLInputElement>(raiz, 'Horário').value).toBe(HORARIO_DIGITADO);
    expect(campoPorRotulo<HTMLInputElement>(raiz, 'Vagas').value).toBe('2');
    expect(campoPorRotulo<HTMLTextAreaElement>(raiz, 'Observações').value).toBe('Espero 5 minutos');
  });

  it('o botão de envio passa a se chamar "Tentar novamente" e fica ligado', async () => {
    const { raiz } = await publicarSemRede();

    const tentarNovamente = botaoComTexto(raiz, 'Tentar novamente');
    expect(tentarNovamente, 'botão "Tentar novamente"').toBeTruthy();
    expect(tentarNovamente!.type).toBe('submit');
    expect(tentarNovamente!.disabled).toBe(false);
    expect(botaoComTexto(raiz, 'Publicar')).toBeUndefined();
  });

  it('"Tentar novamente" reenvia os mesmos dados sem redigitar e, com sucesso, leva a /ofertas/<id>?publicada=1', async () => {
    const { harness, raiz } = await publicarSemRede();
    const primeiroEnvio: unknown = criar.mock.calls[0][0];

    await clicar(harness, botaoComTexto(raiz, 'Tentar novamente')!);

    expect(criar).toHaveBeenCalledTimes(2);
    expect(criar.mock.calls[1][0]).toStrictEqual(primeiroEnvio);
    expect(TestBed.inject(Router).url).toBe('/ofertas/42?publicada=1');
  });

  it('ao reenviar, a mensagem de falha some enquanto o servidor não responde', async () => {
    const { harness, raiz } = await publicarSemRede();
    criar.mockReturnValueOnce(new Subject<RideOffer>());

    await clicar(harness, botaoComTexto(raiz, 'Tentar novamente')!);

    expect(alertaDeFalha(raiz)).toBeUndefined();
  });

  it('erro que não é de rede (ex.: 500) não mostra a mensagem de falha e é repassado ao ErrorHandler', async () => {
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);
    const erroDoServidor = new HttpErrorResponse({ status: 500 });
    criar.mockReturnValueOnce(throwError(() => erroDoServidor));

    await clicar(harness, botaoPublicar(raiz));

    expect(alertaDeFalha(raiz)).toBeUndefined();
    expect(handleError).toHaveBeenCalledWith(erroDoServidor);
    expect(TestBed.inject(Router).url).toBe('/ofertas/nova');
  });
});

describe('RideOfferForm: envio em andamento (CA12)', () => {
  function botaoDeEnvio(raiz: HTMLElement): HTMLButtonElement {
    const botao = raiz.querySelector<HTMLButtonElement>('button[type="submit"]');
    expect(botao, 'botão de envio').toBeTruthy();
    return botao!;
  }

  // O Enter num campo dispara o submit do formulário sem passar pelo clique no botão.
  function enviarPeloFormulario(harness: RouterTestingHarness, raiz: HTMLElement): void {
    raiz.querySelector('form')!.dispatchEvent(new Event('submit'));
    harness.detectChanges();
  }

  // Preenche tudo e toca em "Publicar" com o servidor ainda sem responder.
  async function publicarComEnvioPendente(): Promise<{
    harness: RouterTestingHarness;
    raiz: HTMLElement;
    resposta: Subject<RideOffer>;
  }> {
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);
    const resposta = new Subject<RideOffer>();
    criar.mockReturnValueOnce(resposta);

    botaoPublicar(raiz).click();
    harness.detectChanges();
    return { harness, raiz, resposta };
  }

  it('com o envio pendente, o botão fica desligado com o texto "Publicando…"', async () => {
    const { raiz } = await publicarComEnvioPendente();

    const botao = botaoDeEnvio(raiz);
    expect(botao.disabled).toBe(true);
    expect(botao.textContent?.trim()).toBe('Publicando…');
    expect(criar).toHaveBeenCalledTimes(1);
  });

  it('com o envio pendente, um segundo toque ou um Enter não chamam o service de novo', async () => {
    const { harness, raiz } = await publicarComEnvioPendente();

    botaoDeEnvio(raiz).click();
    harness.detectChanges();
    enviarPeloFormulario(harness, raiz);

    expect(criar).toHaveBeenCalledTimes(1);
  });

  it('depois do sucesso, enquanto a tela ainda não saiu, um novo envio não chama o service de novo', async () => {
    const { harness, raiz, resposta } = await publicarComEnvioPendente();
    const nova = criar.mock.calls[0][0] as NovaRideOffer;

    resposta.next(ofertaCriada(nova));
    resposta.complete();
    enviarPeloFormulario(harness, raiz);

    expect(criar).toHaveBeenCalledTimes(1);
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/ofertas/42?publicada=1');
  });

  it('depois de uma falha de rede, o botão volta a ligar, como "Tentar novamente"', async () => {
    const { harness, raiz, resposta } = await publicarComEnvioPendente();

    resposta.error(new FalhaDeRedeError());
    harness.detectChanges();

    const botao = botaoDeEnvio(raiz);
    expect(botao.disabled).toBe(false);
    expect(botao.textContent?.trim()).toBe('Tentar novamente');
  });

  it('depois de um erro que não é de rede, o botão volta a ligar, como "Publicar"', async () => {
    const { harness, raiz, resposta } = await publicarComEnvioPendente();

    resposta.error(new HttpErrorResponse({ status: 500 }));
    harness.detectChanges();

    const botao = botaoDeEnvio(raiz);
    expect(botao.disabled).toBe(false);
    expect(botao.textContent?.trim()).toBe('Publicar');
  });

  it('com o formulário inválido, enviar pelo Enter não chama o service', async () => {
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz, 'Vagas');

    enviarPeloFormulario(harness, raiz);

    expect(criar).not.toHaveBeenCalled();
  });
});

describe('RideOfferForm: descartar um cadastro pela metade (CA6)', () => {
  const PERGUNTA = 'Descartar esta oferta? O que você preencheu será perdido.';
  const HORARIO_DIGITADO = '2030-01-15T07:30';

  afterEach(() => vi.restoreAllMocks());

  function responder(confirmou: boolean): ReturnType<typeof vi.spyOn> {
    return vi.spyOn(window, 'confirm').mockReturnValue(confirmou);
  }

  function botaoCancelar(raiz: HTMLElement): HTMLButtonElement {
    const botao = Array.from(raiz.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Cancelar',
    );
    expect(botao, 'botão "Cancelar"').toBeTruthy();
    return botao!;
  }

  async function cancelar(harness: RouterTestingHarness, raiz: HTMLElement): Promise<void> {
    botaoCancelar(raiz).click();
    harness.detectChanges();
    await harness.fixture.whenStable();
  }

  // O que um link (routerLink) faz ao ser tocado: pede ao Router a navegação para outro endereço.
  async function sairPorLink(harness: RouterTestingHarness): Promise<void> {
    await TestBed.inject(Router).navigateByUrl('/inicio');
    harness.detectChanges();
  }

  // Alterado, e não completo: o cadastro pela metade do CA6.
  function preencherPelaMetade(harness: RouterTestingHarness, raiz: HTMLElement): void {
    escolher(harness, campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro'), 'Centro');
    digitar(harness, campoPorRotulo<HTMLInputElement>(raiz, 'Horário'), HORARIO_DIGITADO);
  }

  function esperarValoresMantidos(raiz: HTMLElement): void {
    expect(campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro').value).toBe('1');
    expect(campoPorRotulo<HTMLInputElement>(raiz, 'Horário').value).toBe(HORARIO_DIGITADO);
  }

  it('"Cancelar" é um botão comum, que não envia o formulário', async () => {
    const { raiz } = await abrirFormulario();

    expect(botaoCancelar(raiz).type).toBe('button');
  });

  it('com o formulário intocado, "Cancelar" leva a /inicio sem perguntar', async () => {
    const confirmar = responder(false);
    const { harness, raiz } = await abrirFormulario();

    await cancelar(harness, raiz);

    expect(confirmar).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/inicio');
  });

  it('com o formulário alterado, "Cancelar" pergunta uma vez; confirmando, nada é enviado e vai para /inicio', async () => {
    const confirmar = responder(true);
    const { harness, raiz } = await abrirFormulario();
    preencherPelaMetade(harness, raiz);

    await cancelar(harness, raiz);

    expect(confirmar).toHaveBeenCalledTimes(1);
    expect(confirmar).toHaveBeenCalledWith(PERGUNTA);
    expect(criar).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/inicio');
  });

  it('com o formulário completo e válido, "Cancelar" confirmado também não envia nada', async () => {
    responder(true);
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);

    await cancelar(harness, raiz);

    expect(criar).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/inicio');
  });

  it('com o formulário alterado, "Cancelar" recusado mantém a tela com o que foi preenchido', async () => {
    const confirmar = responder(false);
    const { harness, raiz } = await abrirFormulario();
    preencherPelaMetade(harness, raiz);

    await cancelar(harness, raiz);

    expect(confirmar).toHaveBeenCalledWith(PERGUNTA);
    expect(TestBed.inject(Router).url).toBe('/ofertas/nova');
    esperarValoresMantidos(raiz);
  });

  it('com o formulário alterado, sair por um link pergunta; confirmando, nada é enviado e vai para /inicio', async () => {
    const confirmar = responder(true);
    const { harness, raiz } = await abrirFormulario();
    preencherPelaMetade(harness, raiz);

    await sairPorLink(harness);

    expect(confirmar).toHaveBeenCalledTimes(1);
    expect(confirmar).toHaveBeenCalledWith(PERGUNTA);
    expect(criar).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/inicio');
  });

  it('com o formulário alterado, sair por um link e recusar mantém a tela com o que foi preenchido', async () => {
    const confirmar = responder(false);
    const { harness, raiz } = await abrirFormulario();
    preencherPelaMetade(harness, raiz);

    await sairPorLink(harness);

    expect(confirmar).toHaveBeenCalledWith(PERGUNTA);
    expect(TestBed.inject(Router).url).toBe('/ofertas/nova');
    esperarValoresMantidos(raiz);
  });

  it('com o formulário intocado (só passando pelos campos, sem alterar), sair por um link não pergunta', async () => {
    const confirmar = responder(false);
    const { harness, raiz } = await abrirFormulario();
    sair(harness, campoPorRotulo(raiz, 'Bairro'));
    sair(harness, campoPorRotulo(raiz, 'Horário'));

    await sairPorLink(harness);

    expect(confirmar).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/inicio');
  });

  it('depois de publicar, a ida para os detalhes da oferta não pergunta', async () => {
    const confirmar = responder(false);
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);

    botaoPublicar(raiz).click();
    await harness.fixture.whenStable();

    expect(confirmar).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/ofertas/42?publicada=1');
  });

  it('depois de uma falha de rede, com o formulário preenchido, sair por um link ainda pergunta', async () => {
    const confirmar = responder(false);
    const { harness, raiz } = await abrirFormulario();
    preencherTudoMenos(harness, raiz);
    criar.mockReturnValueOnce(throwError(() => new FalhaDeRedeError()));
    botaoPublicar(raiz).click();
    harness.detectChanges();

    await sairPorLink(harness);

    expect(confirmar).toHaveBeenCalledWith(PERGUNTA);
    expect(TestBed.inject(Router).url).toBe('/ofertas/nova');
  });
});
