import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnInit{

  private baseUrl = 'https://localhost:7068';
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
}
