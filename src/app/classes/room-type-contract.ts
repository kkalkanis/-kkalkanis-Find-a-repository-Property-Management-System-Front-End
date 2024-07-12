import { TypeRooms } from "./type-rooms";

export class RoomTypeContract {
  contractId!: number;
  id!: number;
  numberOfRooms!: number;
  numberOfPersons!: number;
  terms!: string;
  roomType!: string;
  rentPrice!: number;
  breakfastPrice!: number;
  lunchPrice!: number;
  dinnerPrice!: number;
}
