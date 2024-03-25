import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './Pages/expense/expense.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { CategoriesComponent } from './Pages/categories/categories.component';
import { IncomeComponent } from './Pages/income/income.component';
import { InvestmentComponent } from './Pages/investment/investment.component';
import { NepsePortfolioComponent } from './Pages/nepse-portfolio/nepse-portfolio.component';

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
  {
    path: 'income',  
    component: IncomeComponent,
  },
  {
    path: 'investment',  
    component: InvestmentComponent,
  },
  {
    path: 'nepse-portfolio',  
    component: NepsePortfolioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
