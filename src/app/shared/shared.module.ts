import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule, CardModule, ModalModule } from './molekul';
import { DataFilterPipe } from './atom/data-table/data-filter.pipe';
import { ToastShowComponent } from './molekul/toast-show/toast-show.component';
import { TodoListRemoveDirective } from './atom/todo/todo-list-remove.directive';
import { TodoCardCompleteDirective } from './atom/todo/todo-card-complete.directive';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RadialBarChartComponent } from './organisme/custom-chart/radial-bar-chart/radial-bar-chart.component';
import { PolarAreaChartComponent } from './organisme/custom-chart/polar-area-chart/polar-area-chart.component';
import { FilterContainerComponent } from './molekul/filter-container/filter-container.component';
import { PieDonutChartComponent } from './organisme/custom-chart/pie-donat-chart/pie-donut-chart.component';
import { NoDataFoundComponent } from './atom/no-data-found/no-data-found.component';
import { ApexChartComponent } from './organisme/chart/apex-chart/apex-chart.component';
import { RadarChartComponent } from './organisme/custom-chart/radar-chart/radar-chart.component';
import { AreaChartComponent } from './organisme/custom-chart/area-chart/area-chart.component';
import { ApexChartService } from './organisme/chart/apex-chart/apex-chart.service';
import { BarChartComponent } from './organisme/custom-chart/bar-chart/bar-chart.component';
import { SelectOptionService } from './atom/select/select-option.service';
import { SpinnerComponent } from './atom/spinner/spinner.component';
import { GalleryComponent } from './organisme/gallery/gallery.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastComponent } from './molekul/toast/toast.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastService } from './molekul/toast/toast.service';
import { ShortenerString } from '../_classes/shortenerString';
import { HttpClient } from '@angular/common/http';
import { LightboxModule } from 'ngx-lightbox';
import { ToastyModule } from 'ng2-toasty';
import { SelectModule } from 'ng-select';

/*import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';*/

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    SelectModule,
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    AutocompleteLibModule,
    ModalModule,
    ClickOutsideModule,
    LightboxModule,
    ToastyModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    SelectModule,
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    ModalModule,
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    ClickOutsideModule,
    SpinnerComponent,
    ApexChartComponent,
    GalleryComponent,
    ToastComponent,
    TranslateModule,
    ShortenerString,
    ToastShowComponent,
    NoDataFoundComponent,
    FilterContainerComponent,
    RadialBarChartComponent,
    PolarAreaChartComponent,
    PieDonutChartComponent,
    RadarChartComponent,
    AreaChartComponent,
    BarChartComponent
  ],
  declarations: [
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    SpinnerComponent,
    ApexChartComponent,
    ToastComponent,
    GalleryComponent,
    ShortenerString,
    ToastShowComponent,
    NoDataFoundComponent,
    FilterContainerComponent,
    FilterContainerComponent,
    RadialBarChartComponent,
    PolarAreaChartComponent,
    PieDonutChartComponent,
    RadarChartComponent,
    AreaChartComponent,
    BarChartComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ApexChartService,
    ToastService,
    SelectOptionService
  ]
})
export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
