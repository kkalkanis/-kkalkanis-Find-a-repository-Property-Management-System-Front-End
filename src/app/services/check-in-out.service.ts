import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { Reservation } from '../classes/reservation';
import { map } from 'rxjs';
import { ReservationType } from '../classes/reservation-type';
import { CheckIn } from '../classes/check-in';
@Injectable({
  providedIn: 'root'
})
export class CheckInOutService {
  baseUrl = 'http://localhost:8080/api/';

  getArrivals(currentDate: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getArrivals/' + currentDate);
  }

  getResponseDailyChargeExist(date: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getResponseDailyChargeExist/' + date);
  }

  getReservationTypeCheckIns(reservationTypeId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getReservationTypeCheckIns/'+ reservationTypeId);
  }

  postDayCharge(currentDate: any) {
    return this.httpClient.post<string>(this.baseUrl + 'postDayCharge',currentDate);
  }

  postCheckInReservationType(checkIn: CheckIn) {
    return this.httpClient.post<Reservation>(this.baseUrl + 'postCheckIn', checkIn);
  }

  getAvailabilitiesByRoomAndDate(date: any, roomNumber: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getAvailabilitiesByRoomAndDate/' + date + '/' + roomNumber);
  }

  isReservationTypesFulfilled(reservationId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'isReservationTypesFulfilled/' + reservationId);
  }


  constructor(private httpClient: HttpClient) { }
}
