import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NavCollapseComponent } from './layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavSearchComponent } from './layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { NavContentComponent } from './layout/admin/navigation/nav-content/nav-content.component';
import { ConfigurationComponent } from './layout/admin/configuration/configuration.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { NavRightComponent } from './layout/admin/nav-bar/nav-right/nav-right.component';
import { AdminGuard, AuthGuard, LoginGuard, RectorGuard } from './_classes/auth.guard';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavLeftComponent } from './layout/admin/nav-bar/nav-left/nav-left.component';
import { NavigationComponent } from './layout/admin/navigation/navigation.component';
import { ToggleFullScreenDirective } from './shared/full-screen/toggle-full-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './layout/admin/nav-bar/nav-bar.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NavigationItem } from './layout/admin/navigation/navigation';
import { BroadcasterService } from './_services/broadcaster.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdminComponent } from './layout/admin/admin.component';
import { BaseInterceptor } from './_services/base.interceptor';
import { AuthComponent } from './layout/auth/auth.component';
import { BrowserModule } from '@angular/platform-browser';
import { OauthService } from './_services/oauth.service';
import { MenuResolver } from './_classes/menu.resolver';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppService } from './_services/app.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    NavLeftComponent,
    NavSearchComponent,
    NavRightComponent,
    ConfigurationComponent,
    ToggleFullScreenDirective,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    BroadcasterService,
    NavigationItem,
    CookieService,
    MenuResolver,
    OauthService,
    RectorGuard,
    LoginGuard,
    AdminGuard,
    AppService,
    AuthGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
