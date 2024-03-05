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
      if (user.expiresAt) {
        let expiry_Date = new Date(user.expiresAt);
        let current_Date = new Date();
        if (expiry_Date > current_Date) {
          return true;
        } else {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      }

    }
    this.router.navigate(['/']);
    return false;
  }
}
