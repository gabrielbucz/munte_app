import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { Neighborhood } from '../../../core/models/neighborhood';
import { AuthService } from '../../../core/services/auth.service';
import { NeighborhoodService } from '../../../core/services/neighborhood.service';
import { RideOfferForm } from './ride-offer-form';

const BAIRROS: Neighborhood[] = [
  {
    id: '1',
    name: 'Centro',
    pickupPoints: [
      { id: '1', neighborhoodId: '1', label: 'Praça central', order: 1 },
      { id: '2', neighborhoodId: '1', label: 'Igreja matriz', order: 2 },
      { id: '3', neighborhoodId: '1', label: 'Terminal central', order: 3 },
    ],
  },
  {
    id: '2',
    name: 'Vila Nova',
    pickupPoints: [
      { id: '4', neighborhoodId: '2', label: 'Escola estadual', order: 1 },
      { id: '5', neighborhoodId: '2', label: 'Posto de saúde', order: 2 },
      { id: '6', neighborhoodId: '2', label: 'Mercado do bairro', order: 3 },
    ],
  },
];

function configurar(comSessao: boolean): void {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(routes, withComponentInputBinding()),
      {
        provide: AuthService,
        useValue: {
          sessao: signal(comSessao ? { email: 'fulano@alunos.utfpr.edu.br' } : null),
          autenticado: signal(comSessao),
        },
      },
      { provide: NeighborhoodService, useValue: { listar: () => of(BAIRROS) } },
    ],
  });
}

function campoPorRotulo<T extends HTMLElement>(raiz: HTMLElement, rotulo: string): T {
  const label = Array.from(raiz.querySelectorAll('label')).find(
    (l) => l.textContent?.trim() === rotulo,
  );
  expect(label, `rótulo "${rotulo}"`).toBeTruthy();
  const campo = raiz.querySelector<T>(`#${label!.htmlFor}`);
  expect(campo, `campo do rótulo "${rotulo}"`).toBeTruthy();
  return campo!;
}

describe('RideOfferForm (formulário de nova oferta)', () => {
  it('CA13: sem sessão, abrir /ofertas/nova leva à tela Entrar', async () => {
    configurar(false);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/ofertas/nova');

    expect(TestBed.inject(Router).url).toBe('/entrar');
  });

  it('CA13/CA15: com sessão, /ofertas/nova mostra os campos sentido, bairro, ponto, horário, vagas e observações', async () => {
    configurar(true);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/ofertas/nova', RideOfferForm);
    harness.detectChanges();
    const raiz = harness.routeNativeElement as HTMLElement;

    expect(TestBed.inject(Router).url).toBe('/ofertas/nova');

    const sentido = Array.from(raiz.querySelectorAll('fieldset')).find(
      (f) => f.querySelector('legend')?.textContent?.trim() === 'Sentido',
    );
    expect(sentido).toBeTruthy();
    const opcoesDeSentido = Array.from(
      sentido!.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ).map((radio) => radio.closest('label')?.textContent?.trim());
    expect(opcoesDeSentido).toEqual(['Ida', 'Volta']);

    const bairro = campoPorRotulo<HTMLSelectElement>(raiz, 'Bairro');
    expect(bairro.tagName).toBe('SELECT');
    const nomesDosBairros = Array.from(bairro.options).map((o) => o.textContent?.trim());
    expect(nomesDosBairros).toEqual(expect.arrayContaining(['Centro', 'Vila Nova']));

    expect(campoPorRotulo(raiz, 'Ponto').tagName).toBe('SELECT');
    expect(campoPorRotulo<HTMLInputElement>(raiz, 'Horário').type).toBe('datetime-local');
    expect(campoPorRotulo<HTMLInputElement>(raiz, 'Vagas').type).toBe('number');
    expect(campoPorRotulo(raiz, 'Observações').tagName).toBe('TEXTAREA');
  });
});
