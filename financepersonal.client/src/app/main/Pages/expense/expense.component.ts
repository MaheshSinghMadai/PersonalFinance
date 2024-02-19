import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../Services/services/expense.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// class scheduleToAdd {
//   amount : number = '';
//   date : number = '';
//   description : number = '';
//   cate : number = '';
  
// };

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})

export class ExpenseComponent implements OnInit {

  //make an empty list to store expense-api response data
  expenseList :any[] = [];
  userExpenseList : any[] = [];
  addExpenseForm: FormGroup ;
  isAdding : boolean = false;

  constructor(private formBuilder: FormBuilder, private expenseService : ExpenseService) { 

  }
  ngOnInit() {
    this.addExpenseForm = this.formBuilder.group({
      amount: ['', Validators.required],
      Date: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
    })
    this.getUserExpenses();
  }

  getAllExpenses(){
    this.expenseService.getExpenses().subscribe(
      (response)=>{
        this.expenseList = response;
        console.log(this.expenseList);
      },
      error =>{
        console.log(error);
      }
    )
  }

  getUserExpenses(){
    this.expenseService.getUserExpenses().subscribe(
      (response)=>{
        this.userExpenseList = response;
        console.log(this.userExpenseList);
      },
      error =>{
        console.log(error);
      }
    )
  }

  addExpense(){
    
  }
  toggleAdd(){
    this.isAdding =  !this.isAdding;
  }

  clearForm(){
    this.addExpenseForm.reset();
    this.isAdding = false;
  }
}
