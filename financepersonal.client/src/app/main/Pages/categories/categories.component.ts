import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{

  categoricalExpense : any = [];
  categoricalExpenseCount : any = [];
  category: string;
  userId : any = this.authService.currentUserSource.value?.userId;
  viewTable : boolean = false;

  constructor(private categoryService: CategoryService, private authService: AuthService){}
  
  ngOnInit() {
    this.getCategoricalExpense(this.category);
    this.getCategoricalExpenseCount();
  }

  getCategoricalExpense(category: string){
    console.log(category);
    this.categoryService.getCategoricalExpense(this.userId, category).subscribe(
      (result) => {
        console.log(result);
        this.categoricalExpense = result;
      },
      error => {
        // console.log(error);
      }
    ); 
  }
  
  getCategoricalExpenseCount(){
    this.categoryService.getCategoricalExpenseCount(this.userId).subscribe(
      (result) => {
        this.categoricalExpenseCount = result;
        // console.log(this.categoricalExpenseCount);
      },
      error => {
        // console.log(error);
      }
    ); 
  }

  toggleTable(){
    this.viewTable = true;
  }
}
