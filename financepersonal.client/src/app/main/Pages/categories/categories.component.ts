import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{

  foodExpenseCount : any = [];
  userId : any = this.authService.currentUserSource.value?.userId;

  constructor(private categoryService: CategoryService, private authService: AuthService){}
  
  ngOnInit() {
    this.getCategoricalExpense();
  }
  
  getCategoricalExpense(){
    this.categoryService.getCategoricalExpense(this.userId).subscribe(
      (result) => {
        // console.log(result);
        this.foodExpenseCount = result;
      }
    ); 
  }
}
