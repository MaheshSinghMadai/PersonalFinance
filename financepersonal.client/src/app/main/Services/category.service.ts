import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnInit{

  private baseUrl = 'https://localhost:7068';
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  getCategoricalExpense(userId: number){
    return this.http.get(`${this.baseUrl}/Category/GetCategorywiseExpense?userId=${userId}`)
  }
}
