import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  availabilityUrl = 'http://localhost:8080/api/availability';
  constructor(private httpClient: HttpClient) { }

  getAvailability(pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.get(this.availabilityUrl + `?page=${pageNumber}&size=${pageSize}`)
  };
  
  getCurrentAvailabilityPage(numberOfRooms: number): Observable<any> {
    console.log(numberOfRooms+" Number of Rooms");
    return this.httpClient.get(`http://localhost:8080/api/getAvailability?numberOfRooms=${numberOfRooms}`);
  };

  getAvailableRooms(selectedCheckInDate: any, selectedCheckOutDate: any, type: any): Observable<any> {
    return this.httpClient.get('http://localhost:8080/api/getAvailabilities/' + selectedCheckInDate + '/' + selectedCheckOutDate + '/' + type);
  };
  }

