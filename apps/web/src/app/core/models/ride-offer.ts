import { Neighborhood, PickupPoint } from './neighborhood';

export type RideDirection = 'outbound' | 'return';

export type RideOfferStatus = 'draft' | 'available' | 'full' | 'cancelled' | 'completed';

// Sem vehicleId: o veículo da oferta só entra com a US14.
export interface RideOffer {
  id: string;
  driverId: string;
  direction: RideDirection;
  neighborhoodId: string;
  pickupPointId: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  status: RideOfferStatus;
  notes: string;
  createdAt: string;
}

// O que o formulário entrega para publicar: o RideOfferService completa motorista, status,
// vagas disponíveis e createdAt. departureTime já vem em ISO.
export type NovaRideOffer = Pick<
  RideOffer,
  'direction' | 'neighborhoodId' | 'pickupPointId' | 'departureTime' | 'totalSeats' | 'notes'
>;

// A oferta como volta do _expand do json-server: o bairro vem sem a lista de pontos.
export interface RideOfferDetalhada extends RideOffer {
  neighborhood: Omit<Neighborhood, 'pickupPoints'>;
  pickupPoint: PickupPoint;
}
