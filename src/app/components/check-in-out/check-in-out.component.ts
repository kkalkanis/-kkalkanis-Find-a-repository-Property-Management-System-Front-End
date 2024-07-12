import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Reservation } from '../../classes/reservation';
import { CheckInOutService } from '../../services/check-in-out.service';
import { formatDate } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationType } from '../../classes/reservation-type';
import { ReservationService } from '../../services/reservation.service';
import { AvailabilityService } from '../../services/availability.service';
import { Room } from '../../classes/room';
import { RoomTypeContract } from '../../classes/room-type-contract';
import { CheckIn } from '../../classes/check-in';
import { Customer } from '../../classes/customer';
import { RestCustomers } from '../../classes/restCustomers';
import { CheckInSingleCustomerRequest } from '../../classes/check-in-single-customer-request';

@Component({
  selector: 'app-check-in-out',
  templateUrl: './check-in-out.component.html',
  styleUrls: ['./check-in-out.component.css']
})
export class CheckInOutComponent implements OnInit {
  inReservationsCountPerDate!: number;
  reservationsCount!: number;
  dailyChargeMessage!: string;
  reservationTypeIdCheckIns !: number[];
  reservationTypeCheckIns !: CheckInSingleCustomerRequest[];
  currentRoomType!: string;
  noRoomsHasLeft = false;
  formCounter = 0;
  restCustomersArray!: RestCustomers[];
  customerArray!: Customer[];
  leftCustomersToCreate = 0;
  completedCustomers!:number[];
  customerObj: Customer = new Customer();
  checkInObject: CheckIn = new CheckIn();
  showHideRestCustomersArray !: boolean[];
  completedReservationTypes !: ReservationType[];
  restCustomerFormArray !: boolean[];
  showHideCustomerNonRequiredInfo = false;
  showHideReservationInfo = false;
  numberOfPersonsPerRoom = new Array();
  currentReservationId!: number;
  currentReservationTypeId!: number;
  showUpdate = true;
  noReservationsDetected = false;
  errorMessage = "No Arrivals found for date: ";
  reservations!: Reservation[];
  num: number = 1;
  tempTodayDate: string = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'); //Seed date in string
  currentDateString: string = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'); //Seed date in string
  currentDate = new Date(this.tempTodayDate); //Current date
  previousDate: Date = new Date(); //Previous date
  formValue!: FormGroup;
  formValue2!: FormGroup;
  formValue3!: FormGroup;
  formCustomer!: FormGroup;
  statusSelections = ['Pending', 'Check In', 'Cancel'];
  selectedRoom!: number;
  selectedStatusValue = this.statusSelections[0];
  selectedType!: string;
  selectedTermsOption!: string;
  selectedNumberOfAdults!: number;
  selectedNumberOfChildren!: number;
  reservationTypes!: ReservationType[];
  reservation: Reservation = new Reservation();
  reservationTypeObj: ReservationType = new ReservationType();
  availableRooms!: Room[];
  constructor(private availabilityService: AvailabilityService,private formBuilder: FormBuilder, private formBuilder2: FormBuilder, private formBuilder3: FormBuilder, private checkInOutService: CheckInOutService, private reservationService: ReservationService) { }

  //Getters for formGroup fields
  get status() { return this.formValue.get('status'); }

  //Getters for formGroup2 fields
  get numberOfChildren() { return this.formValue2.get('numberOfChildren'); }
  get numberOfAdults() { return this.formValue2.get('numberOfAdults'); }
  get terms() { return this.formValue2.get('terms'); }
  get roomType() { return this.formValue2.get('roomType'); }

  get roomNumber() { return this.formValue2.controls['customerInfo'].get('roomNumber'); }
  get firstName() { return this.formValue2.controls['customerInfo'].get('firstName'); }
  get lastName() { return this.formValue2.controls['customerInfo'].get('lastName'); }
  get passport() { return this.formValue2.controls['customerInfo'].get('passport'); }
  get country() { return this.formValue2.controls['customerInfo'].get('country'); }
  get city() { return this.formValue2.controls['customerInfo'].get('city'); }
  get zipCode() { return this.formValue2.controls['customerInfo'].get('zipCode'); }
  get contactPhone() { return this.formValue2.controls['customerInfo'].get('contactPhone'); }
  get address() { return this.formValue2.controls['customerInfo'].get('address'); }
  get email() { return this.formValue2.controls['customerInfo'].get('email'); }

