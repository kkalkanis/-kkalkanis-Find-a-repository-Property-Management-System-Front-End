import { Customer } from "./customer";
import { ReservationType } from "./reservation-type";
import { RoomTypeContract } from "./room-type-contract";

export class CheckIn {
  id!: number; 
  reservationTypeId!: number;
  reservationId!: number;
  roomNumber!: number;
  customers!: Customer[];
}
