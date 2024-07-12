import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TourOperator } from '../classes/tour-operator';

@Injectable({
  providedIn: 'root'
})
export class TourOperatorService {
  private baseUrl = 'http://localhost:8080/api';

  getTourOperators(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/getTourOperators');
  }
  deleteOperator(tourOperatorId: any) {
    return this.httpClient.delete<any>(this.baseUrl + "/deleteTourOperator/" + tourOperatorId)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  postTourOperator(tourOperator: TourOperator) {
    return this.httpClient.post<TourOperator>(this.baseUrl + '/saveTourOperator', tourOperator);
  }

  updateTourOperator(tourOperator: any) {
    return this.httpClient.put<any>(this.baseUrl + '/updateTourOperator', tourOperator)
      .pipe(map((res: any) => {
        return res;
      }));
  }


  constructor(private httpClient: HttpClient) { }
}
