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

// A oferta como volta do _expand do json-server: o bairro vem sem a lista de pontos.
export interface RideOfferDetalhada extends RideOffer {
  neighborhood: Omit<Neighborhood, 'pickupPoints'>;
  pickupPoint: PickupPoint;
}
