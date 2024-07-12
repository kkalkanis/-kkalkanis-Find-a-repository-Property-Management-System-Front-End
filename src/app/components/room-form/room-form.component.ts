import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Customer } from '../../classes/customer';
import { CustomerPricing } from '../../classes/customer-pricing';
import { Room } from '../../classes/room';
import { TypeRooms } from '../../classes/type-rooms';
import { CheckInOutService } from '../../services/check-in-out.service';
import { CustomerPricingService } from '../../services/customer-pricing.service';
import { CustomerService } from '../../services/customer.service';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomService } from '../../services/room.service';
import { RoomTypeFormComponent } from '../room-type-form/room-type-form.component';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit {
  currentDateString: string = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'); //Seed date in string
  selectedCustomerId!: number;
  selectedCustomerObject: Customer = new Customer();
  selectedCustomerName!: string;
  selectedDate!: string;
  customersByRoom !: Customer[];
  currentRoomNumber: number = 0;
  customerPricing: CustomerPricing = new CustomerPricing();
  isLoading = false;
  selected!: string ;
  pageNumber: number = 1;
  sizeNumber: number = 5;
  theTotalElements: number = 0;
  roomTypes!: TypeRooms[];
  formValue!: FormGroup;
  formValue2!: FormGroup;
  rooms!: Room[];
  RoomObj: Room = new Room();
  id!: number;
  showAdd!: boolean;
  showUpdate!: boolean;
  constructor(private checkInOutService: CheckInOutService,private http: HttpClient, private formBuilder: FormBuilder,
    private roomService: RoomService, private roomTypeService: RoomTypeService,private customerPricingService: CustomerPricingService) { }

  ngOnInit(): void {
    this.getRoomTypes();

    this.formValue2 = this.formBuilder.group({
      price2: new FormControl('', [Validators.required]),
      description2: new FormControl('', [Validators.required]),
      roomNumber2: new FormControl('', [Validators.required]),
      customers: new FormControl('', [Validators.required])
    });

    this.formValue = this.formBuilder.group({
      description: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      roomNumber: new FormControl('', [Validators.required, Validators.min(1), Validators.max(999)]),
      type: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.maxLength(50)])
    });
    this.getRooms(); //we call here getRooms method to see initial values on table
  }
      // Call API in order to get all Rooms From Back-End
  getRooms() {
    this.roomService.getPaginatedRooms(this.pageNumber -1, this.sizeNumber).subscribe(
      data=> {
        this.rooms = data.content;
        this.pageNumber = data.number + 1;
        this.sizeNumber = data.size;
        this.theTotalElements = data.totalElements;
      }
    )
      }

  // When Add Button clicked Call API in order to add a new Type Room
  postRoom() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    //Take info from form and save it in typeRoomsObj
    this.RoomObj.description = this.formValue.value.description;
    this.RoomObj.roomNumber = this.formValue.value.roomNumber;
    this.RoomObj.type = this.formValue.value.type;
    this.RoomObj.status = this.formValue.value.status;
    this.RoomObj.id = 0;
    //Here we call our service which has postType() method which calls API for PostMapping
    this.roomService.postRoom(this.RoomObj)
      .subscribe(res => {
        this.isLoading = false;
        alert("Room Added Successfully");
        let ref = document.getElementById('cancel')
        ref?.click();

        this.formValue.reset(); //reset form modal
        this.getRooms(); // refresh table rows
      },
        err => {
          alert(err.error.message);
        })

  }

  // When Delete Button clicked Call API in order to delete a specific Room
  deleteRoom(delRoomNumber: any) {
    //Here we call our service which has deleteType() method which calls API for DeleteMapping
    this.roomService.deleteRoom(delRoomNumber).subscribe(res => {
      alert("Room Deleted");
      this.getRooms(); // refresh table rows
    })
  }

  //This method is called when Edit Button is been clicked
  onEdit(editRoom: any) {
    this.showAdd = false; //when Edit Button is been clicked we dont want to see Add button in modal form
    this.showUpdate = true; //when Edit Button is been clicked we  want to see Update button in modal form
    this.RoomObj.id = editRoom.id; //assign deletion row id with typeRooms Object to know the object we want to update later
    // Set form fields with Type Objects Values
    this.formValue.controls['type'].setValue(editRoom.type);
    this.formValue.controls['roomNumber'].setValue(editRoom.roomNumber);
    this.formValue.controls['description'].setValue(editRoom.description);
    this.formValue.controls['status'].setValue(editRoom.status);
    
  }

  //This method is called when Update Button is been clicked from modal form
  updateRoom() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.id = this.RoomObj.id; //keep id in a local variable because we have to pass in updateType() method
    //Fill the object type's fields from modal form
    this.RoomObj.description = this.formValue.value.description;
    this.RoomObj.roomNumber = this.formValue.value.roomNumber;
    this.RoomObj.type = this.formValue.value.type;
    this.RoomObj.status = this.formValue.value.status;
    //Call API for PutMapping
    this.roomService.updateRoom(this.RoomObj)
      .subscribe(res => {
        alert("Updated Successfully");

        let ref = document.getElementById('cancel')
        ref?.click();

        this.formValue.reset(); //reset form modal
        this.getRooms(); // refresh table rows 
      })
  }
  //This method is called when Add Tyoe button is been clicked from nav menu
  clickAddRoom() {
    this.getRoomTypes();
    this.formValue.reset(); //reset form modal
    this.showAdd = true; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = false; //when Add Button is been clicked we don't want to see Update button in modal form
  }
  getRoomTypes() {
    this.roomTypeService.getRoomTypes().subscribe(res => {
      this.roomTypes = res;

      //  if there is no saved type yet
      try {
        if (this.roomTypes[0].type!=null) {
          this.selected = this.roomTypes[0].type;
        }
      } catch (error) { 
        this.selected = '';
      }     
    })
  }

  addPricing(roomNumber: any) {
    this.formValue2.controls['description2'].reset();
    this.formValue2.controls['description2'].setValue('');
    this.formValue2.controls['price2'].reset();
    this.formValue2.controls['price2'].setValue('');
    this.currentRoomNumber = roomNumber;
    this.formValue2.get('roomNumber2')?.setValue(roomNumber);
    this.formValue2.controls['roomNumber2'].disable();

    this.getCustomersByDateHandler();
  }

  addCustomerBilling() {
    try {
      if (this.formValue2.invalid) {
        this.formValue2.markAllAsTouched();
        return;
      }
      this.customerPricing.date = this.formValue2.value.pricingDate;
      this.customerPricing.description = this.formValue2.value.description2;
      this.customerPricing.price = this.formValue2.value.price2;
      this.customerPricing.roomNumber = this.currentRoomNumber;
      this.customerPricing.customerId = this.selectedCustomerId;


      this.customerPricingService.getInsideCheckIns(this.customerPricing.date, this.currentRoomNumber).subscribe(
        res => {
          this.customerPricingService.postCustomerPricing(this.customerPricing).subscribe(
            res => {
              alert("Τhe amount was successfully entered");
              this.formValue2.reset();
              let cl = document.getElementById('closePricingModal');
              cl?.click();
            })
        },
        err => {
          alert(err.error.message);
        })
    } catch(exception) { }
  }

  getCustomersByDateHandler() {
    this.selectedDate = this.currentDateString;
    this.checkInOutService.getAvailabilitiesByRoomAndDate(this.selectedDate, this.currentRoomNumber).subscribe(
      res => {
        this.customersByRoom = res;
        if (this.customersByRoom.length > 0) {
          this.selectedCustomerName = this.customersByRoom[0].firstName;
          this.selectedCustomerObject = this.customersByRoom[0];
          this.selectedCustomerId = this.customersByRoom[0].customerId;
        } else {
          this.selectedCustomerName = "Not checked in yet";
          
        }
      }
      )
  }

  customerSelectedHandler(event: any) {
    console.log(event.target.value);
    this.selectedCustomerId = event.target.value;
    }

 
  //Getters for formGroup fields
  get description() { return this.formValue.get('description'); }
  get roomNumber() { return this.formValue.get('roomNumber'); }
  get type() { return this.formValue.get('type'); }
  get status() { return this.formValue.get('status'); }

  //Getters for formGroup fields
  get price2() { return this.formValue2.get('price2'); }
  get roomNumber2() { return this.formValue2.get('roomNumber2'); }
  get description2() { return this.formValue2.get('description2'); }
  get customers() { return this.formValue2.get('customers'); }
}
