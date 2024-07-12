import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeAvailabilityService {

  constructor(private httpClient: HttpClient) { }

  getTypeAvailability(pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/api/getTypeAvailability?page=${pageNumber}&size=${pageSize}`);
  }
  getAvailableTypesByDate(selectedCheckInDate: any, selectedCheckOutDate: any) {
    return this.httpClient.get<any>('http://localhost:8080/api/getTypeAvailabilityByDate/' + selectedCheckInDate + '/' + selectedCheckOutDate);
  }
}
