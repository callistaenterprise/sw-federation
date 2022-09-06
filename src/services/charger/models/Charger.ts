export interface ICharger {
  id: string;
  serialNumber: string;
  vendor: string;
  productName: string;
  color: string;
  status: string;
  driverId: string;
  carId: string;
}

export class Charger implements ICharger {
  color: string;
  id: string;
  productName: string;
  serialNumber: string;
  status: string;
  driverId: string;
  carId: string;
  vendor: string;
}
