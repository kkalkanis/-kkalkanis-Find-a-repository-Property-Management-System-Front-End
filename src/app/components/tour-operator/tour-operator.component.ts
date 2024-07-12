import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TourOperator } from '../../classes/tour-operator';
import { TourOperatorService } from '../../services/tour-operator.service';

@Component({
  selector: 'app-tour-operator',
  templateUrl: './tour-operator.component.html',
  styleUrls: ['./tour-operator.component.css']
})
export class TourOperatorComponent implements OnInit {
  currentOperatorId!: number;
  tourOperator: TourOperator = new TourOperator();
  showAdd!: boolean;
  showUpdate!: boolean;
  tourOperators!: TourOperator[];
  formValue!: FormGroup;
  constructor(private tourOperatorService: TourOperatorService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      contactPhone: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])

    });

    this.getTourOperators();
  }
  getTourOperators() {
    this.tourOperatorService.getTourOperators().subscribe(
      res => {
        this.tourOperators = res;
      }    )
  }

  onDelete(tourOperatorId: any) {
    this.tourOperatorService.deleteOperator(tourOperatorId).subscribe(
      res => {
        alert("Tour Operator Deleted Successfully");
        this.getTourOperators();
      }    )
  }

  clickAddOperator() {
    this.formValue.reset(); //reset form modal
    this.showAdd = true; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = false;
  }

  editOperator(operator: any) {
    this.formValue.reset(); //reset form modal
    this.showAdd = false; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = true; 
    this.formValue.controls['name'].setValue(operator.name);
    this.formValue.controls['email'].setValue(operator.email);
    this.formValue.controls['contactPhone'].setValue(operator.contactPhone);
    this.currentOperatorId = operator.id;
  }

  updateTourOperator() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.tourOperator.name = this.formValue.value.name;
    this.tourOperator.email = this.formValue.value.email;
    this.tourOperator.contactPhone = this.formValue.value.contactPhone;
    this.tourOperator.id = this.currentOperatorId;

    this.tourOperatorService.updateTourOperator(this.tourOperator).subscribe(
      res => {
        alert("Tour Operator Updated Successfully");

        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getTourOperators();
      }, err => {
        alert(err.error.message);
      }    )
  }
  postTourOperatorClicked() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    this.tourOperator.name = this.formValue.value.name;
    this.tourOperatorService.postTourOperator(this.tourOperator).subscribe(
      res => {
        alert("Tour Operator Created Successfully!");
        this.formValue.reset();
        let ref = document.getElementById('cancel')
        ref?.click();
        this.getTourOperators();
      }, err => {
        alert(err.error.message);
      }
        )
  }
  get name() { return this.formValue.get('name'); }
  get email() { return this.formValue.get('email'); }
  get contactPhone() { return this.formValue.get('contactPhone'); }
}
