import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  changePassword(body:any, userId: string){
    return this.http.put<any>(`${this.baseUrl}/Profile/ChangePassword?userId=${userId}`, body)
  }

  getProfilePicture(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Profile/GetProfilePicture?userId=${userId}`);
  }
  
  changeProfilePicture(file: File, httpOptions :any, userId: string) : Observable<any>{
    const formData = new FormData;
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/Profile/ChangeProfilePicture?userId=${userId}`, formData, httpOptions)
  }
}
