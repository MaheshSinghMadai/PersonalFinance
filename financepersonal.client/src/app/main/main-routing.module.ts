import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './Pages/expense/expense.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { CategoriesComponent } from './Pages/categories/categories.component';

const routes: Routes = [
  {
    path: 'dashboard',  
    component: DashboardComponent,
  },

  {
    path: 'expense',  
    component: ExpenseComponent,
  },
  {
    path: 'categories',  
    component: CategoriesComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
