import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api.config';
import { AuthService, EmailNaoPermitidoError, FalhaDeRedeError } from './auth.service';

describe('AuthService.solicitarLink', () => {
  const agora = new Date('2026-11-20T12:00:00.000Z');
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(agora);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('CA1: grava o link em POST /magicLinks com e-mail, token e validade de 1 hora e devolve o link do callback', async () => {
    const link = firstValueFrom(service.solicitarLink('fulano@alunos.utfpr.edu.br'));

    const req = http.expectOne(`${API_URL}/magicLinks`);
    expect(req.request.method).toBe('POST');
    const corpo = req.request.body as { email: string; token: string; expiresAt: string };
    expect(corpo.email).toBe('fulano@alunos.utfpr.edu.br');
    expect(typeof corpo.token).toBe('string');
    expect(corpo.token.length).toBeGreaterThan(0);
    expect(corpo.expiresAt).toBe('2026-11-20T13:00:00.000Z');
    req.flush({ id: '1', ...corpo });

    expect(await link).toBe(`/auth/callback?token=${corpo.token}`);
  });

  it('CA1: normaliza o e-mail (espaços e maiúsculas) antes de gravar', async () => {
    const link = firstValueFrom(service.solicitarLink('  Fulano@Alunos.UTFPR.edu.br '));

    const req = http.expectOne(`${API_URL}/magicLinks`);
    expect((req.request.body as { email: string }).email).toBe('fulano@alunos.utfpr.edu.br');
    req.flush({ id: '1', ...(req.request.body as object) });

    await link;
  });

  it.each(['fulano@utfpr.edu.br', 'fulano@gmail.com', 'fulano@alunos.utfpr.edu.br.x.com'])(
    'CA3: rejeita %s sem fazer requisição',
    async (email) => {
      await expect(firstValueFrom(service.solicitarLink(email))).rejects.toBeInstanceOf(
        EmailNaoPermitidoError,
      );

      http.expectNone(() => true);
    },
  );

  it('CA6: falha de rede no POST /magicLinks vira FalhaDeRedeError', async () => {
    const link = firstValueFrom(service.solicitarLink('fulano@alunos.utfpr.edu.br'));

    http.expectOne(`${API_URL}/magicLinks`).error(new ProgressEvent('error'));

    await expect(link).rejects.toBeInstanceOf(FalhaDeRedeError);
  });

  it('CA6: resposta de erro do servidor (500) não vira FalhaDeRedeError e propaga como está', async () => {
    const link = firstValueFrom(service.solicitarLink('fulano@alunos.utfpr.edu.br'));

    http
      .expectOne(`${API_URL}/magicLinks`)
      .flush(null, { status: 500, statusText: 'Internal Server Error' });

    const erro: unknown = await link.catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(HttpErrorResponse);
    expect(erro).not.toBeInstanceOf(FalhaDeRedeError);
    expect((erro as HttpErrorResponse).status).toBe(500);
  });
});

describe('AuthService.confirmarLink', () => {
  const agora = new Date('2026-11-20T12:00:00.000Z');
  const linkValido = {
    id: '1',
    email: 'fulano@alunos.utfpr.edu.br',
    token: 'token-valido',
    expiresAt: '2026-11-20T12:30:00.000Z',
    usedAt: null,
  };
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(agora);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('CA2: link existente, não usado e dentro do prazo faz PATCH usedAt, grava a sessão e retorna "valido"', async () => {
    const resultado = firstValueFrom(service.confirmarLink('token-valido'));

    const busca = http.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === `${API_URL}/magicLinks` &&
        req.params.get('token') === 'token-valido',
    );
    busca.flush([linkValido]);

    const marcacao = http.expectOne(`${API_URL}/magicLinks/1`);
    expect(marcacao.request.method).toBe('PATCH');
    expect(marcacao.request.body).toEqual({ usedAt: '2026-11-20T12:00:00.000Z' });
    expect(service.sessao()).toBeNull();
    marcacao.flush({ ...linkValido, usedAt: '2026-11-20T12:00:00.000Z' });

    expect(await resultado).toBe('valido');
    expect(service.sessao()).toEqual({ email: 'fulano@alunos.utfpr.edu.br' });
    expect(JSON.parse(localStorage.getItem('munte.sessao') ?? 'null')).toEqual({
      email: 'fulano@alunos.utfpr.edu.br',
    });
  });

  it('CA2: a sessão gravada no localStorage é lida quando o app abre de novo', () => {
    localStorage.setItem('munte.sessao', JSON.stringify({ email: 'fulano@alunos.utfpr.edu.br' }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const serviceNovo = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);

    expect(serviceNovo.sessao()).toEqual({ email: 'fulano@alunos.utfpr.edu.br' });
  });
});

describe('AuthService.autenticado', () => {
  function criarService(): AuthService {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    return TestBed.inject(AuthService);
  }

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('CA3: sem sessão, autenticado() é falso', () => {
    const service = criarService();

    expect(service.autenticado()).toBe(false);
  });

  it('CA2: com sessão, autenticado() é verdadeiro', () => {
    localStorage.setItem('munte.sessao', JSON.stringify({ email: 'fulano@alunos.utfpr.edu.br' }));

    const service = criarService();

    expect(service.autenticado()).toBe(true);
  });
});
