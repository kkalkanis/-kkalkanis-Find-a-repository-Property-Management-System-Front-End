import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckOutOperatorService {

  private baseUrl = 'http://localhost:8080/api';

  getTourOperatorCredit(tourOperatorName:any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/getTourOperatorCredit' + '/' + tourOperatorName);
  }

  updateTourOperatorCredit(tourOperatorName: string, creditPrice: number) {
    return this.httpClient.put<any>(this.baseUrl + "/updateTourOperatorCredit/" + creditPrice , tourOperatorName)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  constructor(private httpClient: HttpClient) { }
}
