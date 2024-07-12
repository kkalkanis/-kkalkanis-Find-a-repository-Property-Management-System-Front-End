import { Customer } from "./customer";

export class CheckInSingleCustomerRequest {
  id!: number;
  reservationTypeId!: number;
  roomNumber!: number;
  customer!: Customer;
}
