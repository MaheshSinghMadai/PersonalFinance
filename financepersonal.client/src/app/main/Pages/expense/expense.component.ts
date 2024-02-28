import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserExpense } from '../../Models/UserExpense';
import { ToastrService } from 'ngx-toastr';
import { Expense } from '../../Models/expense';
import { DatePipe } from '@angular/common';
import { ExpenseService } from '../../Services/expense.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})

export class ExpenseComponent implements OnInit {

  expenseList: any[] = [];
  userExpenseList: any[] = [];
  selectedExpense: any = {};
  editedExpense: any = {};
  expenditureDate: any;

  Categories = [
    {categoryId: 1, categoryName: 'Food'},
    {categoryId: 2, categoryName: 'Travel'},
    {categoryId: 3, categoryName: 'Misc'},
    {categoryId: 4, categoryName: 'Others'},
  ];
  selectedCategory: any;

  addExpenseForm: FormGroup;
  isAdding: boolean = false;
  isEditDelete: boolean = false;
  editModal : boolean = false;

  userId : any = this.authService.currentUserSource.value.userId;
  username : any = this.authService.currentUserSource.value.username;

  constructor(
    private formBuilder: FormBuilder, 
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private authService: AuthService) 
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
      },
      error => {
        console.log(error);
      }
    )
  }

  getUserExpenses() {
    this.expenseService.getUserExpenses(this.userId, this.username).subscribe(
      (response) => {
        console.log(this.username)
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
      userId: this.userId,
      categoryId: this.selectedCategory.categoryId,
    }
    console.log(body);
    this.expenseService.AddExpense( body).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success('Expense Added Successfully!!');
        this.clearForm();
        this.selectedCategory = '';
        this.toggleAdd();
        this.getUserExpenses();
      },
      error => {
        console.log(error);
      }
    )
  }

  editExpense() {
    const id = this.selectedExpense['expenseId'];
    var body = [
      {
        op: 'replace',
        path: '/Amount',
        value: this.selectedExpense['amount'],
      },
      {
        op: 'replace',
        path: '/Description',
        value: this.selectedExpense['description'],
      },
      {
        op: 'replace',
        path: '/Date',
        value: this.selectedExpense['date'],
      },
      {
        op: 'replace',
        path: '/CategoryId',
        value: this.selectedExpense['categoryId'],
      },
    ];

    console.log(body);
    this.expenseService.EditExpense(id, body).subscribe(
      (response) => {
        console.log(response);
        this.getUserExpenses();
        this.editModal = false;
        this.toastr.success('Edited Successfully')
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteExpense(item : UserExpense) {
    var id = item.expenseId;
    this.expenseService.DeleteExpense(id).subscribe(
      (response) => {
        // console.log(response);
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

  //for edit and delete buttons inside table
  toggleActions(){
    this.isEditDelete = !this.isEditDelete;
  }

  editModalToggle(item: Expense){
    console.log('modal toggled');
    this.selectedExpense = { ...item };
    this.selectedExpense['date'] = this.datePipe.transform(this.selectedExpense['date'] , 'yyyy-MM-dd');
    console.log(this.selectedExpense);
  }
}
