export interface ICar {
  id: string;
  chargerId: string;
  driverIds: string[];
  registrationNumber: string;
  name: string;
  vin: string;
  model: string;
  modelYear: string;
  batterySize: number;
}

export class Car implements ICar {
  batterySize: number;
  chargerId: string;
  driverIds: string[];
  id: string;
  model: string;
  modelYear: string;
  name: string;
  registrationNumber: string;
  vin: string;
}
