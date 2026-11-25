import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { API_URL } from '../config/api.config';
import { NovaRideOffer, RideOffer, RideOfferDetalhada } from '../models/ride-offer';
import { AuthService, FalhaDeRedeError } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RideOfferService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // A oferta nasce "Disponível", com todas as vagas livres, no nome do motorista da sessão.
  // O id vem do json-server na resposta. Sem resposta do servidor (status 0), o erro vira
  // FalhaDeRedeError (CA11), para o componente não conhecer HTTP; os demais propagam como estão.
  criar(nova: NovaRideOffer): Observable<RideOffer> {
    const oferta: Omit<RideOffer, 'id'> = {
      // TODO #25: o motorista é o e-mail da sessão simulada, e não um usuário do Supabase Auth.
      // A rota do formulário tem o authGuard: sem sessão não se chega aqui.
      driverId: this.authService.sessao()!.email,
      ...nova,
      availableSeats: nova.totalSeats,
      status: 'available',
      createdAt: new Date().toISOString(),
    };
    return this.http
      .post<RideOffer>(`${API_URL}/rideOffers`, oferta)
      .pipe(
        catchError((erro: unknown) =>
          throwError(() =>
            erro instanceof HttpErrorResponse && erro.status === 0 ? new FalhaDeRedeError() : erro,
          ),
        ),
      );
  }

  // A oferta já com o bairro e o ponto (o _expand do json-server 0.17 junta pelo
  // neighborhoodId e pelo pickupPointId). Oferta inexistente (404) vira null.
  buscarPorId(id: string): Observable<RideOfferDetalhada | null> {
    return this.http
      .get<RideOfferDetalhada>(`${API_URL}/rideOffers/${encodeURIComponent(id)}`, {
        params: { _expand: ['neighborhood', 'pickupPoint'] },
      })
      .pipe(
        catchError((erro: unknown) =>
          erro instanceof HttpErrorResponse && erro.status === 404
            ? of(null)
            : throwError(() => erro),
        ),
      );
  }
}
