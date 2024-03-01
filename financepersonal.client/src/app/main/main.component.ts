import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import IdleTimer from "../main/idle-timer.js";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  timer = IdleTimer;

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {
    if (localStorage.getItem("token")) {
      this.idleTime();
      this.refreshTokenTimer();
    }
  }
  refreshTokenTimer() {
    this.authService.startRefreshTokenTimer()
  }

  idleTime() {
    this.timer = new IdleTimer({
      timeout: 180, //expired after 40 min
      onTimeout: () => {
        this.authService.logout()
        this.timer.cleanUp();
        alert("You have been logged out for being inactive")
        const returnModule = location.hash.substring(2);
        this.router.navigate(['/'], { queryParams: { returnUrl: returnModule } });
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

