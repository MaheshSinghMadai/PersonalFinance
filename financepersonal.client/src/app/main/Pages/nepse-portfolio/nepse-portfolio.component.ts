import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InvestmentService } from '../../Services/investment.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-nepse-portfolio',
  templateUrl: './nepse-portfolio.component.html',
  styleUrl: './nepse-portfolio.component.css'
})
export class NepsePortfolioComponent implements OnInit{
  selectedFile: File | undefined;
  nepseData: any = [];
  isUploadCSV: boolean = false;

  userId: any = this.authService.currentUserSource.value.userId;
  username: any = this.authService.currentUserSource.value.username;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private investmentService: InvestmentService,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.GetNepseData();
  }
 
  GetNepseData(){
    this.investmentService.GetNepsePortfolio(this.userId).subscribe(
      (result) => {
        console.log(result);
        this.nepseData = result;
      },
      error => {
        console.log(error);
      }
    )
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
  }

  uploadCSV(){
    if(!this.selectedFile){
      this.toastr.warning('Please select the file');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.investmentService.uploadCSV(formData, this.username, this.userId).subscribe(
      (result) =>{
        console.log(result);
        this.toastr.success('CSV File Uploaded Successfuly');
        this.GetNepseData();
        this.isUploadCSV = false;
      },
      error => {
        this.toastr.error('Error Uploading CSV File')
      }
    )
  }

  toggleUpload(){
    this.isUploadCSV = !this.isUploadCSV;
    this.selectedFile = null;
  }
}
