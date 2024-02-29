import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  registrationForm: FormGroup;
  hide : boolean = true;
  isLoading : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router : Router) 
    {
    this.registrationForm = this.formBuilder.group({
      firstname:['', Validators.required],
      lastname: ['', Validators.required],
      username:['', Validators.required],
      email:['', Validators.required],
      password: ['', Validators.required]
    })
   }

  ngOnInit() {
    if(this.authService.currentUserSource.value) {
      this.router.navigate(['main/dashboard']);
    }
  }

  register(){
     this.authService.register(this.registrationForm.value).subscribe(
      (result) => {
        this.isLoading = false;
        // console.log(result);
        this.router.navigate(["/"]);
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Registration failed, Please try again!')
      }
      )

  }
}

