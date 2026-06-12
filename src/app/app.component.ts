import { OauthService } from './_services/oauth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DefaultConfig } from './app-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private oauthService: OauthService
  ) {
    this.oauthService.setLang(DefaultConfig.lang.defaultLang);
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
