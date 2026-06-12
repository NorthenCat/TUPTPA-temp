import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { slideInAnimation } from 'src/app/animations';
import { DefaultConfig } from 'src/app/app-config';
import { RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AdminComponent implements OnInit {
  public nextConfig: any;
  public navCollapsed: boolean;
  public navCollapsedMob: boolean;
  public windowWidth: number;

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private location: Location,
    private zone: NgZone
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.nextConfig = DefaultConfig.config;
    let currentURL = this.location.path();
    const baseHerf = this.location['_baseHref'];
    if (baseHerf) {
      currentURL = baseHerf + this.location.path();
    }

    this.windowWidth = window.innerWidth;

    if ((currentURL === baseHerf + '/layout/collapse-menu'
      || currentURL === baseHerf + '/layout/box')
      && (this.windowWidth >= 992 && this.windowWidth <= 1024)) {
      this.nextConfig.collapseMenu = true;
    }

    this.navCollapsed = (this.windowWidth >= 992) ? this.nextConfig.collapseMenu : false;
    this.navCollapsedMob = false;

  }

  ngOnInit() {
    this.adjustContainerSize();
  }

  adjustContainerSize() {
    const el = (document.querySelector('.pcoded-main-container') as HTMLElement);
    el.style.height = 'auto';
    el.style.minHeight = `${window.innerHeight - 190}px`;
    if (this.windowWidth < 992) {
      this.nextConfig.layout = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-next') as HTMLElement).style.maxHeight = '100%'; // 100% amit
      }, 200);
    }
  }

  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !(document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open'))) {
        this.navCollapsedMob = !this.navCollapsedMob;
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob;
        }, 100);
      } else {
        this.navCollapsedMob = !this.navCollapsedMob;
      }
      this.broadcasterService.isMobile(true);
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
