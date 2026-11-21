import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { API_URL } from '../config/api.config';

const DOMINIO_PERMITIDO = '@alunos.utfpr.edu.br';
const VALIDADE_DO_LINK_MS = 60 * 60 * 1000;

export interface MagicLink {
  id?: string;
  email: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
}

export class EmailNaoPermitidoError extends Error {
  constructor() {
    super('e-mail não permitido');
    this.name = 'EmailNaoPermitidoError';
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

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

    return this.http
      .post<MagicLink>(`${API_URL}/magicLinks`, magicLink)
      .pipe(map(() => `/auth/callback?token=${magicLink.token}`));
  }

  private dominioPermitido(email: string): boolean {
    const arroba = email.lastIndexOf('@');
    return arroba > 0 && email.slice(arroba) === DOMINIO_PERMITIDO;
  }
}
