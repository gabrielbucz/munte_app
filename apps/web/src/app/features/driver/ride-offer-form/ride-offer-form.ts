import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NovaRideOffer, RideDirection } from '../../../core/models/ride-offer';
import { NeighborhoodService } from '../../../core/services/neighborhood.service';
import { RideOfferService } from '../../../core/services/ride-offer.service';
import { horarioFuturo } from './horario-futuro.validator';

@Component({
  selector: 'app-ride-offer-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './ride-offer-form.html',
})
export class RideOfferForm {
  private readonly rideOfferService = inject(RideOfferService);
  private readonly router = inject(Router);

  // TODO #35: bairros e pontos de exemplo do json-server, e não os 23 bairros reais da RN02.
  protected readonly neighborhoods = toSignal(inject(NeighborhoodService).listar(), {
    initialValue: [],
  });

  protected readonly form = new FormGroup({
    direction: new FormControl<RideDirection | ''>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    neighborhoodId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    pickupPointId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    departureTime: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, horarioFuturo],
    }),
    seats: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(4),
    ]),
    notes: new FormControl('', { nonNullable: true, validators: Validators.maxLength(200) }),
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
    horarioFuturo: 'precisa ser no futuro',
    maxlength: 'máximo 200 caracteres',
  };

  constructor() {
    this.form.controls.neighborhoodId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.pickupPointId.reset(''));
  }

  // "Publicar" só liga com o formulário válido (CA9): aqui o sentido e as vagas já estão preenchidos.
  protected publicar(): void {
    const { direction, neighborhoodId, pickupPointId, departureTime, seats, notes } =
      this.form.getRawValue();
    const nova: NovaRideOffer = {
      direction: direction as RideDirection,
      neighborhoodId,
      pickupPointId,
      // O datetime-local entrega "AAAA-MM-DDTHH:mm" em hora local; new Date lê assim e o ISO sai em UTC.
      departureTime: new Date(departureTime).toISOString(),
      totalSeats: seats as number,
      notes,
    };

    this.rideOfferService.criar(nova).subscribe((oferta) => {
      void this.router.navigate(['/ofertas', oferta.id], { queryParams: { publicada: 1 } });
    });
  }
}
