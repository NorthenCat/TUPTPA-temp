import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { OauthService } from 'src/app/_services/oauth.service';
import { TranslateService } from '@ngx-translate/core';
import { DefaultConfig } from 'src/app/app-config';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  public lang: string;
  public msg: string;

  constructor(
    private title: Title,
    private route: Router,
    private router: ActivatedRoute,
    private oauthService: OauthService,
    private translateService: TranslateService,
    private broadcasterService: BroadcasterService
  ) {
    this.msg = 'REDIRECT...';
    this.lang = localStorage.getItem('lang');
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    if (this.router.snapshot.queryParams.token) {
      const args = {
        token: router.snapshot.queryParams.token,
        expires_in: null
      };
      localStorage.removeItem('token');
      setTimeout(() => {
        this.oauthService.broadcastLogin(args, this.lang ? this.lang : DefaultConfig.lang.defaultLang);
        this.getProfile();
        this.broadcasterService.profileBroadcast$.subscribe(res => {
          this.getScope();
        });
      }, 100);
    } else {
      this.checkToken();
    }
  }

  ngOnInit() {
    this.title.setTitle('Redirect | ' + DefaultConfig.Application.appName);
    // this.checkToken();
  }

  checkToken() {
    if (this.oauthService.retrieveAccessToken().token) {
      this.route.navigate(['/home']);
    } else {
      this.msg = 'NOT AUTHENTICATED';
      setTimeout(() => {
        // this.oauthService.broadcastLogout();
        window.location.href = 'https://portal.telkomuniversity.ac.id/';
      }, 3000);
    }
  }

  getScope() {
    this.oauthService.getScope().subscribe(res => {
      const scopes = _.uniq(_.pluck(res, 'scope'));
      if (res) {
        this.oauthService.setScope(scopes);
        this.broadcasterService.scopeLoaded(true);
        localStorage.setItem('register', 'cmVnaXN0cmF0aW9n');
        // this.broadcasterService.getMenuBroadcast(true);
      }
    });
  }

  getProfile() {
    this.oauthService.getUserProfile().subscribe(data => {
      if (data) {
        this.oauthService.setProfile(data);
        this.broadcasterService.profileLoaded(true, 1);
      }
    }, () => {
      this.broadcasterService.profileLoaded(true, 0);
    });
  }

  dataNotFound() {
    Swal.fire({
      title: 'Warning!',
      text: 'Mohon maaf sesi anda sudah habis. Silakan login kembali',
      type: 'warning',
      showConfirmButton: false,
      showCloseButton: false,
      showCancelButton: false,
      allowOutsideClick: false
    });
    setTimeout(() => {
      this.oauthService.broadcastLogout();
    }, 3000);
  }

}
