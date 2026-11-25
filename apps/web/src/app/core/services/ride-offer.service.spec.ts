import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api.config';
import { NovaRideOffer, RideOffer, RideOfferDetalhada } from '../models/ride-offer';
import { AuthService } from './auth.service';
import { RideOfferService } from './ride-offer.service';

const OFERTA: RideOfferDetalhada = {
  id: '7',
  driverId: 'fulano@alunos.utfpr.edu.br',
  direction: 'outbound',
  neighborhoodId: '1',
  pickupPointId: '2',
  departureTime: '2026-12-01T10:30:00.000Z',
  totalSeats: 3,
  availableSeats: 3,
  status: 'available',
  notes: 'Espero 5 minutos',
  createdAt: '2026-11-24T12:00:00.000Z',
  neighborhood: { id: '1', name: 'Centro' },
  pickupPoint: { id: '2', neighborhoodId: '1', label: 'Igreja matriz', order: 2 },
};

describe('RideOfferService.buscarPorId', () => {
  let service: RideOfferService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RideOfferService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('CA2: busca a oferta já com o bairro e o ponto em GET /rideOffers/:id?_expand=neighborhood&_expand=pickupPoint', async () => {
    const resultado = firstValueFrom(service.buscarPorId('7'));

    const req = http.expectOne((r) => r.url === `${API_URL}/rideOffers/7`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.getAll('_expand')).toEqual(['neighborhood', 'pickupPoint']);
    req.flush(OFERTA);

    expect(await resultado).toEqual(OFERTA);
  });

  it('CA14: oferta inexistente (404) vira null', async () => {
    const resultado = firstValueFrom(service.buscarPorId('999'));

    http
      .expectOne((r) => r.url === `${API_URL}/rideOffers/999`)
      .flush({}, { status: 404, statusText: 'Not Found' });

    expect(await resultado).toBeNull();
  });

  it('CA14: erro que não é 404 (500) não vira null e propaga como está', async () => {
    const resultado = firstValueFrom(service.buscarPorId('7'));

    http
      .expectOne((r) => r.url === `${API_URL}/rideOffers/7`)
      .flush({}, { status: 500, statusText: 'Server Error' });

    await expect(resultado).rejects.toMatchObject({ status: 500 });
  });
});

describe('RideOfferService.criar', () => {
  // Relógio parado: o createdAt é o instante da publicação.
  const agora = new Date('2026-11-24T15:45:10.123Z');

  const NOVA: NovaRideOffer = {
    direction: 'return',
    neighborhoodId: '2',
    pickupPointId: '5',
    departureTime: '2026-12-01T21:00:00.000Z',
    totalSeats: 3,
    notes: 'Espero 5 minutos',
  };

  let service: RideOfferService;
  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(agora);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: { sessao: signal({ email: 'motorista@alunos.utfpr.edu.br' }) },
        },
      ],
    });
    service = TestBed.inject(RideOfferService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('CA1/CA2: faz POST /rideOffers com o motorista da sessão, "Disponível", vagas disponíveis = vagas, as observações e createdAt', async () => {
    const resultado = firstValueFrom(service.criar(NOVA));

    const req = http.expectOne(`${API_URL}/rideOffers`);
    expect(req.request.method).toBe('POST');
    // Sem id: quem dá o id é o json-server.
    expect(req.request.body).toStrictEqual({
      driverId: 'motorista@alunos.utfpr.edu.br',
      direction: 'return',
      neighborhoodId: '2',
      pickupPointId: '5',
      departureTime: '2026-12-01T21:00:00.000Z',
      totalSeats: 3,
      availableSeats: 3,
      status: 'available',
      notes: 'Espero 5 minutos',
      createdAt: '2026-11-24T15:45:10.123Z',
    });

    const criada: RideOffer = { id: '42', ...req.request.body };
    req.flush(criada);

    expect(await resultado).toEqual(criada);
  });
});
