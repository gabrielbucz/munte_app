import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { API_URL } from '../config/api.config';

const DOMINIO_PERMITIDO = '@alunos.utfpr.edu.br';
const VALIDADE_DO_LINK_MS = 60 * 60 * 1000;
const CHAVE_DA_SESSAO = 'munte.sessao';

export interface MagicLink {
  id?: string;
  email: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
}

export interface Sessao {
  email: string;
}

export type ResultadoDaConfirmacao = 'valido' | 'invalido' | 'expirado';

export class EmailNaoPermitidoError extends Error {
  constructor() {
    super('e-mail não permitido');
    this.name = 'EmailNaoPermitidoError';
  }
}

export class FalhaDeRedeError extends Error {
  constructor() {
    super('falha de rede');
    this.name = 'FalhaDeRedeError';
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // TODO #25: a sessão fica no localStorage; na Entrega 3 passa a vir do Supabase Auth.
  private readonly sessaoAtual = signal<Sessao | null>(this.lerSessao());
  readonly sessao = this.sessaoAtual.asReadonly();
  readonly autenticado = computed(() => this.sessao() !== null);

  // TODO #25: envio simulado — o link volta para a tela em vez de ir por e-mail, e fica
  // guardado na coleção magicLinks do json-server, e não no Supabase Auth.
  solicitarLink(email: string): Observable<string> {
    const emailNormalizado = email.trim().toLowerCase();
    if (!this.dominioPermitido(emailNormalizado)) {
      return throwError(() => new EmailNaoPermitidoError());
    }

    const magicLink: MagicLink = {
      email: emailNormalizado,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + VALIDADE_DO_LINK_MS).toISOString(),
      usedAt: null,
    };

    return this.http.post<MagicLink>(`${API_URL}/magicLinks`, magicLink).pipe(
      map(() => `/auth/callback?token=${magicLink.token}`),
      catchError((erro: unknown) =>
        throwError(() => (this.falhaDeRede(erro) ? new FalhaDeRedeError() : erro)),
      ),
    );
  }

  // TODO #25: o link é conferido e marcado como usado na coleção magicLinks do json-server,
  // e não no Supabase Auth.
  confirmarLink(token: string): Observable<ResultadoDaConfirmacao> {
    return this.http.get<MagicLink[]>(`${API_URL}/magicLinks`, { params: { token } }).pipe(
      switchMap(([magicLink]) =>
        this.http
          .patch<MagicLink>(`${API_URL}/magicLinks/${magicLink.id}`, {
            usedAt: new Date().toISOString(),
          })
          .pipe(
            map((): ResultadoDaConfirmacao => {
              this.gravarSessao({ email: magicLink.email });
              return 'valido';
            }),
          ),
      ),
    );
  }

  private gravarSessao(sessao: Sessao): void {
    localStorage.setItem(CHAVE_DA_SESSAO, JSON.stringify(sessao));
    this.sessaoAtual.set(sessao);
  }

  private lerSessao(): Sessao | null {
    const gravada = localStorage.getItem(CHAVE_DA_SESSAO);
    return gravada ? (JSON.parse(gravada) as Sessao) : null;
  }

  // Status 0: a requisição não chegou a ter resposta (rede fora ou json-server fora do ar).
  private falhaDeRede(erro: unknown): boolean {
    return erro instanceof HttpErrorResponse && erro.status === 0;
  }

  private dominioPermitido(email: string): boolean {
    const arroba = email.lastIndexOf('@');
    return arroba > 0 && email.slice(arroba) === DOMINIO_PERMITIDO;
  }
}
