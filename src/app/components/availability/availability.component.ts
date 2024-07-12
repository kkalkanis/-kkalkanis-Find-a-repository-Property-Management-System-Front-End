import { HostListener, NgZone } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Availability } from '../../classes/availability';
import { Customer } from '../../classes/customer';
import { Room } from '../../classes/room';
import { AvailabilityService } from '../../services/availability.service';
import { CheckInOutService } from '../../services/check-in-out.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
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
  rooms!: Room[];
  numberOfRooms!: number;
  pageNumber: number = 1;
  sizeNumber: number = 30;
  theTotalElements: number = 0;
  availability!: Availability[];
  customers!: Customer[];
  stringUnifyCustomers: string='';
  
  
  constructor(private checkInOutService:CheckInOutService,private availabilityService: AvailabilityService, private roomService: RoomService) { }
  over(roomNumber: any, date: any) {
    this.stringUnifyCustomers = "";
    console.log("roomNumber " + roomNumber);
    console.log("date " + date);
    this.checkInOutService.getAvailabilitiesByRoomAndDate(date, roomNumber).subscribe(
      res => {
        this.customers = [];
        this.customers = res;
        let len = 0;
        for (let i = 0; i < this.customers.length; i++) {
          len = len + this.customers[i].firstName.length;
          len = len + ' '.length;
          len = len + this.customers[i].lastName.length;
          len = len + '\n'.length;
        }
       
        for (let i = 0; i < this.customers.length; i++) {
          console.log(this.customers[i].firstName);
          this.stringUnifyCustomers = this.stringUnifyCustomers + this.customers[i].firstName;
          this.stringUnifyCustomers = this.stringUnifyCustomers + ' ';
          this.stringUnifyCustomers = this.stringUnifyCustomers + this.customers[i].lastName;
          this.stringUnifyCustomers = this.stringUnifyCustomers + ' '+'\n';
        }
        if (len != this.stringUnifyCustomers.length) {
          this.stringUnifyCustomers = '';
          for (let i = 0; i < this.customers.length; i++) {
            this.stringUnifyCustomers = this.stringUnifyCustomers + this.customers[i].firstName;
            this.stringUnifyCustomers = this.stringUnifyCustomers + ' ';
            this.stringUnifyCustomers = this.stringUnifyCustomers + this.customers[i].lastName;
            this.stringUnifyCustomers = this.stringUnifyCustomers + ' ' + '\n';
          }
        }
      }    )
  }

  ngOnInit(): void {
    this.getRooms();

    
  }
  getAvailability(mnm: string) {
    this.sizeNumber = 30;

      console.log(this.pageNumber + "pageNumber");
      this.availabilityService.getAvailability(this.pageNumber - 1, this.sizeNumber * this.numberOfRooms).subscribe(
        data => {
         
          this.months = [];
          
          this.availability = data.content;
          this.pageNumber = data.number + 1;
          this.sizeNumber = data.size;
          this.theTotalElements = data.totalElements;

          this.index = 0;
          this.days.splice(0);
          this.monthsAndDays.splice(0);
          for (let i = 0; i < this.availability.length; i++) {
            this.years[i] = this.availability[this.index].date.toString().substring(0, 4);
            this.months[i] = this.availability[this.index].date.toString().substring(5, 7);
            this.days[i] = this.availability[this.index].date.toString().substring(8, 10);
            this.monthsAndDays[i] = this.days[i] + '/' + this.months[i];
            this.index += this.numberOfRooms;
            if (this.index >= this.availability.length) {
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
  
  getRooms() {
    this.roomService.getRooms().subscribe(res => {
        this.rooms = res;
        this.numberOfRooms = this.rooms.length;
    })
  }
}

