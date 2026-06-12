import { CanActivate, Router } from '@angular/router';
import { OauthService } from '../_services/oauth.service';
import { TokenFactory } from './token.factory';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private oauthService: OauthService
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.oauthService.retrieveAccessToken().token) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private tokenFactory = new TokenFactory();
  constructor(
    private router: Router,
    private oauthService: OauthService
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.oauthService.retrieveAccessToken().token) {
      this.router.navigate(['']);
      return false;
    } else {
      return true;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class RectorGuard implements CanActivate {
  constructor(
    private router: Router,
    private oauthService: OauthService
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.oauthService.checkScope('old-rektor')) {
      return true;
    } else {
      this.router.navigate(['/error/403']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private oauthService: OauthService
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.oauthService.checkScope('old-admin')) {
      return true;
    } else {
      this.router.navigate(['/error/403']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class SuperadminGuard implements CanActivate {
  constructor(
    private router: Router,
    private oauthService: OauthService
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.oauthService.checkScope('superadmin-credit-payment')) {
      return true;
    } else {
      this.router.navigate(['/error/403']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class SuperadminAdminKKGuard implements CanActivate {
  constructor(
    private router: Router,
    private oauthService: OauthService
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.oauthService.checkScope('superadmin-credit-payment') || this.oauthService.checkScope('adminKK')) {
      return true;
    } else {
      this.router.navigate(['/error/403']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PegawaiKKGuard implements CanActivate {
  constructor(
    private router: Router,
    private oauthService: OauthService
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const scopes = this.oauthService.retrieveScope();
    console.log('[PegawaiKKGuard] User scopes:', scopes);
    const hasAttendancePic = this.oauthService.checkScope('attendance-pic-unit');
    const hasTrainingUser = this.oauthService.checkScope('training-user-approval');
    const hasSuperadmin = this.oauthService.checkScope('superadmin-credit-payment');
    console.log('[PegawaiKKGuard] Scope check results:', {
      'attendance-pic-unit': hasAttendancePic,
      'training-user-approval': hasTrainingUser,
      'superadmin-credit-payment': hasSuperadmin
    });

    if (hasAttendancePic || hasTrainingUser || hasSuperadmin) {
      return true;
    } else {
      console.warn('[PegawaiKKGuard] Access Denied - Redirecting to 403');
      this.router.navigate(['/error/403']);
      return false;
    }
  }
}
