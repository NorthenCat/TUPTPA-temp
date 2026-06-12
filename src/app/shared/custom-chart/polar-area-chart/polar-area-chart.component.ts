import { BroadcasterService } from '../../../_services/broadcaster.service';
import { AppService } from '../../../_services/app.service';
import { PickListChart } from '../picklist-chart';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-polar-area-chart',
  templateUrl: './polar-area-chart.component.html',
  styleUrls: ['./polar-area-chart.component.scss']
})
export class PolarAreaChartComponent {
  @Input() color: any;
  @Input() theme: any;
  @Input() height: any;
  @Input() type: string;
  @Input() chartId: string;
  @Input() loading: boolean;
  @Input() monochrome: boolean;
  @Input() dataLabels: boolean;
  @Input() legendPosition: string;

  public configChart: any;

  constructor() {
    this.legendPosition = 'bottom'
    this.monochrome = false;
    this.configChart = null;
    this.loading = false;
  }

  render(data) {
    this.loading = true;
    this.configChart = {
      series: [42, 39, 35, 29, 26],
        chart: {
          width: 380,
          type: 'polarArea'
        },
        labels: ['Rose A', 'Rose B', 'Rose C', 'Rose D', 'Rose E'],
        fill: {
          opacity: 1
        },
        stroke: {
          width: 1,
          colors: undefined
        },
        yaxis: {
          show: false
        },
        legend: {
          position: 'bottom'
        },
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: 0
            }
          }
        },
        theme: {
          monochrome: {
            //    enabled: true,
            shadeTo: 'light',
            shadeIntensity: 0.6
          }
        }
      // chart: {
      //   height: this.height, //in px
      //   type: 'polarArea',
      // },
      // labels: data.labels,
      // series: data.series,
      // legend: {
      //   show: true,
      //   position: this.legendPosition?this.legendPosition:'bottom'
      // },
      // theme: {
      //   palette: this.theme,
      //   monochrome: {
      //     enabled: this.monochrome
      //   }
      // },
      // dataLabels: {
      //   enabled: this.dataLabels,
      //   dropShadow: {
      //     enabled: false,
      //   }
      // },
      // plotOptions: {
      //   pie: {
      //     startAngle: -90,
      //     endAngle: 90,
      //     offsetY: 10,
      //     donut: {
      //       labels: {
      //         show: this.type == 'donut' ? true : false,
      //         name: {
      //           show: true
      //         },
      //         value: {
      //           show: true
      //         }
      //       }
      //     }
      //   }
      // }
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
