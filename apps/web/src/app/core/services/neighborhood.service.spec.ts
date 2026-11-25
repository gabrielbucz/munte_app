import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Neighborhood } from '../models/neighborhood';
import { NeighborhoodService } from './neighborhood.service';

describe('NeighborhoodService.listar', () => {
  let service: NeighborhoodService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NeighborhoodService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('CA15: busca os bairros já com os seus pontos em GET /neighborhoods?_embed=pickupPoints', async () => {
    const bairros: Neighborhood[] = [
      {
        id: '1',
        name: 'Centro',
        pickupPoints: [
          { id: '1', neighborhoodId: '1', label: 'Praça central', order: 1 },
          { id: '2', neighborhoodId: '1', label: 'Igreja matriz', order: 2 },
          { id: '3', neighborhoodId: '1', label: 'Terminal central', order: 3 },
        ],
      },
    ];

    const resultado = firstValueFrom(service.listar());

    const req = http.expectOne(
      (r) => r.url === `${API_URL}/neighborhoods` && r.params.get('_embed') === 'pickupPoints',
    );
    expect(req.request.method).toBe('GET');
    req.flush(bairros);

    expect(await resultado).toEqual(bairros);
  });
});
