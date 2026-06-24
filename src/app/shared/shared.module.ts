import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule, BadgeModule, ButtonModule, InputModule } from './atoms';
import { CardModule, ModalModule } from './molecules';
import { DataFilterPipe } from './organisms/data-table/data-filter.pipe';
import { ToastShowComponent } from './atoms/toast-show/toast-show.component';
import { TodoListRemoveDirective } from './atoms/todo/todo-list-remove.directive';
import { TodoCardCompleteDirective } from './atoms/todo/todo-card-complete.directive';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RadialBarChartComponent } from './organisms/custom-chart/radial-bar-chart/radial-bar-chart.component';
import { PolarAreaChartComponent } from './organisms/custom-chart/polar-area-chart/polar-area-chart.component';
import { FilterContainerComponent } from './molecules/filter-container/filter-container.component';
import { PieDonutChartComponent } from './organisms/custom-chart/pie-donut-chart/pie-donut-chart.component';
import { NoDataFoundComponent } from './molecules/no-data-found/no-data-found.component';
import { ApexChartComponent } from './organisms/chart/apex-chart/apex-chart.component';
import { RadarChartComponent } from './organisms/custom-chart/radar-chart/radar-chart.component';
import { AreaChartComponent } from './organisms/custom-chart/area-chart/area-chart.component';
import { ApexChartService } from './organisms/chart/apex-chart/apex-chart.service';
import { BarChartComponent } from './organisms/custom-chart/bar-chart/bar-chart.component';
import { ContentShellComponent } from './molecules/content-shell/content-shell.component';
import { PageContentComponent } from './organisms/page-content/page-content.component';
import { PageTemplateComponent } from './templates/page-template/page-template.component';
import { SelectOptionService } from './atoms/select/select-option.service';
import { SpinnerComponent } from './atoms/spinner/spinner.component';
import { GalleryComponent } from './organisms/gallery/gallery.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastComponent } from './atoms/toast/toast.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastService } from './atoms/toast/toast.service';
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
    BadgeModule,
    ButtonModule,
    InputModule,
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
    BadgeModule,
    ButtonModule,
    InputModule,
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
    BarChartComponent,
    ContentShellComponent,
    PageContentComponent,
    PageTemplateComponent
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
    BarChartComponent,
    ContentShellComponent,
    PageContentComponent,
    PageTemplateComponent
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
