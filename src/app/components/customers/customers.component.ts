import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../classes/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers!: Customer[];
  orderSelection = 'Ascending';
  formValue!: FormGroup;
  showAdd !: boolean;
  showUpdate !: boolean;
  customer: Customer = new Customer();
  currentCustomerId!: number;
  constructor(private formBuilder: FormBuilder, private customerService: CustomerService) { }

  //Getters for formGroup fields
  get firstName() { return this.formValue.get('firstName'); }
  get lastName() { return this.formValue.get('lastName'); }
  get passport() { return this.formValue.get('passport'); }
  get contactPhone() { return this.formValue.get('contactPhone'); }
  get email() { return this.formValue.get('email'); }
  get country() { return this.formValue.get('country'); }
  get city() { return this.formValue.get('city'); }
  get address() { return this.formValue.get('address'); }
  get zipCode() { return this.formValue.get('zipCode'); }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      passport: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      contactPhone: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      country: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      city: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      zipCode: new FormControl('', [Validators.required, Validators.maxLength(9)]),
    });
    this.getCustomers(this.orderSelection);
  }
  getCustomers(orderSelection : any) {
    this.customerService.getAllCustomersByOrder(this.orderSelection).subscribe(
      res => {
        this.customers = res;
      }    )
  }
  searchButtonClicked() {
    console.log((<HTMLInputElement>document.getElementById("searchText")).value);
  }
  selectedOptionPressed() {
    this.orderSelection = (<HTMLInputElement>document.getElementById("orderSelection")).value;
    this.getCustomers(this.orderSelection);
    ((<HTMLInputElement>document.getElementById("searchText")).value)='';
  }
  inputPressed(event: any) {
    console.log(event.target.value);
    if ((event.target.value).length == 0) {
      this.getCustomers(this.orderSelection);
    }
    else {
      this.customerService.getSpecCustomersLive(event.target.value, this.orderSelection).subscribe(
        res => {
          this.customers = res;
        })
    }
  }
  deleteCustomer(customerId: any) {
    this.customerService.deleteCustomer(customerId).subscribe(
      res => {
        alert("Customer deleted successfully");
        this.getCustomers(this.orderSelection);
      }    )
  }

  clickAddCustomer() {
    this.formValue.reset(); //reset form modal
    this.showAdd = true; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = false; //when Add Button is been clicked we don't want to see Update button in modal form
  }

  editCustomer(customer: any) {
    this.formValue.reset(); //reset form modal
    this.showAdd = false; //when Add Button is been clicked we want to see Add button in modal form
    this.showUpdate = true; //when Add Button is been clicked we don't want to see Update button in modal form
    
    this.formValue.controls['firstName'].setValue(customer.firstName);
    this.formValue.controls['lastName'].setValue(customer.lastName);
    this.formValue.controls['passport'].setValue(customer.passport);
    this.formValue.controls['contactPhone'].setValue(customer.contactPhone);
    this.formValue.controls['email'].setValue(customer.email);
    this.formValue.controls['country'].setValue(customer.country);
    this.formValue.controls['city'].setValue(customer.city);
    this.formValue.controls['address'].setValue(customer.address);
    this.formValue.controls['zipCode'].setValue(customer.zipCode);
    this.currentCustomerId = customer.customerId;
  }

  postCustomer() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }

    this.customer.firstName = this.formValue.value.firstName;
    this.customer.lastName = this.formValue.value.lastName;
    this.customer.address = this.formValue.value.address;
    this.customer.city = this.formValue.value.city;
    this.customer.contactPhone = this.formValue.value.contactPhone;
    this.customer.country = this.formValue.value.country;
    this.customer.email = this.formValue.value.email;
    this.customer.passport = this.formValue.value.passport;
    this.customer.zipCode = this.formValue.value.zipCode;
    this.customerService.postCustomer(this.customer).subscribe(
    res => {
      alert("Customer Created Successfully!");

      let ref = document.getElementById('close')
      ref?.click();
        this.formValue.reset();
        this.getCustomers(this.orderSelection);
    },
      err => {
        alert(err.error.message);
      }    )
  }

  updateCustomer() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
    
    this.customer.firstName = this.formValue.value.firstName;
    this.customer.lastName = this.formValue.value.lastName;
    this.customer.address = this.formValue.value.address;
    this.customer.city = this.formValue.value.city;
    this.customer.contactPhone = this.formValue.value.contactPhone;
    this.customer.country = this.formValue.value.country;
    this.customer.customerId = this.currentCustomerId;
    
    this.customer.email = this.formValue.value.email;
    this.customer.passport = this.formValue.value.passport;
    this.customer.zipCode = this.formValue.value.zipCode;

    this.customerService.updateCustomer(this.customer).subscribe(
      res => {
        alert("Customer Updated Successfully!");

        let ref = document.getElementById('close')
        ref?.click();
        this.formValue.reset();
        this.getCustomers(this.orderSelection);
      },
      err => {
        alert(err.error.message);
      })
    }


}
