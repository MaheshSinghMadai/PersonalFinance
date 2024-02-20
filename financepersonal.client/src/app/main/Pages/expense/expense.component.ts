import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../Services/services/expense.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserExpense } from '../../Models/UserExpense';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})

export class ExpenseComponent implements OnInit {

  //make an empty list to store expense-api response data
  expenseList: any[] = [];
  userExpenseList: any[] = [];
  addExpenseForm: FormGroup;
  isAdding: boolean = false;
  isEditDelete: boolean = false;
  editModal : boolean = false;
  editExpenseList: any[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private expenseService: ExpenseService,
    private toastr: ToastrService) 
    {
      this.addExpenseForm = this.formBuilder.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.getUserExpenses();
  }

  getAllExpenses() {
    this.expenseService.getExpenses().subscribe(
      (response) => {
        this.expenseList = response;
        console.log(this.expenseList);
      },
      error => {
        console.log(error);
      }
    )
  }

  getUserExpenses() {
    this.expenseService.getUserExpenses().subscribe(
      (response) => {
        this.userExpenseList = response;
        console.log(this.userExpenseList);
      },
      error => {
        console.log(error);
      }
    )
  }

  addExpense() {
    const body = {
      amount: this.addExpenseForm.value['amount'],
      date: this.addExpenseForm.value['date'],
      description: this.addExpenseForm.value['description'],
      userId: 1,
      categoryId: this.addExpenseForm.value['category'],
    }
    console.log(body);
    this.expenseService.AddExpense(body).subscribe(
      (response) => {
        console.log(response);
        this.clearForm();
        this.toggleAdd();
        this.getUserExpenses();
      }
    )
  }

  editExpense(item: any) {
      var id= item.ExpenseId;
      var body = [
        {
          op: 'replace',
          path: '/Amount',
          value: item.Amount,
        },
        {
          op: 'replace',
          path: '/Description',
          value: item.Description,
        },
        {
          op: 'replace',
          path: '/Date',
          value: item.Date,
        },
        {
          op: 'replace',
          path: '/CategoryId',
          value: item.CategoryId,
        },
      ];

        this.expenseService.EditExpense(id, body).subscribe(
          (response) => {
            console.log(response);
            this.getUserExpenses();
            this.editModal = false;
          },
          error =>{
            console.log(error);
          }
        )
  }

  deleteExpense(item : UserExpense) {
    var id = item.expenseId;
    this.expenseService.DeleteExpense(id).subscribe(
      (response) => {
        console.log(response);
        this.getUserExpenses();
        this.toastr.success('Deleted Successfuly')
      },
      error =>{
        console.log(error);
      }
    )
  }
  toggleAdd() {
    this.isAdding = !this.isAdding;
  }

  clearForm() {
    this.addExpenseForm.reset();
    this.isAdding = false;
  }

  toggleActions(){
    this.isEditDelete = !this.isEditDelete;
  }

  editModalToggle(){
    this.editModal = !this.editModal;
  }

}
