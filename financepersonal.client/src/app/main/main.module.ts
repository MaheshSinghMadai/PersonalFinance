import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './Pages/expense/expense.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';



@NgModule({
  declarations: [
    ExpenseComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainModule { }
