import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { PONTO_NA_FACULDADE } from '../../../core/config/api.config';
import { RideOfferService } from '../../../core/services/ride-offer.service';

@Component({
  selector: 'app-ride-offer-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './ride-offer-detail.html',
})
export class RideOfferDetail {
  private readonly rideOfferService = inject(RideOfferService);

  // Parâmetro :id da rota e ?publicada da URL, via withComponentInputBinding().
  readonly id = input.required<string>();
  readonly publicada = input<string>();

  // undefined: ainda buscando; null: a oferta não existe (CA14).
  protected readonly oferta = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.rideOfferService.buscarPorId(id))),
  );

  protected readonly pontoNaFaculdade = PONTO_NA_FACULDADE;
}
