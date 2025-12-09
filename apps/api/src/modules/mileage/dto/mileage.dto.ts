export class CreateMileageDto {
  date: string;
  vehicleId?: string;
  licensePlate?: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  purpose: string;
  projectId?: string;
  tourId?: string;
}

export class UpdateMileageDto {
  date?: string;
  vehicleId?: string;
  licensePlate?: string;
  startLocation?: string;
  endLocation?: string;
  distanceKm?: number;
  purpose?: string;
  projectId?: string;
  tourId?: string;
  status?: 'draft' | 'submitted' | 'approved';
}
