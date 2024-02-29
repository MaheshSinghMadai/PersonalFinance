import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'https://localhost:7068';
  
  constructor(private http: HttpClient) { }

  getCategoricalExpense(userId: number){
    return this.http.get(`${this.baseUrl}/Category/GetCategorywiseExpense?userId=${userId}`);
  }

  getCategories(){
    return this.http.get(`${this.baseUrl}/Category/GetCategoriesList`);
  }
}
