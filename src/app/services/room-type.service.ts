import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TypeRooms } from '../classes/type-rooms';


@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {
  private baseUrl = 'http://localhost:8080/api/roomTypes';
  constructor(private httpClient: HttpClient) { }

    getRoomTypes(): Observable<any> {
      return this.httpClient.get(this.baseUrl);
    }
  getReservationRoomTypes(currentReservationId: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/getReservationRoomTypes/' + currentReservationId);
  }

  getSpecificType(typeName: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/getSpecificType/' + typeName);
  }

  getPaginatedRoomTypes(pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `/pagination?page=${pageNumber}&size=${pageSize}`);
    }


   postType(data: any) {
     return this.httpClient.post<any>(this.baseUrl, data)
       .pipe(map((res: any) => {
         return res;
       }));
  }
  updateType(data: any, id: number) {
    console.log(data);
    return this.httpClient.put<any>(this.baseUrl+"/"+id, data)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  deleteType(delType: string) {
    return this.httpClient.delete<any>(this.baseUrl + "/" + delType)
      .pipe(map((res: any) => {
        return res;
      }));
  }

}