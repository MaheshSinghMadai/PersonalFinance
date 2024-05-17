import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../Services/profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  updateProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  userCredentials: any = [];
  updateProfileBoolean: boolean = false;
  isEditable: boolean = true;

  userId: any = this.authService.currentUserSource.value.userId;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private profileService: ProfileService,
    private http: HttpClient
  ) {
    this.updateProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      // profilePicture: [''],
    });

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.updateProfileForm.disable();
    this.getProfileCredentials();
  }

  getProfileCredentials() {
    this.profileService
      .getUserCredentials(this.userId)
      .subscribe((response) => {
        this.userCredentials = response;
      });
  }

  updateProfile() {
    const body = {
      firstName: this.updateProfileForm.value['firstName'],
      lastName: this.updateProfileForm.value['lastName'],
      username: this.updateProfileForm.value['username'],
      email: this.updateProfileForm.value['email'],
    };

    this.profileService.updateProfile(body, this.userId).subscribe(
      (response) => {
        this.toastr.success('Profile Updated Successfully!!');
        this.updateProfileForm.reset();
        this.updateProfileBoolean = false;
        this.updateProfileForm.disable();
        this.getProfileCredentials();

      },
      (error) => {
        console.log(error.error);
        this.toastr.error(error.description);
      }
    );
  }

  ChangePassword() {
    const body = {
      currentPassword: this.changePasswordForm.value['currentPassword'],
      newPassword: this.changePasswordForm.value['newPassword'],
    };


    this.profileService.changePassword(body, this.userId).subscribe(
      (response) => {
        this.toastr.success('Password Changed Successfully!!');
        this.changePasswordForm.reset();
        // this.updatePasswordBoolean = false;
        // this.updateProfileForm.disable();
        this.getProfileCredentials();

      },
      (error) => {
        console.log(error.error);
        this.toastr.error(error.description);
      }
    );
  }

  toggleUpdateProfile() {
    this.updateProfileBoolean = true;
    this.updateProfileForm.enable();
  }
}
