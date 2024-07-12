import { Customer } from "./customer";

export class Reservation {
  id!: number;
  checkInDate!: Date;
  checkOutDate!: Date;
  tourOperatorName!: string;
  reservationName!: string;
  status!: string;
  contactPhone!: string;
}
