import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { IncomeService } from '../../Services/income.service';

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

  userId: any = this.authService.currentUserSource.value.userId;
  username: any = this.authService.currentUserSource.value.username;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private incomeService: IncomeService) {
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
    this.incomeService.getUserIncomes(this.userId).subscribe(
      (response) => {
        this.incomesList = response;
        console.log(this.incomesList);
      },
      error => {
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
    }

    this.incomeService.AddIncome(body).subscribe(
      (response) => {
        console.log(response); 
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

}
