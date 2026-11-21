import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api.config';
import { AuthService, EmailNaoPermitidoError } from './auth.service';

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
});
