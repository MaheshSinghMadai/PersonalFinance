import {  CanActivate,  Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}
  
  canActivate(): boolean {
    var user = this.authService.currentUserSource.value;
    if (user) {
      return true;
    }else{
      this.router.navigate(['/']);
      return false;
    }
    
  }
}
  
