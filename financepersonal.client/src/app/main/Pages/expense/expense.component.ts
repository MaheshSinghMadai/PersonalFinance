import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../Services/services/expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  //make an empty list to store expense-api response data
  expenseList :any[] = [];
  userExpenseList : any[] = []

  constructor(private expenseService : ExpenseService) { }
  ngOnInit() {
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
}
