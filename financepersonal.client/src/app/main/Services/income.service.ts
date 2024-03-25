import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserIncome } from '../Models/UserIncome';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  private baseUrl = 'https://localhost:7068';
  constructor(private http: HttpClient) { }

  getUserIncomes(userId: string){
    return this.http.get<UserIncome[]>(`${this.baseUrl}/Income/GetIncomesList?userId=${userId}`);
  }

  AddIncome(body: UserIncome){
    return this.http.post<any>(`${this.baseUrl}/Income/AddNewIncome`, body)
  }

  GetTotalIncomePerUser(userId: string){
    return this.http.get<any>(`${this.baseUrl}/Income/GetTotalIncomePerUser?userId=${userId}`)
  }
}
