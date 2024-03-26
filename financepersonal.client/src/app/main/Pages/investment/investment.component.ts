import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { InvestmentService } from '../../Services/investment.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrl: './investment.component.css'
})
export class InvestmentComponent implements OnInit{

  investmentList: any[] = [];
  isAdding: boolean = false;
  investmentForm: FormGroup;
  isEditDelete: any;
  isLoading: boolean = false;

  userId: any = this.authService.currentUserSource.value.userId;
  username: any = this.authService.currentUserSource.value.username;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private investmentService: InvestmentService) {
    this.investmentForm = this.formBuilder.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
    })
  }
  
  ngOnInit(){
    this.getUserInvestments();
  }

  getUserInvestments() {
    this.isLoading = true;
    this.investmentService.getUserInvestments(this.userId).subscribe(
      (response) => {
        this.isLoading = false;
        this.investmentList = response;
        // console.log(this.investmentList);
      },
      error => {
        this.isLoading = false;
        console.log(error);
      }
    )
  }

  addInvestment() {
    this.isAdding = true;

    const body = {
      amount: this.investmentForm.value['amount'],
      date: this.investmentForm.value['date'],
      description: this.investmentForm.value['description'],
      userId: this.userId,
      userName: this.username
    }

    this.investmentService.AddIncome(body).subscribe(
      (response) => {
        // console.log(response); 
        this.toastr.success('Income Added Successfully!!');
        this.clearForm();
        this.toggleAdd();
        this.getUserInvestments();
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
    this.investmentForm.reset();
    this.isAdding = false;
  }

  toggleActions() {}

  deleteExpense() {}
  editModalToggle() {}

}

