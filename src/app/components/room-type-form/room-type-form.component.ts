import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TypeRooms } from '../../classes/type-rooms';
import { RoomTypeService } from '../../services/room-type.service';
@Component({
  selector: 'app-room-type-form',
  templateUrl: './room-type-form.component.html',
  styleUrls: ['./room-type-form.component.css']
})
export class RoomTypeFormComponent implements OnInit {
  isLoading = false;
  pageNumber: number = 1;
  sizeNumber: number = 5;
  theTotalElements: number = 0;
  formValue!: FormGroup;
  roomTypes!: TypeRooms[];
  typeRoomsObj: TypeRooms = new TypeRooms();
  id!: number;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private roomTypeService: RoomTypeService) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({

      type: new FormControl('', [Validators.required,Validators.minLength(2), Validators.maxLength(2)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      numberOfPersons: new FormControl('', [Validators.required, Validators.min(1), Validators.max(20)])
    });

    this.getTypes(); //we call here getTypes method to see initial values on table 
  }
  // Call API in order to get all Type Rooms From Back-End
  getTypes() {
    this.roomTypeService.getPaginatedRoomTypes(this.pageNumber - 1, this.sizeNumber).subscribe(res => {
      this.roomTypes = res.content;
      this.theTotalElements = res.totalElements;
      this.pageNumber = res.number + 1;
      this.sizeNumber = res.size;
    })
  }
  // When Add Button clicked Call API in order to add a new Type Room
  postType() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    //Take info from form and save it in typeRoomsObj
    this.typeRoomsObj.description = this.formValue.value.description;
    this.typeRoomsObj.numberOfPersons = this.formValue.value.numberOfPersons;
    this.typeRoomsObj.type = this.formValue.value.type;
    this.typeRoomsObj.id = 0;
    //Here we call our service which has postType() method which calls API for PostMapping
    this.roomTypeService.postType(this.typeRoomsObj)
      .subscribe(res => {
        this.isLoading = false;
        alert("Type Added Successfully");

        let ref = document.getElementById('cancel')
        ref?.click();

        this.formValue.reset(); //reset form modal
        this.getTypes(); // refresh table rows 
      },
        err => {
          alert(err.error.message);
        }      )
    
  }
  // When Delete Button clicked Call API in order to delete a specific Type Room
  deleteType(delType: any) {
    //Here we call our service which has deleteType() method which calls API for DeleteMapping
    this.roomTypeService.deleteType(delType).subscribe(res => {
      alert("Type Deleted");
      this.getTypes(); // refresh table rows 
    })
  }
  //This method is called when Edit Button is been clicked
  onEdit(editType: any) {
    this.showAdd = false; //when Edit Button is been clicked we dont want to see Add button in modal form
    this.showUpdate = true; //when Edit Button is been clicked we  want to see Update button in modal form
    this.typeRoomsObj.id = editType.id; //assign deletion row id with typeRooms Object to know the object we want to update later
    // Set form fields with Type Objects Values
    this.formValue.controls['type'].setValue(editType.type);
    this.formValue.controls['numberOfPersons'].setValue(editType.numberOfPersons);
    this.formValue.controls['description'].setValue(editType.description);

  }
   //This method is called when Update Button is been clicked from modal form
  updateType() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.id = this.typeRoomsObj.id; //keep id in a local variable because we have to pass in updateType() method
    //Fill the object type's fields from modal form
    this.typeRoomsObj.description = this.formValue.value.description;
    this.typeRoomsObj.numberOfPersons = this.formValue.value.numberOfPersons;
    this.typeRoomsObj.type = this.formValue.value.type;
    //Call API for PutMapping
    this.roomTypeService.updateType(this.typeRoomsObj, this.id)
      .subscribe(res => {
        alert("Updated Successfully");

        let ref = document.getElementById('cancel')
        ref?.click();

        this.formValue.reset(); //reset form modal
        this.getTypes(); // refresh table rows 
      },
        err => {
          alert(err.error.message);
        }
      )

  }
  //This method is called when Add button is been clicked from nav menu
  clickAddType() {
    this.formValue.reset(); //reset form modal
    this.showAdd = true; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = false; //when Add Button is been clicked we don't want to see Update button in modal form
  }
  //Getters for formGroup fields
  get type() { return this.formValue.get('type'); }
  get description() { return this.formValue.get('description'); }
  get numberOfPersons() { return this.formValue.get('numberOfPersons'); }
}

