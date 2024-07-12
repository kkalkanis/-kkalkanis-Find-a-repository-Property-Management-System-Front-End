import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../classes/customer';
import { Reservation } from '../classes/reservation';
import { map } from 'rxjs';
import { ReservationType } from '../classes/reservation-type';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  baseUrl = 'http://localhost:8080/api/';
 

  postReservation(reservation: Reservation) {
    return this.httpClient.post<Reservation>(this.baseUrl + 'saveReservation', reservation);
  }

  postReservationType(reservationType: ReservationType) {
    return this.httpClient.post<ReservationType>(this.baseUrl + 'postReservationType', reservationType);
  }

  deleteReservationType(reservationTypeId: any) {
    return this.httpClient.delete<any>(this.baseUrl + "deleteReservationType/" + reservationTypeId)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteReservation(delResNumber: number) {
    return this.httpClient.delete<any>(this.baseUrl + "delReservation/" + delResNumber)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getSpecificReservation(reservationId: any):Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getReservationByReservationId/' + reservationId);
  }

  getSpecificReservationType(reservationTypeId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getSpecificReservationType/' + reservationTypeId);
  }

  getReservationTypes(reservationId: any): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl + 'getReservationTypes/' + reservationId);
  }

  getInReservations(date:any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'getInReservations/' + date);
  }


  getPaginatedReservations(pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `reservations?page=${pageNumber}&size=${pageSize}`)
  };

  updateReservation(data: any) {
    return this.httpClient.put<any>(this.baseUrl +"updateReservation", data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateReservationType(data: any) {
    return this.httpClient.put<any>(this.baseUrl + "updateReservationType/", data)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  constructor(private httpClient: HttpClient) { }
}
