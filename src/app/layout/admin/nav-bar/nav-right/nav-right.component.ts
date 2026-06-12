import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { OauthService } from 'src/app/_services/oauth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit, AfterViewInit {
  public selectedCountry: string;
  public countries: any;
  public userProfile: any;

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private oauthService: OauthService
  ) {
    this.selectedCountry = localStorage.getItem('lang');
    this.countries = [
      {value: 'en', label: 'United States', lang: 'us'},
      {value: 'id', label: 'Indonesia', lang: 'id'},
    ];
    this.userProfile = {
      fullname: 'Loading...',
      numberid: 'Loading...',
      photo: 'assets/images/infinity-situ.svg'
    };
    this.broadcasterService.profileBroadcast$.subscribe(res => {
      if (res.response == 0) {
        this.userProfile = {
          fullname: '...no data...',
          numberid: '...no data...',
          photo: 'assets/images/user/situ-framework.png'
        };
      } else {
        this.loadProfile();
      }
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    if (this.oauthService.retrieveProfile()) {
      this.userProfile = this.oauthService.retrieveProfile();
    }
  }

  ngAfterViewInit() {
    document.querySelector('ng-select').classList.add('lang');
  }

  changeLang() {
    this.broadcasterService.changeLangBroadcast(true, this.selectedCountry);
    this.translateService.setDefaultLang(this.selectedCountry);
    this.translateService.use(this.selectedCountry);
    this.oauthService.setLang(this.selectedCountry);
  }

  logout() {
    this.oauthService.broadcastLogout();
  }
}
