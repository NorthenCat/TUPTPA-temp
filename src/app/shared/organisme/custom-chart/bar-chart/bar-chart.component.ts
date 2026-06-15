import { PickListChart } from '../picklist-chart';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  @Input() color: any;
  @Input() theme: any;
  @Input() height: any;
  @Input() sufix: string;
  @Input() prefix: string;
  @Input() labelX: string;
  @Input() labelY: string;
  @Input() chartId: string;
  @Input() loading: boolean;
  @Input() singleBar: boolean;
  @Input() isStacked: boolean;
  @Input() seriesType: string;
  @Input() dataLabels: boolean;
  @Input() stackedType: string;
  @Input() horizontalBar: boolean;
  @Input() legendPosition: string;

  public configChart: any;

  constructor() {
    this.legendPosition = 'bottom';
    this.horizontalBar = false;
    this.stackedType = 'normal';
    this.configChart = null;
    this.isStacked = false;
    this.singleBar = false;
    this.loading = false;
    this.prefix = '';
    this.sufix = '';
  }

  render(data) {
    this.loading = true;
    this.configChart = {
      chart: {
        height: this.height, // in px
        type: 'bar',
        stacked: this.isStacked,
        stackType: this.stackedType == '100%' ? '100%' : null
      },
      plotOptions: {
        bar: {
          horizontal: this.horizontalBar,
          distributed: this.isStacked == true ? false : this.singleBar,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: this.dataLabels,
        offsetY: -25,
        style: {
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          colors: ['#fff']
        },
        background: {
          enabled: true,
          foreColor: '#000',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          opacity: 0.6
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['transparent'],
      },
      series: data.series,
      xaxis: {
        type: this.seriesType, // datetime. null
        categories: data.categories,
        title: {
          text: this.labelX ? this.labelX : '',
          offsetY: -8,
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
        type: 'solid', // gradient, solid
      },
      tooltip: {
        y: {
          // formatter: (val) => this.checkPrefix(this.prefix) + val + this.checkSufix(this.sufix),
          formatter: function(value, opts) {
            if (this.seriesType == 'datetime') {
              const sum = opts.series[0][opts.dataPointIndex] + opts.series[1][opts.dataPointIndex] + opts.series[2][opts.dataPointIndex];
              const percent = (value / sum) * 100;
              return percent.toFixed(2) + '%';
            } else {
              return value;
            }
          }
        },
        // custom: function({ series, seriesIndex, dataPointIndex, w }) {
        //   return (
        //     '<div class="arrow_box">' +
        //     "<span>" +
        //     w.globals.labels[dataPointIndex] +
        //     ": " +
        //     series[seriesIndex][dataPointIndex] +
        //     "</span>" +
        //     "</div>"
        //   );
        // }
      },
      theme: {
        palette: this.theme
      },
      legend: {
        position: this.legendPosition ? this.legendPosition : 'bottom'
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

  checkPrefix(val) {
    if (val != '') {
      return val + ' ';
    } else {
      return '';
    }
  }

  checkSufix(val) {
    if (val != '') {
      return ' ' + val;
    } else {
      return '';
    }
  }

}
