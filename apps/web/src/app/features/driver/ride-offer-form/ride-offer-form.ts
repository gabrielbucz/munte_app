import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NeighborhoodService } from '../../../core/services/neighborhood.service';

@Component({
  selector: 'app-ride-offer-form',
  imports: [ReactiveFormsModule],
  templateUrl: './ride-offer-form.html',
})
export class RideOfferForm {
  // TODO #35: bairros e pontos de exemplo do json-server, e não os 23 bairros reais da RN02.
  protected readonly neighborhoods = toSignal(inject(NeighborhoodService).listar(), {
    initialValue: [],
  });

  protected readonly form = new FormGroup({
    direction: new FormControl<'outbound' | 'return' | ''>('', { nonNullable: true }),
    neighborhoodId: new FormControl('', { nonNullable: true }),
    pickupPointId: new FormControl('', { nonNullable: true }),
    departureTime: new FormControl('', { nonNullable: true }),
    seats: new FormControl<number | null>(null),
    notes: new FormControl('', { nonNullable: true }),
  });
}
