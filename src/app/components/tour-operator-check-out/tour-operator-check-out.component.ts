import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Reservation } from '../../classes/reservation';
import { CheckOutOperatorService } from '../../services/check-out-operator.service';
import { CheckOutService } from '../../services/check-out.service';

@Component({
  selector: 'app-tour-operator-check-out',
  templateUrl: './tour-operator-check-out.component.html',
  styleUrls: ['./tour-operator-check-out.component.css']
})
export class TourOperatorCheckOutComponent implements OnInit {
  currentTourOperator!: string;
  tourOperatorTotal: number = 0;
  tempTodayDate: string = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'); //Seed date in string
  currentDateString: string = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'); //Seed date in string
  currentDate = new Date(this.tempTodayDate); //Current date
  previousDate: Date = new Date(); //Previous date
  departures!: Reservation[];
  departuresWithoutSelf: Reservation[]=[];
  noDeparturesDetected = false;
  errorMessage = "No Departures found for date: ";
  formValue!: FormGroup;
  constructor(private checkOutOperatorService:CheckOutOperatorService,private formBuilder:FormBuilder,private checkOutService: CheckOutService) { }

  get totalPrice() { return this.formValue.get('totalPrice'); }
  get creditPrice() { return this.formValue.get('creditPrice'); }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      totalPrice: new FormControl('', [Validators.required]),
      creditPrice: new FormControl('', [Validators.required]),
    });

    this.getDepartures(this.tempTodayDate); // first call with current date to retrieve todays arrivals
  }

  getDepartures(date: any) {
    this.departuresWithoutSelf = [];
    this.checkOutService.getDepartures(date).subscribe(
      res => {
        this.departures = res;
        for (let i = 0; i < this.departures.length; i++) {
          console.log(this.departures[i].tourOperatorName);
          if (!this.departures[i].tourOperatorName.match("SELF")) {
            this.departuresWithoutSelf.push(this.departures[i]);
          }
        }
        if (this.departures.length == 0) {
          this.noDeparturesDetected = true;
          setTimeout(() => {
            this.noDeparturesDetected = false;
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
    this.getDepartures(formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US'));
  }
  //when user push previous button return previous date's arrivals + N button hits every time
  clickPrevious() {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.previousDate.setDate(this.currentDate.getDate() - 1);

    this.currentDateString = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    console.log("Previous " + this.previousDate);
    console.log("Next " + this.currentDate);
    this.getDepartures(formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US'));
  }

  checkOutButtonClicked(tourOperatorName: any) {
    this.currentTourOperator = tourOperatorName;
    this.checkOutOperatorService.getTourOperatorCredit(tourOperatorName).subscribe(
      res => {
        this.tourOperatorTotal = res;
        this.formValue.get('totalPrice')?.setValue(this.tourOperatorTotal);
        this.formValue.controls['totalPrice'].disable();
      }    )
    
  }
  paymentButtonClicked() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    let creditPrice: number = this.formValue.get('creditPrice')?.value;
    console.log("creditPrice " + creditPrice);
    this.checkOutOperatorService.updateTourOperatorCredit(this.currentTourOperator, creditPrice).subscribe(
      res => {
        alert(res.message);
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
      },
      err => {
        alert(err.error.message);
      }    )
  }

}
