import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './Pages/expense/expense.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { CategoriesComponent } from './Pages/categories/categories.component';
import { MaterialModule } from '../shared/material.module';


@NgModule({
  declarations: [
    ExpenseComponent,
    DashboardComponent,
    CategoriesComponent,

  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule
  ]
})
export class MainModule { }
