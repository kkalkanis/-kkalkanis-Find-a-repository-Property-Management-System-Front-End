import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Customer } from '../classes/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  baseUrl = 'http://localhost:8080/api/';

  getCustomersByRoom(roomNumber: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'getCustomersByRoom/' + roomNumber);
  }

  getAllCustomersByOrder(orderSelection: any): Observable<any> {

    return this.httpClient.get(this.baseUrl + `getAllCustomers/` + orderSelection);

  }

  getSpecCustomersLive(fullName: any,orderSelection:any): Observable<any> {

    return this.httpClient.get(this.baseUrl + `getSpecificCustomers/` + fullName + '/' + orderSelection);

  }
 
  getCustomerByPhone(phone: any): Observable<any> {
    
      return this.httpClient.get(this.baseUrl + `getCurrentCustomer/${phone}`);
   
  }

  getCustomerMustPay(reservationId: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'getCustomerMustPay/' + reservationId);
  }

  updateCustomer(data: any) {
    return this.httpClient.put<any>(this.baseUrl  + 'updateCustomer', data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteCustomer(customerId: any) {
    return this.httpClient.delete<any>(this.baseUrl + "deleteCustomer/" + customerId)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  postCustomer(customer: Customer) {
    return this.httpClient.post<Customer>(this.baseUrl + 'saveCustomer', customer);
  }

  constructor(private httpClient: HttpClient) { }
}
