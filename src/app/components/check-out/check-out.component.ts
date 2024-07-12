import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Reservation } from '../../classes/reservation';
import { CheckIn } from '../../classes/check-in';
import { CheckOutService } from '../../services/check-out.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomerPricing } from '../../classes/customer-pricing';
import { ReservationService } from '../../services/reservation.service';
import { ReservationType } from '../../classes/reservation-type';
import { Room } from '../../classes/room';
import { CheckInOutService } from '../../services/check-in-out.service';
import { CustomerPricingService } from '../../services/customer-pricing.service';
import { Customer } from '../../classes/customer';
import { Pricing } from '../../classes/pricing';
import { HotelSpecificsService } from '../../services/hotel-specifics.service';
import { HotelSpecifics } from '../../classes/hotel-specifics';
import * as UUID from 'uuid-int';
import { CustomerService } from '../../services/customer.service';
import { VisualizationOfReceipt } from '../../classes/visualization-of-receipt';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;
  uuid = 0;
  blob: Blob = new Blob();
  totalSelfPrice!: number;
  customerToPayExistsOnCustomersOfResetReservation = false;
  overalNightPricing = 0;
  customerMustPay: Customer = new Customer();
  totalPersonal: number[] = [];
  hotelSpecifics!: HotelSpecifics[];
  hotelSpecificsObj: HotelSpecifics = new HotelSpecifics();
  visualizationOfReceipt!: VisualizationOfReceipt[];
  customerPricing: CustomerPricing[] = [];
  currentCustomersToTakeReceipt!: Customer[];
  currentCustomersToTakeReceiptCount = 0;
  currentNumberOfPersons!: number[];
  currentTourOperator!: string;
  currentTypeOfRoom!: string;
  currentReservationId!: number;
  currentReservation!: Reservation;
  departureRoomsByType !: CheckIn[];
  reservationTypes!: ReservationType[];
  errorMessage = "No Departures found for date: ";
  departures!: Reservation[];
  noDeparturesDetected = false;
  tempTodayDate: string = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'); //Seed date in string
  currentDateString: string = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US'); //Seed date in string
  currentDate = new Date(this.tempTodayDate); //Current date
  previousDate: Date = new Date(); //Previous date
  formValue!: FormGroup;
  constructor(private formBuilder: FormBuilder,private customerService:CustomerService,private hotelSpecService:HotelSpecificsService,private customerPricingService: CustomerPricingService,private checkInOutService: CheckInOutService, private reservationService: ReservationService, private checkOutService: CheckOutService) { }
  get totalPrice() { return this.formValue.get('totalPrice'); }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      totalPrice: new FormControl('', [Validators.required])
    });
    this.getDepartures(this.tempTodayDate); // first call with current date to retrieve todays arrivals
  }
  getDepartures(date: any) {
    this.checkOutService.getDepartures(date).subscribe(
      res => {
        this.departures = res;
        console.log(this.departures.length);
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

  retrieveDepartureTypes(reservationId: any, tourOperatorName: any, curReservation: Reservation) {
    this.currentReservationId = reservationId;
    this.currentReservation = curReservation;
    this.currentTourOperator = tourOperatorName;
    this.reservationService.getReservationTypes(reservationId).subscribe(
      res => {
        this.reservationTypes = res;
      })


  }

  viewCheckOutRoomsByRoomType(reservationTypeId: number, reservationRoomType: any, numberOfAdults: any) {
    this.currentNumberOfPersons = [];
    for (let i = 0; i < numberOfAdults; i++) {
      this.currentNumberOfPersons[i] = i;
    }
    this.departureRoomsByType = [];
    this.currentTypeOfRoom = reservationRoomType;
    this.checkOutService.getDepartureRoomsByType(reservationTypeId).subscribe(
      res => {
        this.departureRoomsByType = res;
      })
  }

  previewReceipt(reservationId: any, roomNumber: any, customers: Customer[]) {
    this.currentCustomersToTakeReceipt = customers;
    
    if (this.currentTourOperator.match("SELF")) {
      this.customerToPayExistsOnCustomersOfResetReservation = false;
      this.customerService.getCustomerMustPay(reservationId).subscribe(
        res => {
          this.customerMustPay = res;
          console.log(this.currentCustomersToTakeReceipt.length);
          console.log("Customer must pay FirstName " + this.customerMustPay.firstName);
          console.log("Customer must pay LastName " + this.customerMustPay.lastName);
          console.log("Customer must pay FirstName " + this.customerMustPay.customerId);
          for (let i = 0; i < customers.length; i++) {
            if (customers[i].customerId == this.customerMustPay.customerId) {
              console.log("exists");
              this.customerToPayExistsOnCustomersOfResetReservation = true;
            }
          }
        })
    }
    
    for (let i = 0; i < this.currentCustomersToTakeReceipt.length; i++) {
      console.log(this.currentCustomersToTakeReceipt[i].firstName);
      console.log(this.currentCustomersToTakeReceipt[i].lastName);
      console.log(this.currentCustomersToTakeReceipt[i].customerId);
    }
    this.currentCustomersToTakeReceiptCount = this.currentCustomersToTakeReceipt.length;

    const id = 0;

    const generator = UUID(id);

    this.uuid = generator.uuid();
   
     this.hotelSpecService.getHotelSpecifics().subscribe(
      res => {
         this.hotelSpecifics = res;

         this.hotelSpecificsObj = this.hotelSpecifics[0];
      }    )
    try {
      this.customerPricingService.getCustomerPricing(reservationId, roomNumber, customers).subscribe(
        res => {
          this.totalPersonal = [];
          this.customerPricing = res;
          let temp = 0;
          for (let i = 0; i < this.currentCustomersToTakeReceipt.length; i++) {
            this.totalPersonal[i] = 0;
            for (let j = 0; j < this.customerPricing.length; j++) {
              if (this.currentCustomersToTakeReceipt[i].customerId == this.customerPricing[j].customerId ) {
                temp += this.customerPricing[j].price;
                this.totalPersonal[i] = temp;
              }
            }
            temp = 0;
          }
        })
    } catch (exception) { }
    //if self need to retrieve night expennces
    if (this.currentTourOperator.match("SELF")) { 
      this.customerPricingService.getNightPricing(reservationId).subscribe(
        res => {
          this.overalNightPricing = 0;
          this.visualizationOfReceipt = res;
          for (let i = 0; i < this.visualizationOfReceipt.length; i++) {
            this.overalNightPricing += this.visualizationOfReceipt[i].totalPrice;
          }
          console.log("Cost of overnight stays = " + this.overalNightPricing);
        }      )
    }
    

    
  }
  generateReceipt(receiptIndex: any) {
    let DATA: any = document.getElementById('htmlData' + receiptIndex);
    html2canvas(DATA, {
      scale: 4,
    }).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/jpg');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'jpg', 0, position, fileWidth, fileHeight);

      this.blob = PDF.output("blob");
      window.open(URL.createObjectURL(this.blob));

      this.hotelSpecService.updateReceiptNumber().subscribe(
        res => { })
      //PDF.save('angular-demo.pdf');
    });
  }
  checkOutButtonClicked(reservationId: any,reservation:any) {
    this.currentReservation = reservation;
    this.checkOutService.getSelfPricingTotal(reservationId).subscribe(
      res => {
        this.totalSelfPrice = res;
        this.formValue.get('totalPrice')?.setValue(this.totalSelfPrice);
        this.formValue.controls['totalPrice'].disable();
      }    )
   

  }

  paymentButtonClicked() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
   
    
    this.checkOutService.updateSelfPricing(this.currentReservation).subscribe(
      res => {
        alert(res.message);
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getDepartures(this.tempTodayDate);
      }, err => {
        alert(err.error.message);
      }
    )
    
  }

  }

    
   

