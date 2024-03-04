import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import * as google from 'google-one-tap';

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
    private router: Router,
    private ngZone: NgZone) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
    if (this.authService.currentUserSource.value) {
      this.router.navigate(['main/dashboard']);
    };
    // Cast window to the custom window type
    const customWindow = window as CustomWindow;

    customWindow.onGoogleLibraryLoad = () => {
      if (google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: "201032301966-bko3u9e1250n934fclh6rjqfefhc11l4.apps.googleusercontent.com",
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        google.accounts.id.renderButton(
          document.getElementById("buttonDiv"), {
          theme: "outline", size: "large"
        }
        );
        google.accounts.id.prompt((Notification: PromptMomentNotification) => { });
      };
    }
  }

  async handleCredentialResponse(response: CredentialResponse) {
    await this.authService.loginWithGoogle(response.credential).subscribe(
      (response) => {
        console.log(response);
        localStorage.setItem("token", response.token);
        this.router.navigate['/main/dashboard'];
      },
      error => {
        console.log(error);
      }
    )
  }


  login() {
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

interface CustomWindow extends Window {
  onGoogleLibraryLoad?: () => void;
}

