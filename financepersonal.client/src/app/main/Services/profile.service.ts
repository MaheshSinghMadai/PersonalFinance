import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = 'https://localhost:7068';
  
  constructor(private http: HttpClient) { }

  getUserCredentials(userId: string){
    return this.http.get<any>(`${this.baseUrl}/Profile/GetUserCredentials?userId=${userId}`);
  }

  updateProfile(body:any, userId: string){
    return this.http.put<any>(`${this.baseUrl}/Profile/UpdateProfile?userId=${userId}`, body)
  }

  updatePassword(body:any, userId: string){
    return this.http.put<any>(`${this.baseUrl}/Profile/ChangePassword?userId=${userId}`, body)
  }
}
