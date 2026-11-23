import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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

  protected readonly form = new FormGroup({
    direction: new FormControl<'outbound' | 'return' | ''>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    neighborhoodId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    pickupPointId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    departureTime: new FormControl('', { nonNullable: true, validators: Validators.required }),
    seats: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(4),
    ]),
    notes: new FormControl('', { nonNullable: true }),
  });

  private readonly selectedNeighborhoodId = toSignal(
    this.form.controls.neighborhoodId.valueChanges,
    { initialValue: this.form.controls.neighborhoodId.value },
  );

  protected readonly pickupPoints = computed(
    () =>
      this.neighborhoods().find((neighborhood) => neighborhood.id === this.selectedNeighborhoodId())
        ?.pickupPoints ?? [],
  );

  protected readonly mensagensDeErro: Record<string, string> = {
    required: 'preenchimento obrigatório',
    min: 'mínimo 1 vaga',
    max: 'máximo 4 vagas',
  };

  constructor() {
    this.form.controls.neighborhoodId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.pickupPointId.reset(''));
  }
}
