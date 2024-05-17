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
  public chart: any = null;
  showFiller = false;
  userId: any = this.authService.currentUserSource.value.userId;
  foodExpenseCount: any = [];
  foodAmount: number;
  chartData: any = [];

  monthlyExpenseList: any = [];
  monthlyIncomeList: any = [];
  categoricalMonthlyExpenseList: any = [];
  monthlyInvestmentList: any = [];
  monthlyCategoricalIncomeList: any = [];

  monthlyTotalAmount: any = [];
  totalExpense: number = 0;
  averageExpense: number = 0;
  totalIncomePerUser: any;
  totalInvestmentPerUser: any;

  latestMonthIncome: number = 0;
  penultimateMonthIncome: number = 0;
  latestMonthExpense: number = 0;
  penultimateMonthExpense: number = 0;
  lastMonthInvestment: number = 0;
  penultimateMonthInvestment: number = 0;
  lastMonthSalaryIncome: number = 0;
  lastMonthRentalIncome: number = 0;

  incomeChange: number = 0;
  expenseChange: number = 0;
  increaseIncomeBoolean: boolean = false;
  increaseExpenseBoolean: boolean = false;

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
    this.getMonthWiseIncome();
    this.createIncomeExpenseLineChart();
    this.getCategoricalMonthWiseIncome();
  }

  ngAfterViewInit() {
    this.chart.destroy();
    setTimeout(() => {
      this.createBarChart();
      // this.createLineChart();
      this.createDoughnutChart();
      this.createPieChart();
      this.createIncomeExpenseLineChart();
    }, 1000);
  }

  createPieChart() {
    var options = {
      cutoutPercentage: 40,
      radius: '60%', // Set the radius of the pie chart
    };
    this.chart = new Chart('PieChart', {
      type: 'pie', //this denotes tha type of chart

      data: {
        labels: ['Salary Income', 'Rental Income'],
        datasets: [
          {
            data: [this.lastMonthSalaryIncome, this.lastMonthRentalIncome],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
            hoverOffset: 4,
          },
        ],
      },
      options: options,
    });
  }

  createDoughnutChart() {
    var options = {
      cutoutPercentage: 40,
      radius: '60%', // Set the radius of the doughnut chart
      // plugins: {
      //   title: {
      //     display: true,
      //     text: 'Categorywise Expense',
      //   },
      // },
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

  createIncomeExpenseLineChart() {
    const incomeData = this.monthlyIncomeList;
    const expenseData = this.monthlyExpenseList;

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const labels = incomeData.map((data) => monthNames[data.date - 1]);

    const incomeAmounts = incomeData.map((data) => data.totalAmount);
    const expenseAmounts = expenseData.map((data) => data.totalAmount);

    this.chart = new Chart('IncomeExpenseLineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: incomeAmounts,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 1)',
            yAxisID: 'y-axis-income',
          },
          {
            label: 'Expense',
            data: expenseAmounts,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 1)',
            yAxisID: 'y-axis-expense',
          },
        ],
      },
      options: {
        scales: {
          'y-axis-income': {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Income Amount',
            },
          },
          'y-axis-expense': {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Expense Amount',
            },
          },
        },
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
        // console.log(this.monthlyExpenseList);

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

        this.latestMonthExpense =
          this.monthlyExpenseList[result.length - 1].totalAmount;
        this.penultimateMonthExpense =
          this.monthlyExpenseList[result.length - 2].totalAmount;

        if (this.latestMonthExpense > this.penultimateMonthExpense) {
          this.increaseExpenseBoolean = true;
        }

        this.expenseChange =
          ((this.latestMonthExpense - this.penultimateMonthExpense) /
            this.latestMonthExpense) *
          100;
        // console.log(this.expenseChange);
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

  getMonthWiseIncome() {
    this.incomeService.GetMonthlyIncome(this.userId).subscribe(
      (result) => {
        this.monthlyIncomeList = result;
        // console.log(this.monthlyIncomeList);

        this.latestMonthIncome =
          this.monthlyIncomeList[result.length - 1].totalAmount;
        this.penultimateMonthIncome =
          this.monthlyIncomeList[result.length - 2].totalAmount;

        if (this.latestMonthIncome > this.penultimateMonthIncome) {
          this.increaseIncomeBoolean = true;
        }

        this.incomeChange =
          ((this.latestMonthIncome - this.penultimateMonthIncome) /
            this.latestMonthIncome) *
          100;
        // console.log(this.incomeChange);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCategoricalMonthWiseIncome() {
    this.incomeService.GetCategoricalMonthlyIncome(this.userId).subscribe(
      (result) => {
        this.monthlyCategoricalIncomeList = result;
        // console.log(this.monthlyCategoricalIncomeList);

        this.lastMonthSalaryIncome =
          this.monthlyCategoricalIncomeList[result.length - 1].totalAmount;
        this.lastMonthRentalIncome =
          this.monthlyCategoricalIncomeList[result.length - 2].totalAmount;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
