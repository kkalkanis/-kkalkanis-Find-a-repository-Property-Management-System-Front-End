import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoomTypeContract } from '../../classes/room-type-contract';
import { TourContract } from '../../classes/tour-contract';
import { TourOperator } from '../../classes/tour-operator';
import { TypeRooms } from '../../classes/type-rooms';
import { RoomTypeService } from '../../services/room-type.service';
import { TourContractService } from '../../services/tour-contract.service';
import { TourOperatorService } from '../../services/tour-operator.service';

@Component({
  selector: 'app-contract-creation',
  templateUrl: './contract-creation.component.html',
  styleUrls: ['./contract-creation.component.css']
})
export class ContractCreationComponent implements OnInit {
  currentTourOperatorName!: string;
  showOperatorField!: boolean;
  tourOperators!: TourOperator[];
  selectedTourOperator: TourOperator = new TourOperator();
  selectedTourOperatorName: string = '';
  termsOptions = ['ΗalfΒoard', 'FullBoard', 'Breakfast','No Meals'];
  selectedTermsOption = this.termsOptions[0];
  selectedTerms!: string;
  contracts!: TourContract[];
  contractRoomTypes!: RoomTypeContract[];
  roomTypes!: TypeRooms[];
  contract: TourContract = new TourContract();
  contractRoomType: RoomTypeContract = new RoomTypeContract();
  pageNumber: number = 1;
  sizeNumber: number = 5;
  theTotalElements: number = 0;
  formValue!: FormGroup;
  formValue2!: FormGroup;
  formValue3!: FormGroup;
  selectedType!: string;
  selectedNumberOfPersons!: number;
  selectedGetType!: TypeRooms;
  showAdd!: boolean;
  showUpdate!: boolean;
  currentId!: number;
  currentContractTypeId!: number;
  constructor(private tourOperatorService:TourOperatorService,private tourConstractService: TourContractService, private formBuilder: FormBuilder, private formBuilder2: FormBuilder
    , private formBuilder3: FormBuilder, private roomTypeService: RoomTypeService) { }

  ngOnInit(): void {
    this.tourOperatorService.getTourOperators().subscribe(
      res => {
        this.tourOperators = res;
        this.selectedTourOperatorName = this.tourOperators[0].name;
        this.selectedTourOperator = this.tourOperators[0];
        console.log("operator " + this.selectedTourOperatorName);
      }    )
    this.getTypes();
    this.getContracts();
    this.selectedTerms = this.termsOptions[0];
    this.formValue = this.formBuilder.group({
      checkIn: new FormControl('', [Validators.required]),
      checkOut: new FormControl('', [Validators.required]),
    });

    this.formValue2 = this.formBuilder2.group({
      rentPrice: new FormControl('', [Validators.required]),
      breakfastPrice: new FormControl(''),
      lunchPrice: new FormControl(''),
      dinnerPrice: new FormControl(''),
      numberOfRooms: new FormControl('', [Validators.required]),
      numberOfPersons: new FormControl('', [Validators.required]),
      roomType: new FormControl('', [Validators.required]),
      terms: new FormControl('', [Validators.required]),
    });
  
  }
  getTypes() {
    this.roomTypeService.getRoomTypes().subscribe(
      res => {
        this.roomTypes = res;
        try {
          this.selectedType = this.roomTypes[0].type;
        } catch (exception) { }
      })
  }

  //Getters for formGroup fields
  get tourOperator() { return this.formValue.get('tourOperator'); }
  get checkIn() { return this.formValue.get('checkIn'); }
  get checkOut() { return this.formValue.get('checkOut'); }
  get numberOfRooms() { return this.formValue2.get('numberOfRooms'); }
  get numberOfPersons() { return this.formValue2.get('numberOfPersons'); }
  get roomType() { return this.formValue2.get('roomType'); }
  get terms() { return this.formValue2.get('terms'); }
  get rentPrice() { return this.formValue2.get('rentPrice'); }
  get dinnerPrice() { return this.formValue2.get('dinnerPrice'); }
  get lunchPrice() { return this.formValue2.get('lunchPrice'); }
  get breakfastPrice() { return this.formValue2.get('breakfastPrice'); }

