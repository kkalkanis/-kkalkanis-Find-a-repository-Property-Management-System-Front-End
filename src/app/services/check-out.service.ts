import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {
  baseUrl = 'http://localhost:8080/api/';

  getDepartures(date: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getDepartures/' + date);
  }

  getDepartureRoomsByType(reservationTypeId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getDepartureRoomsByType/' + reservationTypeId);
  }

  getSelfPricingTotal(reservationId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getSelfPricingTotal/' + reservationId);
  }

  updateSelfPricing(reservation:any) {
    return this.httpClient.put<any>(this.baseUrl + "updateSelfPricing" , reservation)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  constructor(private httpClient: HttpClient) { }
}
