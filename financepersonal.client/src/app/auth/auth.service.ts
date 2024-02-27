import { Injectable, OnInit } from '@angular/core';
import { User } from './model/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7068';
  public currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient, private router: Router) { 
      let user = localStorage.getItem('user');
      if(user){
        const returnUser : User = JSON.parse(user);
        this.currentUserSource.next(returnUser);
      }
  }

  public getCurrentUserValue(){
    return this.currentUserSource.value;
  }

  login(body: any){
    return this.http.post<any>(`${this.baseUrl}/Account/Login`, body).pipe(
      map((user:User) =>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }
  
  logout(){
    localStorage.clear();
    this.currentUserSource.next(null);
    this.router.navigate(['/']);
  }

  //for interceptor
  getToken(){
    return localStorage.getItem('token');
  }
 
}
