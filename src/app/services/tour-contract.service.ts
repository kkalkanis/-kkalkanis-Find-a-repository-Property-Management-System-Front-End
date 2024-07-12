import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RoomTypeContract } from '../classes/room-type-contract';
import { TourContract } from '../classes/tour-contract';
import { TypeRooms } from '../classes/type-rooms';

@Injectable({
  providedIn: 'root'
})
export class TourContractService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) { }

  getPaginatedContracts(pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `/contracts?page=${pageNumber}&size=${pageSize}`);
  }

  postContract(contract: TourContract) {
    return this.httpClient.post<TourContract>(this.baseUrl + '/saveContract', contract);
  }

  deleteContract(delCnt: any) {
    return this.httpClient.delete<any>(this.baseUrl + "/delContract/" + delCnt)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateContract(data: any) {
    return this.httpClient.put<any>(this.baseUrl+'/'+'updateContract', data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  postRoomTypeContract(contractRoomType: RoomTypeContract) {
    return this.httpClient.post<RoomTypeContract>(this.baseUrl + '/saveRoomTypeContract', contractRoomType);
  }

  getContractRoomTypes(contractId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/getContractRoomTypes?contractId=' + contractId);
  }

  deleteContractRoomType(delCnt: any) {
    return this.httpClient.delete<any>(this.baseUrl + "/delContractRoomType/" + delCnt)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateRoomTypeContract(data: RoomTypeContract) {
    return this.httpClient.put<any>(this.baseUrl+'/' + 'updateRoomTypeContract/', data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

}

