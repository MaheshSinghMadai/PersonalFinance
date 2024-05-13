import { AfterViewInit, Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CategoryService } from '../../Services/category.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ExpenseService } from '../../Services/expense.service';
import { IncomeService } from '../../Services/income.service';
import { InvestmentService } from '../../Services/investment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  public chart: any;
  showFiller = false;
  userId: any = this.authService.currentUserSource.value.userId;
  foodExpenseCount: any = [];
  foodAmount: number;
  chartData: any = [];
  monthlyExpenseList: any = [];
  categoricalMonthlyExpenseList: any = [];
  monthlyTotalAmount: any = [];
  totalExpense: number = 0;
  averageExpense: number = 0;
  totalIncomePerUser: any;
  totalInvestmentPerUser: any;

  //categorical monthly expense array
  foodData: any = [];
  travelData: any = [];
  othersData: any = [];
  miscData: any = [];

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private incomeService: IncomeService,
    private investmentService: InvestmentService
  ) {}
  ngOnInit() {
    this.getCategoricalExpenseCount();
    this.getMonthlyExpense();
    this.getMonthlyCategoricalExpense();
    this.getTotalIncomePerUser();
    this.getTotalInvestmentPerUser();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createBarChart();
      this.createLineChart();
      this.createDoughnutChart();
      this.createPieChart();
    }, 1000);
  }

  createPieChart() {
    var options = {
      cutoutPercentage: 40,
      radius: '60%', // Set the radius of the doughnut chart
    };
    this.chart = new Chart('PieChart', {
      type: 'pie', //this denotes tha type of chart

      data : {
        labels: [
          'Income',
          'Expense',
          'Invested'
        ],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }],  
      },
      options : options,
    });
  }

  createDoughnutChart() {
    var options = {
      cutoutPercentage: 40,
      radius: '60%', // Set the radius of the doughnut chart
    };
    this.chart = new Chart('DoughnutChart', {
      type: 'doughnut',

      data: {
        labels: ['Food', 'Travel', 'Misc', 'Others'],
        datasets: [
          {
            label: '',
            data: this.chartData,
            backgroundColor: ['red', 'blue', 'yellow', 'green'],
            hoverOffset: 4,
          },
        ],
      },
      options: options,
    });
  }

  createBarChart() {
    this.chart = new Chart('BarChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            label: 'Food',
            data: this.foodData,
            backgroundColor: 'blue',
          },
          {
            label: 'Travel',
            data: this.travelData,
            backgroundColor: 'purple',
          },
          {
            label: 'Misc',
            data: this.miscData,
            backgroundColor: 'limegreen',
          },
          {
            label: 'Others',
            data: this.othersData,
            backgroundColor: 'orange',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  createLineChart() {
    this.chart = new Chart('LineChart', {
      type: 'line', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            label: 'Expense Activity',
            data: this.monthlyTotalAmount,
            backgroundColor: 'blue',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  getCategoricalExpenseCount() {
    this.categoryService.getCategoricalExpenseCount(this.userId).subscribe(
      (result) => {
        this.foodExpenseCount = result;
        this.foodExpenseCount.forEach((element) => {
          if (element.totalAmount) {
            this.chartData.push(element.totalAmount);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getMonthlyExpense() {
    this.expenseService.getMonthlyExpense(this.userId).subscribe(
      (result) => {
        this.monthlyExpenseList = result;

        //separating out totalAmounts
        this.monthlyExpenseList.forEach((element) => {
          if (element.totalAmount) {
            this.monthlyTotalAmount.push(element.totalAmount);
          }
        });

        //for total expense
        this.monthlyTotalAmount.forEach((element) => {
          this.totalExpense += element;
        });

        //for getting monthly average
        let n = this.monthlyExpenseList.length;
        this.averageExpense = this.totalExpense / n;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getMonthlyCategoricalExpense() {
    this.expenseService.getMonthlyCategoricalExpense(this.userId).subscribe(
      (result) => {
        // console.log(result);
        this.categoricalMonthlyExpenseList = result;

        //separating out food expense
        this.categoricalMonthlyExpenseList.forEach((element) => {
          if (element.categoryName == 'Food') {
            this.foodData.push(element.totalAmount);
          }
        });

        //separating out travel expense
        this.categoricalMonthlyExpenseList.forEach((element) => {
          if (element.categoryName == 'Travel') {
            this.travelData.push(element.totalAmount);
          }
        });

        //separating out misc expense
        this.categoricalMonthlyExpenseList.forEach((element) => {
          if (element.categoryName == 'Others') {
            this.othersData.push(element.totalAmount);
          }
        });

        //separating out others expense
        this.categoricalMonthlyExpenseList.forEach((element) => {
          if (element.categoryName == 'Misc') {
            this.miscData.push(element.totalAmount);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTotalIncomePerUser() {
    this.incomeService.GetTotalIncomePerUser(this.userId).subscribe(
      (result) => {
        this.totalIncomePerUser = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTotalInvestmentPerUser() {
    this.investmentService.GetTotalInvestmentPerUser(this.userId).subscribe(
      (result) => {
        this.totalInvestmentPerUser = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
