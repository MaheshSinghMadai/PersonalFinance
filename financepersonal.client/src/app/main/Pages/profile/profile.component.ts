import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  selectedFile: File | null = null;

  userId: any = this.authService.currentUserSource.value.userId;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private profileService: ProfileService
  ) {
    this.updateProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
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

  changePassword() {
    const body = {
      currentPassword: this.changePasswordForm.value['currentPassword'],
      newPassword: this.changePasswordForm.value['newPassword'],
    };

    this.profileService.changePassword(body, this.userId).subscribe(
      (response) => {
        this.toastr.success('Password Changed Successfully!!');
        this.changePasswordForm.reset();
        this.getProfileCredentials();
      },
      (error) => {
        console.log(error.error);
        this.toastr.error(error.description);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    
  }

  toggleUpdateProfile() {
    this.updateProfileBoolean = true;
    this.updateProfileForm.enable();
  }
}
