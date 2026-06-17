import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NavCollapseComponent } from './shared/organisms/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './shared/organisms/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './shared/organisms/navigation/nav-content/nav-item/nav-item.component';
import { NavSearchComponent } from './shared/organisms/nav-bar/nav-left/nav-search/nav-search.component';
import { NavContentComponent } from './shared/organisms/navigation/nav-content/nav-content.component';
import { ConfigurationComponent } from './shared/organisms/configuration/configuration.component';
import { BreadcrumbComponent } from './shared/molecules/breadcrumb/breadcrumb.component';
import { NavRightComponent } from './shared/organisms/nav-bar/nav-right/nav-right.component';
import { AdminGuard, AuthGuard, LoginGuard, RectorGuard } from './_classes/auth.guard';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavLeftComponent } from './shared/organisms/nav-bar/nav-left/nav-left.component';
import { NavigationComponent } from './shared/organisms/navigation/navigation.component';
import { ToggleFullScreenDirective } from './shared/atoms/full-screen/toggle-full-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './shared/organisms/nav-bar/nav-bar.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NavigationItem } from './shared/organisms/navigation/navigation';
import { BroadcasterService } from './_services/broadcaster.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BaseInterceptor } from './_services/base.interceptor';
import { LayoutComponent } from './shared/templates/layout/layout.component';
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
    LayoutComponent,
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
