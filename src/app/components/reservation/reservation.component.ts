import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Customer } from '../../classes/customer';
import { Reservation } from '../../classes/reservation';
import { ReservationType } from '../../classes/reservation-type';
import { Room } from '../../classes/room';
import { TypeRooms } from '../../classes/type-rooms';
import { AvailabilityService } from '../../services/availability.service';
import { CustomerService } from '../../services/customer.service';
import { ReservationService } from '../../services/reservation.service';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomService } from '../../services/room.service';
import { TypeAvailabilityService } from '../../services/type-availability.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  pseudoRoomType: TypeRooms = new TypeRooms();
  selectedTourOperator: string = 'SELF';
  termsOptions = ['ΗalfΒoard', 'FullBoard', 'Breakfast', 'No Meals'];
  selectedTermsOption = this.termsOptions[0];
  numberOfChildrenOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  numberOfAdultsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9,10];
  selectedNumberOfChildren = this.numberOfChildrenOptions[0];
  selectedNumberOfAdults = this.numberOfAdultsOptions[0];
  selectedTerms!: string;
  pageNumber: number = 1;
  sizeNumber: number = 5;
  totalElements: number = 0;
  roomTypes!: TypeRooms[];
  reservationRoomTypes!: TypeRooms[];
  selectedType!: string;
  formValue!: FormGroup;
  formValue2!: FormGroup;
  reservations!: Reservation[];
  reservationTypes!: ReservationType[];
  reservation: Reservation = new Reservation();
  reservationRoomTypeObj: ReservationType = new ReservationType();
  showAdd!: boolean;
  showUpdate!: boolean;
  currentReservationId!: number;
  currentReservationTypeId!: number;
  selectedGetType!: TypeRooms;
  constructor(private formBuilder: FormBuilder, private formBuilder2: FormBuilder, private reservationService: ReservationService,
    private roomTypeService: RoomTypeService  ) { }

  //Getters for formGroup fields
  get tourOperator() { return this.formValue.get('tourOperator'); }
  get reservationName() { return this.formValue.get('reservationName'); }
  get checkIn() { return this.formValue.get('checkIn'); }
  get checkOut() { return this.formValue.get('checkOut'); }
  get contactPhone() { return this.formValue.get('contactPhone'); }

  //Getters for formGroup2 fields
  get numberOfChildren() { return this.formValue2.get('numberOfChildren'); }
  get numberOfAdults() { return this.formValue2.get('numberOfAdults'); }
  get numberOfRooms() { return this.formValue2.get('numberOfRooms'); }
  get status() { return this.formValue2.get('status'); }
  get terms() { return this.formValue2.get('terms'); }
  get roomType() { return this.formValue2.get('roomType'); }

  ngOnInit(): void {
    this.getTypes();
    this.formValue = this.formBuilder.group({
      contactPhone: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]),
      tourOperator: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      reservationName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      checkIn: new FormControl('', [Validators.required]),
      checkOut: new FormControl('', [Validators.required]),
    });

    this.formValue2 = this.formBuilder2.group({
      numberOfChildren: new FormControl('', [Validators.required]),
      numberOfAdults: new FormControl('', [Validators.required]),
      numberOfRooms: new FormControl('', [Validators.required]),
      terms: new FormControl('', [Validators.required]),
      roomType: new FormControl('', [Validators.required]),
    });

    this.getReservations();
  }

  getTypes() {
    this.roomTypeService.getRoomTypes().subscribe(
      res => {
        this.roomTypes = res;
        try {
          this.selectedType = this.roomTypes[0].type;
        } catch (exception) {}


      }    )
  }

  getReservations() {
    this.reservationService.getPaginatedReservations(this.pageNumber - 1, this.sizeNumber).subscribe(
      res => {
        this.reservations = res.content;
        this.totalElements = res.totalElements;
        this.pageNumber = res.number + 1;
        this.sizeNumber = res.size;
      })
  }

  clickAddReservation() {
    this.formValue.reset(); //reset form modal
    this.showAdd = true; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = false; //when Add Button is been clicked we don't want to see Update button in modal form
  }

  clickAddReservationType(currentReservationId: number) {
    this.roomTypeService.getReservationRoomTypes(currentReservationId).subscribe(
      res => {
          this.reservationRoomTypes = res;
        this.roomTypes = this.reservationRoomTypes;
        if (res.length > 0) {
          this.selectedType = this.reservationRoomTypes[0].type;
        }
        else {
          this.pseudoRoomType.description = '';
          this.pseudoRoomType.id = 100;
          this.pseudoRoomType.type = 'No Room Types Found';
          this.pseudoRoomType.numberOfPersons = 0;
          this.roomTypes[0] = this.pseudoRoomType;
          alert("There is no contract created for requested reservation," +
                                " so there is no Type Availability! Please update corresponding contract first, in (Tour Contracts -> New Tour Contract) section and you can update your reservation later!");
        }
  
      }    )
    this.showAdd = true;
    this.showUpdate = false;
    this.currentReservationId = currentReservationId;
    this.formValue2.get('numberOfRooms')?.reset();
  }

    postReservation() {
      if (this.formValue.invalid) {
        this.formValue.markAllAsTouched();
        return;
      }

      this.reservation.tourOperatorName = this.formValue.value.tourOperator;
      this.reservation.reservationName = this.formValue.value.reservationName;
      this.reservation.checkInDate = this.formValue.value.checkIn;
      this.reservation.checkOutDate = this.formValue.value.checkOut;
      this.reservation.contactPhone = this.formValue.value.contactPhone;
      this.reservationService.postReservation(this.reservation).subscribe(
        res => {
          alert("Reservation Created Successfully!");
          
          let ref = document.getElementById('close-1')
          ref?.click();
          this.formValue.reset();
          this.getReservations();
        },
        err => {
             alert(err.error.message);
        }    )
  }

  viewReservationTypes(reservationeId: number) {
    this.showAdd = false; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = true; //when Add Button is been clicked we don't want to see Update button in modal form
    this.currentReservationId = reservationeId;
    
    this.reservationService.getReservationTypes(reservationeId).subscribe(
      res => {
        this.reservationTypes = res;
      }    )
  }

  postTypeReservation() {
    
      if (this.formValue2.invalid) {
        this.formValue2.markAllAsTouched();
        return;
    } 
    this.reservationRoomTypeObj.numberOfRooms = this.formValue2.value.numberOfRooms;
    this.reservationRoomTypeObj.numberOfChildren = this.formValue2.value.numberOfChildren;
    this.reservationRoomTypeObj.numberOfAdults = this.formValue2.value.numberOfAdults;
    this.reservationRoomTypeObj.roomType = this.formValue2.value.roomType;
    this.reservationRoomTypeObj.terms = this.formValue2.value.terms;
    
    this.reservationRoomTypeObj.reservationId = this.currentReservationId;
    this.reservationService.postReservationType(this.reservationRoomTypeObj).subscribe(
      res => {
        alert("Reservation Type Saved Successfully");
        this.formValue2.reset(); //reset form modal
        this.fillingFields();
        let ref2 = document.getElementById('close-2')
        ref2?.click();
      }, err => {
        alert(err.error.message);
        
      }     )
  }
    fillingFields() {
      this.formValue2.get('numberOfChildren')?.setValue(this.numberOfChildrenOptions[0]);
      this.formValue2.get('roomType')?.setValue(this.roomTypes[0].type);
      this.formValue2.get('numberOfAdults')?.setValue(this.numberOfAdultsOptions[0]);
      this.formValue2.get('terms')?.setValue(this.termsOptions[2]);
    }

  deleteReservationType(reservationTypeId: any) {
    this.reservationService.deleteReservationType(reservationTypeId).subscribe(
      res => {
        alert("Reservation Type Deleted Successfully");
        this.viewReservationTypes(this.currentReservationId); 
      }    )
  }

  deleteReservation(delResId: any) {
    this.reservationService.deleteReservation(delResId).subscribe(
      res => {
        alert("Reservation Deleted Successfully");
        this.getReservations();
      }    )
    }

  updateReservation() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }

    console.log("Current reservation id is: " + this.currentReservationId);
    this.reservation.checkInDate = this.formValue.value.checkIn;
    this.reservation.checkOutDate = this.formValue.value.checkOut;
    this.reservation.id = this.currentReservationId;
    this.reservation.reservationName = this.formValue.value.reservationName;
    this.reservation.tourOperatorName = this.formValue.value.tourOperator;
    this.reservation.contactPhone = this.formValue.value.contactPhone;
    
    this.reservationService.updateReservation(this.reservation).subscribe(
      res => {
        alert("Reservation Updated Successfully!");
        this.getReservations();
        let ref2 = document.getElementById('close-1')
        ref2?.click();
        
      }, err => {
        alert(err.error.message);
      }    )
  }

  editReservation(reservation: any) {
    this.showUpdate = true;
    this.showAdd = false;
    this.formValue.controls['checkIn'].setValue(reservation.checkInDate);
    this.formValue.controls['checkOut'].setValue(reservation.checkOutDate);
    this.formValue.controls['reservationName'].setValue(reservation.reservationName);
    this.formValue.controls['tourOperator'].setValue(reservation.tourOperatorName);
    this.formValue.controls['contactPhone'].setValue(reservation.contactPhone);
    this.currentReservationId = reservation.id;
  }

  editReservationType(reservationType: any) {
    this.formValue2.controls['numberOfChildren'].setValue(reservationType.numberOfChildren);
    this.formValue2.controls['numberOfAdults'].setValue(reservationType.numberOfAdults);
    this.formValue2.controls['numberOfRooms'].setValue(reservationType.numberOfRooms);
    this.formValue2.controls['terms'].setValue(reservationType.terms);
    this.formValue2.controls['roomType'].setValue(reservationType.roomType);
    this.currentReservationTypeId = reservationType.id;
  }

  updateReservationType() {
    this.reservationRoomTypeObj.id = this.currentReservationTypeId;
    this.reservationRoomTypeObj.numberOfChildren = this.formValue2.value.numberOfChildren;
    this.reservationRoomTypeObj.numberOfAdults = this.formValue2.value.numberOfAdults;
    this.reservationRoomTypeObj.numberOfRooms = this.formValue2.value.numberOfRooms;
    this.reservationRoomTypeObj.terms = this.formValue2.value.terms;
    this.reservationRoomTypeObj.roomType = this.formValue2.value.roomType;
    this.reservationRoomTypeObj.reservationId = this.currentReservationId;
    this.reservationService.updateReservationType(this.reservationRoomTypeObj).subscribe(
      res => {
        alert("Reservation Type Updated Successfully!");
        let ref2 = document.getElementById('close-2')
        ref2?.click();
      }, err => {
          alert(err.error.message);
      }
    )
  }

  selectChangeHandler(event: any) {
    //update the ui
    this.selectedType = event.target.value;
    this.roomTypeService.getSpecificType(this.selectedType).subscribe(
      res => {
        this.selectedGetType = res;
        this.selectedNumberOfAdults = this.selectedGetType.numberOfPersons;
      })
  }
}


  
