import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HotelSpecifics } from '../../classes/hotel-specifics';
import { HotelSpecificsService } from '../../services/hotel-specifics.service';
import { formatDate } from '@angular/common'
import { RoomService } from '../../services/room.service';
import { Room } from '../../classes/room';
import { disableDebugTools } from '@angular/platform-browser';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-hotel-specifics',
  templateUrl: './hotel-specifics.component.html',
  styleUrls: ['./hotel-specifics.component.css']
})
export class HotelSpecificsComponent implements OnInit {
  isLoading = false;
  isEnabled = false;
  numberOfRooms!: number;
  rooms!: Room[];
  text!: string;
  showAddHotelSpecsButton!: boolean;
  showAdd!: boolean;
  showUpdate!: boolean;
  hotelSpecifics!: HotelSpecifics[];
  currentDate!: Date;
  formValue!: FormGroup;
  hotelSpecificsObj: HotelSpecifics = new HotelSpecifics();
  constructor(private http: HttpClient, private formBuilder: FormBuilder,
              private hotelSpecsService: HotelSpecificsService, private roomService: RoomService) { }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.formValue = this.formBuilder.group({
      country: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      city: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      postalCode: new FormControl('', [Validators.required,Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      roomCounter: new FormControl(''),
      startDate: new FormControl('', [Validators.required]),
    });
    this.getRooms();
    this.getSpecifics();
  }
  getRooms() {
    this.roomService.getRooms().subscribe(res => {
      this.rooms = res;
      this.numberOfRooms = this.rooms.length;
    })
  }
  getSpecifics() {
    this.hotelSpecsService.getHotelSpecifics().subscribe((res => {
      this.hotelSpecifics = res;
      try {// if exists record on table HotelSpecifics
        if (this.hotelSpecifics[0].id != null) {
          this.showAddHotelSpecsButton = false;
        }
        
      } catch (error) { //If not we still want to see Add Button
        this.showAddHotelSpecsButton = true;
      }
    }))

  }

  

  postSpecs() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.isLoading = true;
      //Take info from form and save it in hotelSpecificsObj
      this.hotelSpecificsObj.address = this.formValue.value.address;
      this.hotelSpecificsObj.email = this.formValue.value.email;
      this.hotelSpecificsObj.name = this.formValue.value.name;
      this.hotelSpecificsObj.roomCounter = this.numberOfRooms;
      this.hotelSpecificsObj.city = this.formValue.value.city;
      this.hotelSpecificsObj.country = this.formValue.value.country;
      this.hotelSpecificsObj.postalCode = this.formValue.value.postalCode;
      this.hotelSpecificsObj.startDate = this.formValue.value.startDate;

    if (this.showAdd) {
      this.hotelSpecificsObj.id = 0;
      this.text = "Hotel Specifics Record Added Successfully";
    }
    else {
      this.hotelSpecificsObj.id = this.hotelSpecifics[0].id;
      this.text = "Hotel Specifics Record Updated Successfully";
    }
                         
      //Here we call our service which has postType() method which calls API for PostMapping
      this.hotelSpecsService.postHotelSpecifics(this.hotelSpecificsObj)
        .subscribe(res => {
          this.isLoading = false;
          alert(this.text);
          
          let ref = document.getElementById('cancel')
          ref?.click();

          this.formValue.reset(); //reset form modal
          this.getSpecifics(); // refresh table rows
        },
          err => {
            alert(err.error.message);
          })

    this.getSpecifics();
  }

  onEdit(editHotelSpecs: any) {
    this.showAdd = false; //when Edit Button is been clicked we dont want to see Add button in modal form
    this.showUpdate = true; //when Edit Button is been clicked we  want to see Update button in modal form
    this.hotelSpecificsObj.id = editHotelSpecs.id; 
    // Set form fields with Type Objects Values
    this.formValue.controls['address'].setValue(editHotelSpecs.address);
    this.formValue.controls['email'].setValue(editHotelSpecs.email);
    this.formValue.controls['name'].setValue(editHotelSpecs.name);
    this.formValue.controls['city'].setValue(editHotelSpecs.city);
    this.formValue.controls['country'].setValue(editHotelSpecs.country);
    this.formValue.controls['postalCode'].setValue(editHotelSpecs.postalCode);
    this.formValue.controls['roomCounter'].setValue(this.numberOfRooms);
    this.formValue.controls['roomCounter'].disable();

    this.formValue.controls['startDate'].setValue(formatDate(editHotelSpecs.startDate, 'yyyy-MM-dd', 'en'));
    
  }

 

  clickAddSpecifics() {
    this.formValue.reset(); //reset form modal
    this.showAdd = true; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = false; //when Add Button is been clicked we don't want to see Update button in modal form
    this.formValue.controls['roomCounter'].disable();
  }
  //Getters for formGroup fields
  get address() { return this.formValue.get('address'); }
  get email() { return this.formValue.get('email'); }
  get name() { return this.formValue.get('name'); }
  get startDate() { return this.formValue.get('startDate'); }
  get city() { return this.formValue.get('city'); }
  get country() { return this.formValue.get('country'); }
  get postalCode() { return this.formValue.get('postalCode'); }

}
