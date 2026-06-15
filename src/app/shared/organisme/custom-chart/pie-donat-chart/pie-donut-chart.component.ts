import { BroadcasterService } from '../../../../_services/broadcaster.service';
import { AppService } from '../../../../_services/app.service';
import { PickListChart } from '../picklist-chart';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pie-donut-chart',
  templateUrl: './pie-donut-chart.component.html',
  styleUrls: ['./pie-donut-chart.component.scss']
})
export class PieDonutChartComponent {
  @Input() color: any;
  @Input() theme: any;
  @Input() height: any;
  @Input() type: string;
  @Input() half: boolean;
  @Input() chartId: string;
  @Input() loading: boolean;
  @Input() monochrome: boolean;
  @Input() dataLabels: boolean;
  @Input() legendPosition: string;
  @Input() totalLabel: string;

  public configChart: any;

  constructor() {
    this.legendPosition = 'bottom';
    this.monochrome = false;
    this.configChart = null;
    this.loading = false;
    this.half = false;
  }

  render(data) {
    this.loading = true;
    this.configChart = {
      chart: {
        height: this.height, // in px
        type: this.type ? this.type : 'pie',
      },
      series: data.series,
      labels: data.categories,
      legend: {
        show: true,
        position: this.legendPosition ? this.legendPosition : 'bottom'
      },
      theme: {
        palette: this.theme,
        monochrome: {
          enabled: this.monochrome
        }
      },
      dataLabels: {
        enabled: this.dataLabels,
        dropShadow: {
          enabled: false,
        }
      }
    };
    if (this.color == 'default') {
    } else if (this.color == 'faculty') {
      this.configChart['colors'] = PickListChart.facultyColor;
    } else {
      this.configChart['colors'] = this.color;
    }
    if (this.half) {
      this.configChart['plotOptions'] = {
        pie : {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          donut: {
            labels: {
              show: this.type == 'donut' ? true : false,
              name: {
                show: true
              },
              value: {
                show: true
              }
            }
          }
        }
      }
    }
    if (this.type == 'donut') {
      this.configChart['plotOptions'] = {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Rubik',
                color: '#dfsda',
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                color: undefined,
                offsetY: 16,
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                label: this.totalLabel,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                }
              }
            }
          }
        }
      }
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
