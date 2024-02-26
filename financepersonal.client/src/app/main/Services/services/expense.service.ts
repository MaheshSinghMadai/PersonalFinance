import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../../Models/expense';
import { UserExpense } from '../../Models/UserExpense';

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

  getUserExpenses(){
    return this.http.get<UserExpense[]>(`${this.baseUrl}/Expense/GetUserExpense`);
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

  clearForm(){

  }
}
