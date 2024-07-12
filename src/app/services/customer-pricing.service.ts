import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../classes/customer';
import { CustomerPricing } from '../classes/customer-pricing';

@Injectable({
  providedIn: 'root'
})
export class CustomerPricingService {
  baseUrl = 'http://localhost:8080/api/';

  postCustomerPricing(customerPricing: CustomerPricing) {
    return this.httpClient.post<CustomerPricing>(this.baseUrl + 'postCustomerDailyPricing', customerPricing);
  }

  getInsideCheckIns(currentDate: any,roomNumber: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getInsideCheckIns/' + currentDate + '/' + roomNumber);
  }

  getCustomerPricing(reservationId: any, roomNumber: any, customers: Customer[]): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'getCustomerPricing/' + reservationId + '/' + roomNumber,customers);
  }

  getNightPricing(reservationId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getNightPricing/' + reservationId);
  }

  getTotalPricingStatistics(year: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getTotalPricingStatistics/' + year);
  }

  getTotalCheckInsStatistics(year: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getTotalCheckInsStatistics/' + year);
  }

  constructor(private httpClient: HttpClient) { }
}