  postContract() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.contract.checkInDate = this.formValue.value.checkIn;
    this.contract.checkOutDate = this.formValue.value.checkOut;
    this.contract.tourOperator = this.selectedTourOperatorName;

    this.tourConstractService.postContract(this.contract).subscribe(
      res => {
        alert("Contract Added Successfully");
        let ref = document.getElementById('cancel')
        ref?.click();

        this.formValue.reset(); //reset form modal
        this.getContracts(); // refresh table rows
      },
      err => {

        alert(err.error.message);
      })

  }



  getContracts() {
    this.tourConstractService.getPaginatedContracts(this.pageNumber - 1, this.sizeNumber).subscribe(res => {
      this.contracts = res.content;
      this.theTotalElements = res.totalElements;
      this.pageNumber = res.number + 1;
      this.sizeNumber = res.size;
    })
  }

  clickAddContract() {
    this.showOperatorField = true;
    this.formValue.reset(); //reset form modal
    this.showAdd = true; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = false; //when Add Button is been clicked we don't want to see Update button in modal form
  }

  onEdit(contract: TourContract) {
    this.currentTourOperatorName = contract.tourOperator;
    this.showOperatorField = false;
    this.showAdd = false; //when Edit Button is been clicked we dont want to see Add button in modal form
    this.showUpdate = true; //when Edit Button is been clicked we  want to see Update button in modal form
   
    this.formValue.controls['checkIn'].setValue(contract.checkInDate);
    this.formValue.controls['checkOut'].setValue(contract.checkOutDate);
    
    this.currentId = contract.id;
    this.currentContractTypeId = contract.contractTypeId;
  }

  deleteContract(deleteById: number) {
    this.tourConstractService.deleteContract(deleteById).subscribe(
      res => {
        this.getContracts();
        alert("Contract Deleted!");
      })

  }

  //This method is called when Update Button is been clicked from modal form
  updateContract() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.contract.checkInDate = this.formValue.value.checkIn;
    this.contract.checkOutDate = this.formValue.value.checkOut;
    
    this.contract.tourOperator = this.currentTourOperatorName;
    

    this.contract.id = this.currentId;
    this.contract.contractTypeId = this.currentContractTypeId;
    //Call API for PutMapping
    this.tourConstractService.updateContract(this.contract)
      .subscribe(res => {
        alert("Contract Updated Successfully");
        
        let ref = document.getElementById('cancel')
        ref?.click();

        this.formValue.reset(); //reset form modal
        this.getContracts(); // refresh table rows
      }, err => {
        alert(err.error.message);
      })
  }

  addRoomTypeContract(contractId: any) {
    this.formValue2.get('numberOfRooms')?.reset();
    this.formValue2.get('rentPrice')?.reset();
    this.formValue2.get('dinnerPrice')?.reset();
    this.formValue2.get('lunchPrice')?.reset();
    this.formValue2.get('breakfastPrice')?.reset();
    this.selectedNumberOfPersons = this.roomTypes[0].numberOfPersons;
    this.showAdd = true;
    this.showUpdate = false;
    this.currentId = contractId;
  }

  postContractRoomType() {
    if (this.formValue2.invalid) {
      this.formValue2.markAllAsTouched();
      return;
    }
    this.contractRoomType.numberOfRooms = this.formValue2.value.numberOfRooms;
    this.contractRoomType.numberOfPersons = this.formValue2.value.numberOfPersons;
    this.contractRoomType.rentPrice = this.formValue2.value.rentPrice;
    this.contractRoomType.dinnerPrice = this.formValue2.value.dinnerPrice;
    this.contractRoomType.lunchPrice = this.formValue2.value.lunchPrice;
    this.contractRoomType.breakfastPrice = this.formValue2.value.breakfastPrice;
    this.contractRoomType.roomType = this.formValue2.value.roomType;
    this.contractRoomType.terms = this.formValue2.value.terms;
    this.contractRoomType.contractId = this.currentId;
    this.tourConstractService.postRoomTypeContract(this.contractRoomType).subscribe(
      res => {
        alert("Room Type Contract Saved Successfully!");
        this.formValue2.reset(); //reset form modal
        this.fillingFields();
        let ref2 = document.getElementById('close')
        ref2?.click();
      },
      err => {

        alert(err.error.message);
      }
    )
  }
  retrieveContractRoomTypes(contractId: any) {
    this.tourConstractService.getContractRoomTypes(contractId).subscribe(
      res => {
        this.contractRoomTypes = res;
        this.currentId = contractId;
      })
  }

  deleteContractRoomType(delContractTypeId: any) {
    this.tourConstractService.deleteContractRoomType(delContractTypeId).subscribe(
      res => {
        alert("Contract Room Type Deleted Successfully");
        console.log(this.currentContractTypeId + "current");
        this.retrieveContractRoomTypes(this.currentId);
      })
  }

  editContractRoomType(contractRoomType: RoomTypeContract) {
    this.showAdd = false;
    this.showUpdate = true;
    this.currentId = contractRoomType.contractId;
    this.currentContractTypeId = contractRoomType.id;
    this.formValue2.controls['roomType'].setValue(contractRoomType.roomType);
    this.formValue2.controls['terms'].setValue(contractRoomType.terms);
    this.formValue2.controls['numberOfRooms'].setValue(contractRoomType.numberOfRooms);
    this.formValue2.controls['numberOfPersons'].setValue(contractRoomType.numberOfPersons);
    this.formValue2.controls['rentPrice'].setValue(contractRoomType.rentPrice);
    this.formValue2.controls['dinnerPrice'].setValue(contractRoomType.dinnerPrice);
    this.formValue2.controls['lunchPrice'].setValue(contractRoomType.lunchPrice);
    this.formValue2.controls['breakfastPrice'].setValue(contractRoomType.breakfastPrice);

  }

  updateContractRoomType() {

    this.contractRoomType.roomType = this.formValue2.value.roomType;
    console.log("Type: " + this.contractRoomType.roomType);

    this.contractRoomType.numberOfRooms = this.formValue2.value.numberOfRooms;
    console.log("Rooms: " + this.contractRoomType.numberOfRooms);

    this.contractRoomType.numberOfPersons = this.formValue2.value.numberOfPersons;

    this.contractRoomType.rentPrice = this.formValue2.value.rentPrice;

    this.contractRoomType.dinnerPrice = this.formValue2.value.dinnerPrice;

    this.contractRoomType.lunchPrice = this.formValue2.value.lunchPrice;

    this.contractRoomType.breakfastPrice = this.formValue2.value.brekfastPrice;

    this.contractRoomType.id = this.currentContractTypeId;
    console.log("Id: " + this.contractRoomType.id);

    this.contractRoomType.terms = this.formValue2.value.terms;
    console.log("Terms: " + this.contractRoomType.terms);
    //Call API for PutMapping
    this.tourConstractService.updateRoomTypeContract(this.contractRoomType).subscribe(
      res => {
        alert("Updated Successfully!");
        
        let ref2 = document.getElementById('close')
        ref2?.click();
        this.formValue2.reset();
      } ,err => {

        alert(err.error.message);
      })
  }

  selectChangeHandler(event: any) {
    //update the ui
    this.selectedType = event.target.value;
    this.roomTypeService.getSpecificType(this.selectedType).subscribe(
      res => {
        this.selectedGetType = res;
        this.selectedNumberOfPersons = this.selectedGetType.numberOfPersons;
      })
  }

  fillingFields() {
    this.formValue2.get('roomType')?.setValue(this.roomTypes[0].type);
    this.formValue2.get('terms')?.setValue(this.termsOptions[2]);
  }

  changeTermsEventHandler(event: any) {
    this.selectedTerms = event.target.value;
  }
  selectChangeOperatorHandler(event: any) {
    this.selectedTourOperatorName = event.target.value;
    console.log("operator " + this.selectedTourOperatorName);
  }
}


