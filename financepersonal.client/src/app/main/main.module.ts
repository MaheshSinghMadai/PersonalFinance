import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExpenseComponent } from './Pages/expense/expense.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { CategoriesComponent } from './Pages/categories/categories.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { IncomeComponent } from './Pages/income/income.component';
import { InvestmentComponent } from './Pages/investment/investment.component';
import { SharedModule } from '../shared/shared.module';
import { NepsePortfolioComponent } from './Pages/nepse-portfolio/nepse-portfolio.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        ExpenseComponent,
        DashboardComponent,
        CategoriesComponent,
        IncomeComponent,
        InvestmentComponent,
        NepsePortfolioComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MainRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxDocViewerModule,
        FormsModule,
        DatePipe,
        NgSelectModule
    ]
})
export class MainModule { }
