import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInvestments } from '../Models/UserInvestment';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  private baseUrl = 'https://localhost:7068';
  constructor(private http: HttpClient) { }

  getUserInvestments(userId: string){
    return this.http.get<UserInvestments[]>(`${this.baseUrl}/Investment/GetInvestmentList?userId=${userId}`);
  }

  AddIncome(body: UserInvestments){
    return this.http.post<any>(`${this.baseUrl}/Investment/AddNewInvestment`, body)
  }

  GetTotalInvestmentPerUser(userId: string){
    return this.http.get<any>(`${this.baseUrl}/Investment/GetTotalInvestmentPerUser?userId=${userId}`)
  }
}
