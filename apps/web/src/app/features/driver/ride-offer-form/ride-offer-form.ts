import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NeighborhoodService } from '../../../core/services/neighborhood.service';

@Component({
  selector: 'app-ride-offer-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './ride-offer-form.html',
})
export class RideOfferForm {
  // TODO #35: bairros e pontos de exemplo do json-server, e não os 23 bairros reais da RN02.
  protected readonly neighborhoods = toSignal(inject(NeighborhoodService).listar(), {
    initialValue: [],
  });

  // TODO #3: provisório — lista os pontos de todos os bairros; a Tarefa 3 filtra pelo bairro escolhido (CA10).
  protected readonly pickupPoints = computed(() =>
    this.neighborhoods().flatMap((neighborhood) => neighborhood.pickupPoints),
  );

  protected readonly form = new FormGroup({
    direction: new FormControl<'outbound' | 'return' | ''>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    neighborhoodId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    pickupPointId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    departureTime: new FormControl('', { nonNullable: true, validators: Validators.required }),
    seats: new FormControl<number | null>(null, Validators.required),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly mensagensDeErro: Record<string, string> = {
    required: 'preenchimento obrigatório',
  };
}
