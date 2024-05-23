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
  profilePicture: string | ArrayBuffer | null = null;

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
    this.loadProfilePicture();
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('ProfilePicture', file);

      this.profileService
        .changeProfilePicture(this.userId, formData)
        .subscribe({
          next: (res) => {
            this.toastr.success('Profile picture uploaded successfully');
            this.loadProfilePicture();
          },
          error: (err) => {
            console.error('Failed to upload profile picture', err);
          },
        });
    }
  }

  loadProfilePicture(): void {
    this.profileService.getProfilePicture(this.userId).subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.profilePicture = reader.result;
        };
        reader.readAsDataURL(blob);
      },
      error: (err) => {
        this.toastr.error('Failed to load profile picture');
      },
    });
  }

  toggleUpdateProfile() {
    this.updateProfileBoolean = true;
    this.updateProfileForm.enable();
  }

  cancelUpdate(){
    this.updateProfileBoolean = false;
    this.updateProfileForm.disable();
  }
}
