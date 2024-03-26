import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserExpense } from '../Models/UserExpense';
import { Expense } from '../Models/expense';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  isAdding: boolean = false;
  private baseUrl = 'https://localhost:7068';
  constructor(private http: HttpClient) { }

  getExpenses(){
    return this.http.get<Expense[]>(`${this.baseUrl}/Expense/expense`);
  }

  getUserExpenses(userId: string, pageNumber:number, pageSize:number) : Observable<any>{
    const params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    return this.http.get<UserExpense[]>(`${this.baseUrl}/Expense/GetCurrentUserExpense?userId=${userId}`, {params});
  }

  toggleAdd(){
    this.isAdding == !this.isAdding;
  }

  AddExpense(body: Expense){
    return this.http.post<any>(`${this.baseUrl}/Expense/AddNewExpense`, body)
  }

  EditExpense(id:number, body: any){
    return this.http.patch<Expense[]>(`${this.baseUrl}/Expense/EditExpense?id=${id}`, body)
  }

  DeleteExpense(id: number){
    return this.http.delete<Expense[]>(`${this.baseUrl}/Expense/DeleteExpense?id=${id}`)
  }

  getMonthlyExpense(userId: string){
    return this.http.get<Expense[]>(`${this.baseUrl}/Expense/GetMonthlyExpense?userId=${userId}`)
  }

  getMonthlyCategoricalExpense(userId: string){
    return this.http.get<Expense[]>(`${this.baseUrl}/Expense/GetMonthwiseCategoricalExpense?userId=${userId}`)
  }

}
