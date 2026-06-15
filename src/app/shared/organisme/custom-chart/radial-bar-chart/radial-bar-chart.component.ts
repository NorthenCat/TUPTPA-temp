import { BroadcasterService } from '../../../../_services/broadcaster.service';
import { AppService } from '../../../../_services/app.service';
import { PickListChart } from '../picklist-chart';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-radial-bar-chart',
  templateUrl: './radial-bar-chart.component.html',
  styleUrls: ['./radial-bar-chart.component.scss']
})
export class RadialBarChartComponent {
  @Input() color: any;
  @Input() height: any;
  @Input() type: string;
  @Input() chartId: string;
  @Input() loading: boolean;
  @Input() fontSize: string;

  public configChart: any;

  constructor() {
    this.fontSize = '16px'
    this.configChart = null;
    this.loading = false;
  }

  render(data) {
    this.loading = true;
    this.configChart = {
      chart: {
        height: this.height,
        type: 'radialBar',
      },
      series: data.series,
      labels: data.categories
    };
    if (this.color == 'default') {
    } else if (this.color == 'faculty') {
      this.configChart['colors'] = PickListChart.facultyColor;
    } else {
      this.configChart['colors'] = this.color;
    }
    if (this.type == 'custom') {
      this.configChart['plotOptions'] = {
        radialBar: {
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            }
          }
        }
      };
      this.configChart['legend'] = {
        show: true,
        floating: true,
        fontSize: this.fontSize,
        position: 'left',
        offsetX: 0,
        offsetY: 0,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0
        },
        formatter: (seriesName, opts) => seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex] + '%',
        itemMargin: {
          horizontal: 1,
        }
      }
    } else if (this.type == 'gradient' && data.series.length == 1) {
      const angle = (360-(data.series/100*360))/2;
      this.configChart['plotOptions'] = {
        radialBar: {
          startAngle: -180 + angle,
          endAngle: 180 + angle,
          hollow: {
            margin: 0,
            size: "70%",
            background: "transparent",
            image: undefined,
            position: "front",
            dropShadow: {
              enabled: true,
              top: 5,
              left: 0,
              blur: 10,
              opacity: 0.9
            }
          },
          track: {
            background: 'rgba(0,0,0,0.1)',
            strokeWidth: "70%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -5,
              left: 0,
              blur: 10,
              opacity: 1
            }
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: "#888",
              fontSize: "17px"
            },
            value: {
              formatter: function(val) {
                return parseInt(val.toString(), 10).toString() + '%';
              },
              color: "#111",
              fontSize: "36px",
              show: true
            }
          }
        }
      };
      this.configChart['stroke'] = {
        lineCap: "round"
      };
      this.configChart['fill'] = {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#ABE5A1"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      };
    } else {
      this.configChart['plotOptions'] = {
        radialBar: {
          hollow: {
            size: '60%',
          },
          dataLabels: {
            total: {
              show: data.series.length == 1?false:true,
              label: "Total",
              formatter: function() {
                return data.series.reduce((a, b) => a + b, 0);
                // return '100'
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
