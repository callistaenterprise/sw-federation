export interface IDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  age: number;
  nationalSecurity: string;
}

export class Driver implements IDriver {
  address: string;
  age: number;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  nationalSecurity: string;
}
