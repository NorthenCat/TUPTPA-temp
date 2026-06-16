import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { slideInAnimation } from 'src/app/animations';
import { DefaultConfig } from 'src/app/app-config';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class LayoutComponent implements OnInit {
  public isAdminTemplate = false;
  public nextConfig: any;
  public navCollapsed: boolean;
  public navCollapsedMob: boolean;
  public windowWidth: number;

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.isAdminTemplate = this.route.snapshot.data && this.route.snapshot.data['template'] === 'admin';

    if (!this.isAdminTemplate) {
      return;
    }

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
    if (this.isAdminTemplate) {
      this.adjustContainerSize();
    }
  }

  adjustContainerSize() {
    const el = (document.querySelector('.pcoded-main-container') as HTMLElement);
    if (!el) {
      return;
    }
    el.style.height = 'auto';
    el.style.minHeight = `${window.innerHeight - 190}px`;
    if (this.windowWidth < 992) {
      this.nextConfig.layout = 'vertical';
      setTimeout(() => {
        const navbar = document.querySelector('.pcoded-navbar');
        const navScroll = (document.querySelector('#nav-ps-next') as HTMLElement);
        if (navbar) {
          navbar.classList.add('menupos-static');
        }
        if (navScroll) {
          navScroll.style.maxHeight = '100%';
        }
      }, 200);
    }
  }

  navMobClick() {
    if (this.windowWidth < 992) {
      const mobileNavigation = document.querySelector('app-navigation.pcoded-navbar');
      if (this.navCollapsedMob && mobileNavigation && !mobileNavigation.classList.contains('mob-open')) {
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
