import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import IdleTimer from "../main/idle-timer.js";
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  timer = IdleTimer;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}

