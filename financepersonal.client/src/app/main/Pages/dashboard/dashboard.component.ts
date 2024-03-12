import { AfterViewInit, Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CategoryService } from '../../Services/category.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ExpenseService } from '../../Services/expense.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {

  public chart: any;
  showFiller = false;
  userId: any = this.authService.currentUserSource.value.userId;
  foodExpenseCount: any = [];
  foodAmount: number;
  chartData: any =[];
  monthlyExpenseList : any = [];
  categoricalMonthlyExpenseList : any = [];
  monthlyTotalAmount : any = [];
  totalExpense : number = 0;
  averageExpense : number = 0;
  janFoodExpense : any ;

  //categorical monthly expense array
  foodData : any = [];
  travelData : any = [];
  othersData : any = [];
  miscData : any = [];

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private authService: AuthService) { }
  ngOnInit() {
    this.getCategoricalExpenseCount();
    this.getMonthlyExpense();
    this.getMonthlyCategoricalExpense();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createBarChart();
      this.createLineChart();
      this.createDoughnutChart();
    }, 0)
  }

  createDoughnutChart() {
    var options = {
      cutoutPercentage: 40,
      radius: '60%', // Set the radius of the doughnut chart
    };
    this.chart = new Chart("DoughnutChart", {
      type: 'doughnut',

      data: {
        labels: [
          'Food',
          'Travel',
          'Misc',
          'Others'
        ],
        datasets: [{
          label: '',
          data: this.chartData,
          backgroundColor: [
            'red',
            'blue',
            'yellow',
            'green'
          ],
          hoverOffset: 4
        }]
      },
      options: options
    });
  }

  createBarChart() {
    this.chart = new Chart("BarChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['January', 'February', 'March'],
        datasets: [
          {
            label: "Food",
            data: this.foodData,
            backgroundColor: 'blue'
          },
          {
            label: "Travel",
            data: this.travelData,
            backgroundColor: 'purple'
          },
          {
            label: "Misc",
            data: this.miscData,
            backgroundColor: 'limegreen'
          },
          {
            label: "Others",
            data: this.othersData,
            backgroundColor: 'orange'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createLineChart() {
    this.chart = new Chart("LineChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['January', 'February', 'March'],
        datasets: [
          {
            label: "Monthly Expense",
            data: this.monthlyTotalAmount,
            backgroundColor: 'blue'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }

  getCategoricalExpenseCount() {
    this.categoryService.getCategoricalExpenseCount(this.userId).subscribe(
      (result) => {
        this.foodExpenseCount = result;
        this.foodExpenseCount.forEach(element => {
          if(element.totalAmount){
            this.chartData.push(element.totalAmount);
          }
        });
        // console.log(this.chartData);
        // console.log(this.foodExpenseCount);
      },
      error => {
        // console.log(error);
      }
    );
  }

  getMonthlyExpense() {
    this.expenseService.getMonthlyExpense(this.userId).subscribe(
      (result) => {
        this.monthlyExpenseList = result;
        // console.log(this.monthlyExpenseList);

        //separating out totalAmounts
        this.monthlyExpenseList.forEach(element => {
          if(element.totalAmount){
            this.monthlyTotalAmount.push(element.totalAmount);
            // console.log(this.monthlyTotalAmount);
          }
        })

        //for total expense
        this.monthlyTotalAmount.forEach(element => {
          this.totalExpense += element;
        });

        //for getting monthly average
        let n = this.monthlyExpenseList.length;
        this.averageExpense = this.totalExpense / n;
        // console.log(this.totalExpense);
      },
      error => {
        console.log(error); 
      }
    )
  }

  getMonthlyCategoricalExpense(){
    this.expenseService.getMonthlyCategoricalExpense(this.userId).subscribe(
      (result) => {
        // console.log(result); 
        this.categoricalMonthlyExpenseList = result;

        //separating out food expense
        this.categoricalMonthlyExpenseList.forEach(element => {
          if(element.categoryName == 'Food'){
            this.foodData.push(element.totalAmount);
          }
        })
        console.log(this.foodData);

        //separating out travel expense
        this.categoricalMonthlyExpenseList.forEach(element => {
          if(element.categoryName == 'Travel'){
            this.travelData.push(element.totalAmount);
          }
        })
        console.log(this.travelData);

        //separating out misc expense
        this.categoricalMonthlyExpenseList.forEach(element => {
          if(element.categoryName == 'Others'){
            this.othersData.push(element.totalAmount);
          }
        })
        console.log(this.othersData);

        //separating out others expense
        this.categoricalMonthlyExpenseList.forEach(element => {
          if(element.categoryName == 'Misc'){
            this.miscData.push(element.totalAmount);
          }
        })
        console.log(this.miscData);
        
      },
      error => {
        console.log(error);
        
      }
    )
  }
}

