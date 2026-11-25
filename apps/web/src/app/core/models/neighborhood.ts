export interface PickupPoint {
  id: string;
  neighborhoodId: string;
  label: string;
  order: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  pickupPoints: PickupPoint[];
}
