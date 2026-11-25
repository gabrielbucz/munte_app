import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { PONTO_NA_FACULDADE } from '../../../core/config/api.config';
import { RideOfferDetalhada } from '../../../core/models/ride-offer';
import { RideOfferService } from '../../../core/services/ride-offer.service';

// Horário montado em hora local para o texto formatado não depender do fuso da máquina.
const SAIDA = new Date(2026, 11, 1, 7, 30);

function oferta(mudancas: Partial<RideOfferDetalhada> = {}): RideOfferDetalhada {
  return {
    id: '7',
    driverId: 'fulano@alunos.utfpr.edu.br',
    direction: 'outbound',
    neighborhoodId: '1',
    pickupPointId: '2',
    departureTime: SAIDA.toISOString(),
    totalSeats: 3,
    availableSeats: 3,
    status: 'available',
    notes: 'Espero 5 minutos',
    createdAt: '2026-11-24T12:00:00.000Z',
    neighborhood: { id: '1', name: 'Centro' },
    pickupPoint: { id: '2', neighborhoodId: '1', label: 'Igreja matriz', order: 2 },
    ...mudancas,
  };
}

let buscarPorId: ReturnType<typeof vi.fn>;

async function abrir(url: string): Promise<HTMLElement> {
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  await harness.fixture.whenStable();
  harness.detectChanges();
  return harness.routeNativeElement as HTMLElement;
}

// Valor do <dd> que acompanha o <dt> com o rótulo dado.
function valorDe(raiz: HTMLElement, rotulo: string): string | undefined {
  const termo = Array.from(raiz.querySelectorAll('dt')).find(
    (dt) => dt.textContent?.trim() === rotulo,
  );
  return termo?.nextElementSibling?.textContent?.replace(/\s+/g, ' ').trim();
}

describe('RideOfferDetail (tela da oferta)', () => {
  beforeEach(() => {
    buscarPorId = vi.fn(() => of(oferta()));
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: RideOfferService, useValue: { buscarPorId } },
      ],
    });
  });

  it('CA2: /ofertas/<id> busca a oferta do endereço e mostra sentido, bairro, ponto, horário, vagas e observações', async () => {
    const raiz = await abrir('/ofertas/7');

    expect(buscarPorId).toHaveBeenCalledWith('7');
    expect(TestBed.inject(Router).url).toBe('/ofertas/7');
    expect(valorDe(raiz, 'Sentido')).toBe('Ida');
    expect(valorDe(raiz, 'Bairro')).toBe('Centro');
    expect(valorDe(raiz, 'Ponto')).toBe('Igreja matriz');
    expect(valorDe(raiz, 'Trajeto')).toBe(`Igreja matriz → ${PONTO_NA_FACULDADE}`);
    expect(valorDe(raiz, 'Horário')).toBe('01/12 às 07:30');
    expect(valorDe(raiz, 'Vagas')).toBe('3');
    expect(valorDe(raiz, 'Observações')).toBe('Espero 5 minutos');
  });

  it('CA2: oferta de volta mostra "Volta" e o trajeto saindo da faculdade', async () => {
    buscarPorId.mockReturnValue(of(oferta({ direction: 'return' })));

    const raiz = await abrir('/ofertas/7');

    expect(valorDe(raiz, 'Sentido')).toBe('Volta');
    expect(valorDe(raiz, 'Trajeto')).toBe(`${PONTO_NA_FACULDADE} → Igreja matriz`);
  });

  it('CA2: sem observações, a linha "Observações" não aparece', async () => {
    buscarPorId.mockReturnValue(of(oferta({ notes: '' })));

    const raiz = await abrir('/ofertas/7');

    expect(valorDe(raiz, 'Sentido')).toBe('Ida');
    expect(valorDe(raiz, 'Observações')).toBeUndefined();
  });

  it('CA1: com ?publicada=1, mostra o aviso "Oferta publicada."', async () => {
    const raiz = await abrir('/ofertas/7?publicada=1');

    expect(raiz.querySelector('[role="status"]')?.textContent?.trim()).toBe('Oferta publicada.');
  });

  it('CA1: sem ?publicada, o aviso "Oferta publicada." não aparece', async () => {
    const raiz = await abrir('/ofertas/7');

    expect(valorDe(raiz, 'Sentido')).toBe('Ida');
    expect(raiz.textContent).not.toContain('Oferta publicada.');
  });

  it('CA14: id desconhecido mostra "Oferta não encontrada." com link para a tela Início', async () => {
    buscarPorId.mockReturnValue(of(null));

    const raiz = await abrir('/ofertas/999');

    expect(buscarPorId).toHaveBeenCalledWith('999');
    expect(raiz.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Oferta não encontrada.',
    );
    const link = Array.from(raiz.querySelectorAll('a')).find(
      (a) => a.getAttribute('href') === '/inicio',
    );
    expect(link, 'link para /inicio').toBeTruthy();
    expect(raiz.querySelector('dl')).toBeNull();
  });
});
