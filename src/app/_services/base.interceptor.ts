import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BroadcasterService } from './broadcaster.service';
import { Injectable, Injector } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { OauthService } from './oauth.service';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class BaseInterceptor implements HttpInterceptor {
  public notifPos: string;
  constructor(
    private broadcasterService: BroadcasterService,
    private injector: Injector,
    private router: Router
    ) {
      this.notifPos = 'top-right';
    }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = this.authenticateRequest(req);
    return next.handle(authReq).pipe(
      tap((event) => {}),
      catchError((error: HttpErrorResponse) => {
        this.resize();
        if (error.status === 400) {
          this.broadcasterService.notifBroadcast(true, {
            title: 'Failed',
            msg: error.error.message ? error.error.message : 'Invalid credentials!',
            timeout: 5000,
            theme: 'bootstrap',
            position: this.notifPos,
            type: 'warning'
          });
          return throwError(error);
        } else if (error.status === 401) {
          this.injector.get(OauthService).broadcastLogout();
          // this.broadcasterService.notifBroadcast(true, {
          //   title: 'Failed',
          //   msg: `You're not authenticate`,
          //   timeout: 5000,
          //   theme: 'bootstrap',
          //   position: 'top-right',
          //   type: 'error'
          // });
          return throwError(error);
        } else if (error.status === 403) {
          this.router.navigate(['/error/403']);
        } else if (error.status === 404) {
          this.broadcasterService.notifBroadcast(true, {
            title: 'Failed',
            msg: error.error.message ? error.error.message : 'API not found!',
            timeout: 5000,
            theme: 'bootstrap',
            position: this.notifPos,
            type: 'warning'
          });
          return throwError(error);
        } else if (error.status === 405) {
          console.log('not allow');
          this.injector.get(OauthService).broadcastLogout();
          return throwError(error);
        } else if (error.status <= 500) {
          this.broadcasterService.notifBroadcast(true, {
            title: 'Failed',
            msg: error.error.message ? error.error.message : 'Internal Server Error!',
            timeout: 5000,
            theme: 'bootstrap',
            position: this.notifPos,
            type: 'error'
          });
          return throwError(error);
        } else {
          return throwError(error);
        }
      })
    );
  }

  authenticateRequest(request: HttpRequest<any>) {
    const token = this.injector.get(OauthService).retrieveAccessToken();
    if (token) {
      const duplicate = request.clone({
        // headers: request.headers.set('Authorization', 'Basic ' + btoa('tracerstudy:tr4c3rstuDy4pi')),
        headers: request.headers.set('Authorization', 'Bearer ' + token.token),
        // url: request.url.replace('https://', 'http://'),
      });
      return duplicate;
    }
    return request;
  }

  resize() {
    if (innerWidth < 992) {
      this.notifPos = 'top-center';
    } else {
      this.notifPos = 'top-right';
    }
  }
}