  //Getters for formCustomer fields
  get firstName2() { return this.formCustomer.get('firstName2'); }
  get lastName2() { return this.formCustomer.get('lastName2'); }
  get passport2() { return this.formCustomer.get('passport2'); }
  get country2() { return this.formCustomer.get('country2'); }
  get city2() { return this.formCustomer.get('city2'); }
  get zipCode2() { return this.formCustomer.get('zipCode2'); }
  get contactPhone2() { return this.formCustomer.get('contactPhone2'); }
  get address2() { return this.formCustomer.get('address2'); }
  get email2() { return this.formCustomer.get('email2'); }

  get customers() {
    return this.formValue3.controls["customers"] as FormArray;
  }
  clickMethod() {
    if (confirm("Are you sure you want to charge reservations?")) {
      this.checkInOutService.postDayCharge(this.currentDateString).subscribe(
        res => {
          this.isTodayChargePerformed(this.tempTodayDate);
        }      )
    }
    else{}
  }

  ngOnInit(): void {
    this.reservationService.getInReservations(this.tempTodayDate).subscribe(
      res => {
        this.inReservationsCountPerDate = res;
        console.log("In reservations " + " Size : " + this.inReservationsCountPerDate);
      }    )
    this.getArrivals(this.tempTodayDate); // first call with current date to retrieve todays arrivals
    this.isTodayChargePerformed(this.tempTodayDate);

    //Init ChangeStatus formValue
    this.formValue = this.formBuilder.group({
      status: new FormControl('', [Validators.required])
    });

    this.formValue2 = this.formBuilder.group({
      numberOfChildren: new FormControl(''),
      numberOfAdults: new FormControl(''),
      terms: new FormControl(''),
      roomType: new FormControl(''),
      customerInfo: this.formBuilder.group({
        roomNumber: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        contactPhone: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        passport: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        country: new FormControl('', [Validators.maxLength(50)]),
        city: new FormControl('', [Validators.maxLength(50)]),
        address: new FormControl('', [Validators.maxLength(50)] ),
        zipCode: new FormControl('', [Validators.maxLength(9)])
      })
    });

    this.formValue3 = this.formBuilder3.group({
      customers: this.formBuilder3.array([])
    });


  }
    isTodayChargePerformed(date: string) {
      this.checkInOutService.getResponseDailyChargeExist(date).subscribe(
        res => {
            this.dailyChargeMessage = res.message;
        }, err => {
          this.dailyChargeMessage = err.error.message;
        }
      )
    }
  getArrivals(date: any) {
    this.reservationsCount = 0;
    this.checkInOutService.getArrivals(date).subscribe(
      res => {
        this.reservations = res;
        this.reservationsCount = this.reservations.length;
        if (this.reservations.length == 0) {
          this.noReservationsDetected = true;
          setTimeout(() => {
            this.noReservationsDetected = false;
          }, 900);
        }        
      })
  }
  //when user push next button return current date's arrivals + N button hits every time
  clickNext() {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.previousDate.setDate(this.currentDate.getDate() - 1);
    this.currentDateString = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    console.log("Previous " + this.previousDate);
    console.log("Next " + this.currentDate);
    this.isTodayChargePerformed(this.currentDateString);
    this.getArrivals(formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US'));
    this.reservationService.getInReservations(this.currentDateString).subscribe(
      res => {
        this.inReservationsCountPerDate = res;
        console.log("In reservations " + " Size : " + this.inReservationsCountPerDate);
      })
    
  }
  //when user push previous button return previous date's arrivals + N button hits every time
  clickPrevious() {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.previousDate.setDate(this.currentDate.getDate() - 1);

    this.currentDateString = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    console.log("Previous " + this.previousDate);
    console.log("Next " + this.currentDate);
    this.isTodayChargePerformed(this.currentDateString);
    this.getArrivals(formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US'));
    this.reservationService.getInReservations(this.currentDateString).subscribe(
      res => {
        this.inReservationsCountPerDate = res;
        console.log("In reservations " + " Size : " + this.inReservationsCountPerDate);
      })
  }

  viewReservationTypes(reservationId: number) {
    this.currentReservationId = reservationId;
    console.log(this.currentReservationId);
    this.reservationService.getSpecificReservation(this.currentReservationId).subscribe(
      res => {
        this.reservation = res;
        if (this.reservation.status == 'Checked In') {
          console.log("checked in");

        }
      }    )
    //this.showAdd = false; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = true; //when Add Button is been clicked we don't want to see Update button in modal form
    
    console.log("current " + reservationId);
    this.reservationService.getReservationTypes(reservationId).subscribe(
      res => {
        this.reservationTypes = res;
      })
    this.checkInOutService.isReservationTypesFulfilled(reservationId).subscribe(
      res => {
        this.reservationTypeIdCheckIns = [];
        console.log("mphka edwww");
        this.completedReservationTypes = res;
        console.log(this.completedReservationTypes.length);
        for (let i = 0; i < this.completedReservationTypes.length; i++) {
          console.log(this.completedReservationTypes[i].id + " id");
          this.reservationTypeIdCheckIns.push( this.completedReservationTypes[i].id);
        }
        
      },
      err => {

      })

  }

  fillInCustomerInfo(reservationTypeId: any) {
    this.formCounter = 0;
    this.customers.clear();
    this.formValue2.reset();
    this.formValue3.reset();
    this.currentReservationTypeId = reservationTypeId;
    this.reservationService.getSpecificReservationType(reservationTypeId).subscribe(
      res => {
        this.reservationTypeObj = res;
        this.currentRoomType = this.reservationTypeObj.roomType;
        this.numberOfPersonsPerRoom = [];
        this.showHideRestCustomersArray = new Array<boolean>(this.reservationTypeObj.numberOfAdults);
        this.leftCustomersToCreate = this.reservationTypeObj.numberOfAdults - 1;
        console.log("numberOfAdults" + this.reservationTypeObj.numberOfAdults);
        console.log("leftCustomersToCreate"+this.leftCustomersToCreate);
        this.restCustomerFormArray = new Array<boolean>(this.reservationTypeObj.numberOfAdults);
        for (let i=0; i < this.reservationTypeObj.numberOfAdults - 1; i++) {
          this.numberOfPersonsPerRoom[i] = i + 1;
          this.restCustomerFormArray[i] = false;
          this.showHideRestCustomersArray[i] = false;
        }
        this.reservationTypeObj = res;
        this.formValue2.controls['numberOfChildren'].setValue(this.reservationTypeObj.numberOfChildren);
        this.formValue2.controls['numberOfAdults'].setValue(this.reservationTypeObj.numberOfAdults);      
        this.formValue2.controls['terms'].setValue(this.reservationTypeObj.terms);
        this.formValue2.controls['roomType'].setValue(this.reservationTypeObj.roomType);

        this.formValue2.controls['numberOfChildren'].disable();
        this.formValue2.controls['numberOfAdults'].disable();
        this.formValue2.controls['terms'].disable();
        this.formValue2.controls['roomType'].disable();

        this.reservationService.getSpecificReservation(this.currentReservationId).subscribe(
          res => {
            this.reservation = res;
            this.availabilityService.getAvailableRooms(this.reservation.checkInDate, this.reservation.checkOutDate, this.reservationTypeObj.roomType).subscribe(
              res => {
                this.availableRooms = res;
                if (this.availableRooms.length > 0) {
                  this.noRoomsHasLeft = false;
                  this.selectedRoom = this.availableRooms[0].roomNumber;
                  console.log("Room available selected " + this.selectedRoom);
                  document.getElementById('checkInButton')?.removeAttribute("disabled");
                }
                else {
                  document.getElementById('checkInButton')?.setAttribute('disabled', 'disabled');
                  this.noRoomsHasLeft = true;
                }

                if (this.reservationTypeObj.numberOfAdults > 0) {
                  for (let i = 0; i < this.reservationTypeObj.numberOfAdults-1;i++)
                    this.addCustomer();
                }
              })
          })     
      }
    )
  }
  showHideReservationTypeInfo() {
    this.showHideReservationInfo = !this.showHideReservationInfo;
    console.log(this.formValue2.value.roomType);
  }
  showHideCustomerNonRequiredInf() {
    this.showHideCustomerNonRequiredInfo = !this.showHideCustomerNonRequiredInfo;
  }

  checkInButtonPressed() {
    /*
    let flag = false;
    if (this.formCounter > 0) {
      for (let i = 0; i < this.formCounter; i++) {
        if (this.formValue2.invalid || this.customers.at(i).invalid) {
          this.formValue2.markAllAsTouched();
          this.customers.at(i).markAllAsTouched();
          flag = true;
          console.log("flag1 " +flag);
        }
      }
      console.log("flag2 " + flag);
      if (flag) {
        return;
      }
            
    }
    else {
      if (this.formValue2.invalid) {
        this.formValue2.markAllAsTouched();
        return;
      }
    }
    */
    console.log("patithika");


    this.restCustomersArray = []; // init of table we want to keep formArray customers
    this.customerArray = []; //Here we keep all customers includng 1st mandatory customers and rest if exists

    //Iterate through formArray to save each customer as Customer Object in customer table
    this.customers.controls.forEach((element, index) => {
      this.restCustomersArray.push(element.value);
    });

 

    //Keep first mandatory customer as a customer object
    this.customerObj.address = this.formValue2.controls['customerInfo'].value.address;
    this.customerObj.firstName = this.formValue2.controls['customerInfo'].value.firstName;
    this.customerObj.lastName = this.formValue2.controls['customerInfo'].value.lastName;
    this.customerObj.passport = this.formValue2.controls['customerInfo'].value.passport;
    this.customerObj.country = this.formValue2.controls['customerInfo'].value.country;
    this.customerObj.city = this.formValue2.controls['customerInfo'].value.city;
    this.customerObj.zipCode = this.formValue2.controls['customerInfo'].value.zipCode;
    this.customerObj.contactPhone = this.formValue2.controls['customerInfo'].value.contactPhone;
    this.customerObj.email = this.formValue2.controls['customerInfo'].value.email;
    this.customerArray[0] = this.customerObj; //save mandatory customer 
    
    //Save rest customers if exist
    if (this.customers.length > 0) {
      for (let i = 1; i <= this.customers.length; i++) {
        this.customerObj = new Customer();
        this.customerObj.firstName = this.restCustomersArray[i - 1].firstName2;
        this.customerObj.lastName = this.restCustomersArray[i - 1].lastName2;
        this.customerObj.passport = this.restCustomersArray[i - 1].passport2;
        this.customerObj.country = this.restCustomersArray[i - 1].country2;
        this.customerObj.city = this.restCustomersArray[i - 1].city2;
        this.customerObj.zipCode = this.restCustomersArray[i - 1].zipCode2;
        this.customerObj.contactPhone = this.restCustomersArray[i - 1].contactPhone2;
        this.customerObj.email = this.restCustomersArray[i - 1].email2;
        this.customerObj.address = this.restCustomersArray[i - 1].address2;
        this.customerArray.push(this.customerObj); //save 
      }
    }

    

    
    this.checkInObject.reservationTypeId = this.currentReservationTypeId;
    this.checkInObject.roomNumber = this.selectedRoom;
    this.checkInObject.customers = this.customerArray;
    this.checkInObject.reservationId = this.currentReservationId;
    /*for (let i = 0; i < this.checkInObject.customers.length; i++) {
      console.log(this.checkInObject.customers[i].firstName);
    }
    console.log(this.checkInObject.reservationTypeId);
    console.log(this.checkInObject.roomNumber); */
    
    this.checkInOutService.postCheckInReservationType(this.checkInObject).subscribe(
      res => {
        alert("Ckeck In was Successfull");
        document.getElementById('cancel')?.click();
        this.getArrivals(this.currentDateString);
      })

  }


   

  selectRoomOption(event: any) {
    this.selectedRoom = event.target.value;
  }

  closeButtonPressed() {
    for (let i = 0; i < this.reservationTypeObj.numberOfAdults - 1; i++) {
      this.showHideRestCustomersArray[i] = false;
    }
    this.showHideCustomerNonRequiredInfo = false;
    this.showHideReservationInfo = false;
  }

  deleteCustomer(index:any) {
    this.customers.removeAt(index);
    this.leftCustomersToCreate = this.leftCustomersToCreate + 1;
  }
  
  addCustomer() {
    this.leftCustomersToCreate = this.leftCustomersToCreate - 1;
    console.log("this.leftCustomersToCreate " + this.leftCustomersToCreate);
    this.formCustomer = this.formBuilder3.group({
      firstName2: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastName2: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      contactPhone2: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]),
      email2: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      passport2: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      country2: new FormControl('', [Validators.maxLength(50)]),
      city2: new FormControl('', [Validators.maxLength(50)]),
      address2: new FormControl('', [Validators.maxLength(50)]),
      zipCode2: new FormControl('', [Validators.maxLength(9)])

      });
    this.customers.push(this.formCustomer);
    this.formCounter = this.formCounter + 1;
  }

  viewReservationTypeCheckIns(reservationTypeId:any) {
    this.checkInOutService.getReservationTypeCheckIns(reservationTypeId).subscribe(
      res => {
        this.reservationTypeCheckIns = res;
      }    )
  }


  toFormGroup = (form: AbstractControl) => form as FormGroup;
}
 

