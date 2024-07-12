import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CustomerPricingService } from '../../services/customer-pricing.service';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  startYear!: number;
  selectedMetric = "Reveniew Per Month";
  years: number[] = [];
  totals: number[] = [];
  constructor(private customerPricingService: CustomerPricingService) {
    Chart.register(...registerables);
}

  ngOnInit(): void {
    this.startYear = new Date().getFullYear();

    for (let year = this.startYear; year >= 2020; year--) {
      this.years.push(year);
    }

    this.createBarChart();
  }

  yearHandler(event: any) {
    this.startYear = event.target.value;
    this.createBarChart();
  }

  metricHandler(event: any) {
    this.selectedMetric = event.target.value;
    this.createBarChart();
  }

  createBarChart() {
    if (this.selectedMetric == "Reveniew Per Month") {
      this.customerPricingService.getTotalPricingStatistics(this.startYear).subscribe(
        res => {
          this.totals = res;
          // JS - Destroy exiting Chart Instance to reuse <canvas> element
          let chartStatus = Chart.getChart("myChart"); // <canvas> id
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }
          //-- End of chart destroy
          var stackedBar = new Chart("myChart", {
            type: 'bar',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Reveniew Per Month',
                data: this.totals,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                x: {
                  grid: {
                    offset: true
                  }
                }
              }
            }

          });

        })
    }
    if (this.selectedMetric == "Visitors Per Month") {
      this.customerPricingService.getTotalCheckInsStatistics(this.startYear).subscribe(
        res => {
          this.totals = res;
          // JS - Destroy exiting Chart Instance to reuse <canvas> element
          let chartStatus = Chart.getChart("myChart"); // <canvas> id
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }
          //-- End of chart destroy
          var stackedBar = new Chart("myChart", {
            type: 'bar',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Visitors Per Month',
                data: this.totals,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                x: {
                  grid: {
                    offset: true
                  }
                }
              }
            }

          });

        })
    }
  }

}
