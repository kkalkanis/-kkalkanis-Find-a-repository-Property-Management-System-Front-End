import { Component, OnInit } from '@angular/core';
import { Room } from '../../classes/room';
import { TypeAvailability } from '../../classes/type-availability';
import { TypeRooms } from '../../classes/type-rooms';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomService } from '../../services/room.service';
import { TypeAvailabilityService } from '../../services/type-availability.service';

@Component({
  selector: 'app-type-availability',
  templateUrl: './type-availability.component.html',
  styleUrls: ['./type-availability.component.css']
})
export class TypeAvailabilityComponent implements OnInit {
  typeAvailability!: TypeAvailability[];
  rooms: Room[] = [];
  types!: TypeRooms[];
  numberOfTypes!: number;
  pageNumber: number = 1;
  sizeNumber: number = 30;
  theTotalElements: number = 0;

  dictionary = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  only_two: boolean = false;
  only_one: boolean = false;
  tempMonthSubstring: string = "";
  tempMonthSubstring2: string = "";
  index: number = 0;
  coupleOfMonth: string[] = [];
  coupleOfYears: string[] = [];
  months: string[] = [];
  days: string[] = [];
  years: string[] = [];
  monthsAndDays: string[] = [];
  constructor(private typeAvailabilityService: TypeAvailabilityService,
    private roomTypeService: RoomTypeService) { }

  ngOnInit(): void {
    this.getNumberOfTypes();
  }
  getNumberOfTypes() {
    this.roomTypeService.getRoomTypes().subscribe(res => {
      this.types = res;
      this.numberOfTypes = this.types.length;
      this.getTypeAvailability();
    })
  }
  getTypeAvailability() {
    this.sizeNumber = 30;
    this.typeAvailabilityService.getTypeAvailability(this.pageNumber - 1, this.sizeNumber * this.numberOfTypes).subscribe(
      data => {
        this.months = [];

        this.typeAvailability = data.content;
        this.pageNumber = data.number + 1;
        this.sizeNumber = data.size;
        this.theTotalElements = data.totalElements;

        this.index = 0;
        this.days.splice(0);
        this.monthsAndDays.splice(0);
        for (let i = 0; i < this.typeAvailability.length; i++) {
          this.years[i] = this.typeAvailability[this.index].date.toString().substring(0, 4);
          this.months[i] = this.typeAvailability[this.index].date.toString().substring(5, 7);
          this.days[i] = this.typeAvailability[this.index].date.toString().substring(8, 10);
          this.monthsAndDays[i] = this.days[i] + '/' + this.months[i];
          this.index += this.numberOfTypes;
          if (this.index >= this.typeAvailability.length) {
            break;
          }
        }
        this.tempMonthSubstring = "";
        this.tempMonthSubstring2 = "";
        this.only_one = false;
        this.only_two = false;
        this.coupleOfMonth = [];
        for (let i = 0; i < this.months.length; i++) {
          if (this.months[i + 1] == null) {
            this.tempMonthSubstring = this.months[i].substring(0, 1);
            if (this.tempMonthSubstring == '0') {
              this.coupleOfMonth[0] = this.months[i].substring(1, 2);
              this.coupleOfYears[0] = this.years[i];
              console.log("Contains only one month :" + this.coupleOfMonth[0]);
              this.only_one = true;
              break;
            }
            else {
              this.coupleOfMonth[0] = this.months[i];
              this.coupleOfYears[0] = this.years[i];
              this.only_one = true;
              console.log("Contains only one month :" + this.coupleOfMonth[0]);
              break;
            }
          }
          if (this.months[i] != this.months[i + 1]) {
            this.tempMonthSubstring = this.months[i].substring(0, 1);
            this.tempMonthSubstring2 = this.months[i + 1].substring(0, 1);
            if (this.tempMonthSubstring == '0' && this.tempMonthSubstring2 == '0') {
              this.coupleOfMonth[0] = this.months[i].substring(1, 2);
              this.coupleOfMonth[1] = this.months[i + 1].substring(1, 2);
              this.only_two = true;
            }
            else if (this.tempMonthSubstring != '0' && this.tempMonthSubstring2 != '0') {
              this.coupleOfMonth[0] = this.months[i];
              this.coupleOfMonth[1] = this.months[i + 1];
              this.only_two = true;
            }
            else if (this.tempMonthSubstring != '0' && this.tempMonthSubstring2 == '0') {
              this.coupleOfMonth[0] = this.months[i];
              this.coupleOfMonth[1] = this.months[i + 1].substring(1, 2);
              this.only_two = true;
            }
            else if (this.tempMonthSubstring == '0' && this.tempMonthSubstring2 != '0') {
              this.coupleOfMonth[0] = this.months[i].substring(1, 2);
              this.coupleOfMonth[1] = this.months[i + 1];
              this.only_two = true;
            }
            this.coupleOfYears[0] = this.years[i];
            this.coupleOfYears[1] = this.years[i + 1];
            console.log("Different months " + this.coupleOfMonth[0] + " " + this.coupleOfMonth[1]);
            break;
          }
        }
        if (this.only_one) {
          this.tempMonthSubstring = this.coupleOfMonth[0];
          this.coupleOfMonth[0] = this.dictionary[Number(this.tempMonthSubstring) - 1];
          console.log(this.coupleOfMonth[0]);
        }
        if (this.only_two) {
          this.tempMonthSubstring = this.coupleOfMonth[0];
          this.tempMonthSubstring2 = this.coupleOfMonth[1];
          this.coupleOfMonth[0] = this.dictionary[Number(this.tempMonthSubstring) - 1];
          this.coupleOfMonth[1] = this.dictionary[Number(this.tempMonthSubstring2) - 1];

        }

      })
  }
}

