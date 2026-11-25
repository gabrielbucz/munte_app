import { KeyValuePipe } from '@angular/common';
import { Component, ErrorHandler, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MENSAGEM_DE_DESCARTE, PodeSair } from '../../../core/guards/confirmar-descarte.guard';
import { NovaRideOffer, RideDirection } from '../../../core/models/ride-offer';
import { FalhaDeRedeError } from '../../../core/services/auth.service';
import { NeighborhoodService } from '../../../core/services/neighborhood.service';
import { RideOfferService } from '../../../core/services/ride-offer.service';
import { horarioFuturo } from './horario-futuro.validator';

@Component({
  selector: 'app-ride-offer-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './ride-offer-form.html',
})
export class RideOfferForm implements PodeSair {
  private readonly rideOfferService = inject(RideOfferService);
  private readonly router = inject(Router);
  private readonly errorHandler = inject(ErrorHandler);

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

  // O servidor não respondeu ao publicar (CA11): o formulário fica como estava, com o aviso.
  protected readonly falhaDeRede = signal(false);

  // Envio em andamento (CA12): o botão desliga e um segundo envio não chega ao service.
  protected readonly enviando = signal(false);

  protected readonly rotuloDoBotao = computed(() => {
    if (this.enviando()) return 'Publicando…';
    return this.falhaDeRede() ? 'Tentar novamente' : 'Publicar';
  });

  // Ligado depois de publicar ou de um descarte já confirmado no "Cancelar" (CA6):
  // a saída que vem a seguir não pergunta de novo.
  private readonly saidaLiberada = signal(false);

  constructor() {
    this.form.controls.neighborhoodId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.pickupPointId.reset(''));
  }

  // Chamado pelo confirmarDescarteGuard (CA6): com o formulário intocado, sair não pergunta.
  podeSair(): boolean {
    return this.form.pristine || this.saidaLiberada();
  }

  // "Cancelar" (CA6): pergunta só se há o que perder; recusando, fica tudo como estava.
  protected cancelar(): void {
    if (!this.podeSair() && !window.confirm(MENSAGEM_DE_DESCARTE)) return;

    this.saidaLiberada.set(true);
    void this.router.navigate(['/inicio']);
  }

  // O botão desligado não basta: o submit do formulário (ex.: Enter) chega aqui sem passar por ele.
  protected publicar(): void {
    if (this.form.invalid || this.enviando()) return;

    // Daqui em diante o formulário é válido (CA9): o sentido e as vagas já estão preenchidos.
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

    this.falhaDeRede.set(false);
    this.enviando.set(true);
    this.rideOfferService.criar(nova).subscribe({
      // No sucesso, `enviando` fica ligado: a oferta já existe e a tela está de saída para os detalhes.
      next: (oferta) => {
        this.saidaLiberada.set(true);
        void this.router.navigate(['/ofertas', oferta.id], { queryParams: { publicada: 1 } });
      },
      error: (erro: unknown) => {
        this.enviando.set(false);
        if (erro instanceof FalhaDeRedeError) {
          this.falhaDeRede.set(true);
          return;
        }
        this.errorHandler.handleError(erro);
      },
    });
  }
}
