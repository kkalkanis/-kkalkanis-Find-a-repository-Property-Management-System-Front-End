import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelSpecificsService {

  constructor(private httpClient: HttpClient) { }
  baseUrl = 'http://localhost:8080/api';

  getHotelSpecifics(): Observable<any> {
    return this.httpClient.get(this.baseUrl+'/getHotelSpecifics');
  }

  postHotelSpecifics(data: any) {
    return this.httpClient.post<any>(this.baseUrl +'/setHotelSpecifics', data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateReceiptNumber(): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/updateReceiptNumber');
  }

}
