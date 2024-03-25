import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { IncomeService } from '../../Services/income.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit{

  incomesList: any[] = [];
  isAdding: boolean = false;
  incomeForm: FormGroup;
  isEditDelete: any;
  isLoading: boolean = false;

  userId: any = this.authService.currentUserSource.value.userId;
  username: any = this.authService.currentUserSource.value.username;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private incomeService: IncomeService,
    private http: HttpClient) 
    {
    this.incomeForm = this.formBuilder.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      source: ['', Validators.required],
    })
  }
  
  ngOnInit(){
    this.getUserIncomes();
  }

  getUserIncomes() {
    this.isLoading = true;
    this.incomeService.getUserIncomes(this.userId).subscribe(
      (response) => {
        this.isLoading = false
        this.incomesList = response;
        // console.log(this.incomesList);
      },
      error => {
        this.isLoading = false;
        console.log(error);
      }
    )
  }

  addIncome() {
    this.isAdding = true;

    const body = {
      amount: this.incomeForm.value['amount'],
      date: this.incomeForm.value['date'],
      source: this.incomeForm.value['source'],
      userId: this.userId,
      userName: this.username
    }

    this.incomeService.AddIncome(body).subscribe(
      (response) => {
        // console.log(response); 
        this.toastr.success('Income Added Successfully!!');
        this.clearForm();
        this.toggleAdd();
        this.getUserIncomes();
        this.isAdding = false;
      },
      error => {
        this.isAdding = false;
        console.log(error);
      }
    )
  }

  toggleAdd() {
    this.isAdding = !this.isAdding;
  }

  clearForm(){
    this.incomeForm.reset();
    this.isAdding = false;
  }

  toggleActions() {}

  deleteExpense() {}
  editModalToggle() {}

  exportToExcel(): void {
    this.http.get('https://localhost:7068/Income/ExportToExcel',{responseType:'blob'}).subscribe((blob: Blob) => {
      // Create a blob URL for the Excel file
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;

      // Specify the file name for the download
      a.download = 'incomes.xlsx';

      // Trigger a click event on the anchor element to start the download
      document.body.appendChild(a);
      a.click();

      // Clean up: remove the anchor element and release the blob URL
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Failed to export data to Excel:', error);
    });
  }

}
