import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { API_URL } from '../config/api.config';
import { RideOfferDetalhada } from '../models/ride-offer';

@Injectable({ providedIn: 'root' })
export class RideOfferService {
  private readonly http = inject(HttpClient);

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
