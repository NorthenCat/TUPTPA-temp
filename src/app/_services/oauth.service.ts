import { TokenFactory } from '../_classes/token.factory';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as _ from 'underscore';

@Injectable()
export class OauthService extends BaseService {
  private namespace = 'oauth';
  private tokenFactory = new TokenFactory();

  constructor(
    http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    super(http);
  }

  getScope(): Observable<any> {
    const url = this.getUrl(this.namespace, 'user_scope');
    return this.getApi(url);
  }

  getAccessToken(body): Observable<any> {
    const url = this.getUrl(this.namespace, 'access_token');
    return this.postApi(url, body);
  }

  getUserProfile(): Observable<any> {
    const url = this.getUrl(this.namespace, 'user_profile');
    return this.getApi(url);
  }

  setLang(args) {
    this.tokenFactory.setLang(args);
  }

  broadcastLogin(token, lang) {
    this.setAccessToken(token);
    this.setLang(lang);
    this.router.navigate(['home']);
  }

  // ====================== cookies ======================

  // broadcastLogout() {
  //   // stored in cookie
  //   if (this.cookieService.check('token_situ')) {
  //     this.cookieService.delete('token_situ');
  //     this.cookieService.delete('scope_situ');
  //     this.cookieService.delete('profile_satu');
  //     this.router.navigate(['auth/login']);
  //     location.reload();
  //   }
  // }

  // checkScope(param) {
  //   return _.contains(this.retrieveScope(), param);
  // }


  // setAccessToken(args) {
  //   // set token into cookies
  //   this.cookieService.set('token_situ', JSON.stringify(args));
  // }

  // setProfile(args) {
  //   this.cookieService.set('profile_satu', JSON.stringify(args));
  // }

  // retrieveProfile() {
  //   // retrieve scope from cookies
  //   if (this.cookieService.check('profile_satu')) {
  //     return JSON.parse(this.cookieService.get('profile_satu'));
  //   } else {
  //     return false;
  //   }
  // }

  // setScope(args) {
  //   this.cookieService.set('scope_situ', JSON.stringify(args));
  // }

  // retrieveScope() {
  //   // retrieve scope from cookies
  //   if (this.cookieService.check('scope_situ')) {
  //     return JSON.parse(this.cookieService.get('scope_situ'));
  //   } else {
  //     return false;
  //   }
  // }

  // retrieveAccessToken() {
  //   // retrieve token from cookies
  //   if (this.cookieService.check('token_situ')) {
  //     return JSON.parse(this.cookieService.get('token_situ'));
  //   } else {
  //     this.broadcastLogout();
  //     return false;
  //   }
  // }

  // ====================== localstorage ======================

  setAccessToken(args) {
    this.tokenFactory.setAccessToken(args);
  }

  retrieveAccessToken() {
    return this.tokenFactory.retrieveAccessToken();
  }

  setScope(args) {
    this.tokenFactory.setScope(args);
  }

  retrieveScope() {
    return this.tokenFactory.retrieveScope();
  }

  checkScope(param) {
    return _.contains(this.tokenFactory.retrieveScope(), param);
  }

  setProfile(args) {
    this.tokenFactory.setProfileSatu(args);
  }

  retrieveProfile() {
    return this.tokenFactory.retrieveProfile();
  }

  broadcastLogout() {
    this.tokenFactory.destroyToken();
    this.tokenFactory.destroyProfile();
    this.tokenFactory.destroyScope();
    localStorage.removeItem('navigation');
    this.router.navigate(['auth/login']);
    location.reload();
  }

  clearAppInitCredential() {
    localStorage.removeItem('navigation');
    this.tokenFactory.destroyToken();
    this.tokenFactory.destroyProfile();
    this.tokenFactory.destroyScope();
  }

}
