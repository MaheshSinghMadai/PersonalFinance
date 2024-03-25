import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserExpense } from '../../Models/UserExpense';
import { ToastrService } from 'ngx-toastr';
import { Expense } from '../../Models/expense';
import { DatePipe } from '@angular/common';
import { ExpenseService } from '../../Services/expense.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CategoryService } from '../../Services/category.service';
import { HttpClient } from '@angular/common/http';

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

  Categories: any;
  selectedCategory: any;

  addExpenseForm: FormGroup;
  isAdding: boolean = false;
  isEditDelete: boolean = false;
  editModal: boolean = false;
  isLoading : boolean = false;

  userId: any = this.authService.currentUserSource.value.userId;
  username: any = this.authService.currentUserSource.value.username;

  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private categoryService: CategoryService,
    private http: HttpClient) 
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
    this.getCategories();
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
    this.isLoading = true;
    this.isAdding = false;
    this.expenseService.getUserExpenses(this.userId).subscribe(
      (response) => {
        this.isLoading = false;
        this.userExpenseList = response;
        // console.log(this.userExpenseList);
      },
      error => {
        this.isLoading = false;
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
      username: this.username,
      categoryId: this.addExpenseForm.value['category'] as number,
    }
    // console.log(body);
    this.expenseService.AddExpense(body).subscribe(
      (response) => {
        // console.log(response); 
        this.isAdding = false;
        this.toastr.success('Expense Added Successfully!!');
        this.clearForm();
        this.selectedCategory = '';
        this.toggleAdd();
        this.getUserExpenses();
      },
      error => {
        this.isAdding = false;
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

    // console.log(body);
    this.expenseService.EditExpense(id, body).subscribe(
      (response) => {
        // console.log(response);
        this.getUserExpenses();
        this.editModal = false;
        this.toastr.success('Edited Successfully')
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteExpense(item: UserExpense) {
    var id = item.expenseId;
    this.expenseService.DeleteExpense(id).subscribe(
      (response) => {
        // console.log(response);
        this.getUserExpenses();
        this.toastr.success('Deleted Successfuly')
      },
      error => {
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
  toggleActions() {
    this.isEditDelete = !this.isEditDelete;
  }

  editModalToggle(item: Expense) {
    this.selectedExpense = { ...item };
    this.selectedExpense['date'] = this.datePipe.transform(this.selectedExpense['date'], 'yyyy-MM-dd');
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (result) => {
        this.Categories = result;
        // console.log(this.Categories);
      },
      error => {
        this.toastr.warning(error);
      }
    )
  }

  exportToExcel(): void {
    this.http.get(`https://localhost:7068/Expense/ExportToExcel?userId=${this.userId}`,{responseType:'blob'}).subscribe((blob: Blob) => {
      // Create a blob URL for the Excel file
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;

      // Specify the file name for the download
      a.download = 'expenses.xlsx';

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
