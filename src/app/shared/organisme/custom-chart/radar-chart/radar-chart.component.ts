import { BroadcasterService } from '../../../../_services/broadcaster.service';
import { AppService } from '../../../../_services/app.service';
import { PickListChart } from '../picklist-chart';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss']
})
export class RadarChartComponent {
  @Input() color: any;
  @Input() theme: any;
  @Input() height: any;
  @Input() sufix: string;
  @Input() prefix: string;
  @Input() chartId: string;
  @Input() loading: boolean;
  @Input() dataLabels: boolean;
  @Input() legendPosition: string;

  public configChart: any;

  constructor() {
    this.legendPosition = 'bottom';
    this.configChart = null;
    this.loading = false;
    this.prefix = '';
    this.sufix = '';
  }

  render(data) {
    this.loading = true;
    this.configChart = {
      chart: {
        height: this.height, // in px
        type: "radar"
      },
      plotOptions: {
        radar: {
          size: 125,
          polygons: {
            strokeColor: 'rgba(0,0,0,0.5)',
            fill: {
              colors: ['rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)']
            }
          }
        }
      },
      dataLabels: {
        enabled: this.dataLabels
      },
      series: data.series,
      labels: data.categories,
      tooltip: {
        y: {
          formatter: (val) => this.checkPrefix(this.prefix) + val + this.checkSufix(this.sufix),
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
