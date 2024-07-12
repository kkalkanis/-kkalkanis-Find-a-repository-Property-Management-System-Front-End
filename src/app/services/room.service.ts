import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Room } from '../classes/room';
import { TypeRooms } from '../classes/type-rooms';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
 
  
  constructor(private httpClient: HttpClient) { }  
  baseUrl = 'http://localhost:8080/api/rooms';
  getRooms(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }

  getRoomsByType(type: String): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/api/roomsByType/${type}`);
  }

  async getRoomsAsync(): Promise<any> {
    return await this.httpClient.get<any>(this.baseUrl).toPromise();
  }

  getPaginatedRooms(pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `/pagination?page=${pageNumber}&size=${pageSize}`)
  };

  deleteRoom(delRoomNumber: number) {
    return this.httpClient.delete<any>(this.baseUrl + "/" + delRoomNumber)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  updateRoom(data: any) {
    console.log(data);
    return this.httpClient.put<any>(this.baseUrl ,data)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  postRoom(data: any) {
    console.log(data.type);
    return this.httpClient.post<any>('http://localhost:8080/api/setRoom', data)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}