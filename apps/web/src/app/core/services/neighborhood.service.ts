import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Neighborhood } from '../models/neighborhood';

@Injectable({ providedIn: 'root' })
export class NeighborhoodService {
  private readonly http = inject(HttpClient);

  // Bairros já com os seus pontos (o _embed do json-server 0.17 junta pelo neighborhoodId).
  listar(): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(`${API_URL}/neighborhoods`, {
      params: { _embed: 'pickupPoints' },
    });
  }
}
