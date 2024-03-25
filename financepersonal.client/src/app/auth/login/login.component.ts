import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hide: boolean = true;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
    if (this.authService.currentUserSource.value) {
      this.router.navigate(['main/dashboard']);
    };
  }

  login() {
    this.isLoading = true;
    const body = {
      username: this.loginForm.value['username'],
      password: this.loginForm.value['password']
    }
    this.authService.login(body).subscribe(
      (result) => {
        this.isLoading = false;
        // console.log(result);
        this.router.navigate(['main/dashboard']);
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Invalid username or password, Please try again')
      }
    )
  }
}


