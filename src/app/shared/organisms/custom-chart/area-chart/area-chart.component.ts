import { PickListChart } from '../picklist-chart';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss']
})
export class AreaChartComponent {
  @Input() color: any;
  @Input() theme: any;
  @Input() height: any;
  @Input() stroke: string;
  @Input() labelX: string;
  @Input() labelY: string;
  @Input() chartId: string;
  @Input() loading: boolean;
  @Input() seriesType: string;
  @Input() dataLabels: boolean;
  @Input() isAreaType: boolean;
  @Input() legendPosition: string;

  public configChart: any;

  constructor() {
    this.legendPosition = 'bottom'
    this.configChart = null;
    this.isAreaType = true;
    this.loading = false;
    this.stroke = 'smooth';
  }

  render(data) {
    this.loading = true;
    this.configChart = {
      chart: {
        height: this.height, // in px
        type: this.isAreaType ? 'area' : 'line',
      },
      dataLabels: {
        enabled: this.dataLabels
      },
      stroke: {
        curve: this.stroke // smooth, straight, stepline
      },
      series: data.series,
      xaxis: {
        type: this.seriesType, // datetime. null
        categories: data.categories,
        title: {
          text: this.labelX ? this.labelX : '',
          offsetY: 0,
          style: {
            color: '#37474f',
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-title'
          }
        },
        labels: {
          datetimeUTC: false,
          offsetY: -2
        }
      },
      yaxis: {
        title: {
          text: this.labelY ? this.labelY : '',
          style: {
            color: '#37474f',
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-title'
          }
        }
      },
      fill: {
        opacity: 1,
        type: 'gradient', // gradient, solid
      },
      tooltip: {
        x: {
          format: 'dd/MM/yyyy HH:mm'
        },
      },
      theme: {
        palette: this.theme
      },
      legend: {
        position: this.legendPosition?this.legendPosition:'bottom'
      }
    };

    if (this.color == 'default') {
    } else if (this.color == 'faculty') {
      this.configChart['colors'] = PickListChart.facultyColor;
    } else {
      this.configChart['colors'] = this.color;
    }

    this.loading = false;
  }

}
