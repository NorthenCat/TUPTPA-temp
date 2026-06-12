import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { OauthService } from 'src/app/_services/oauth.service';
import { TranslateService } from '@ngx-translate/core';
import { DefaultConfig } from 'src/app/app-config';
import { NavigationItem } from '../navigation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit, AfterViewInit {
  public headerBackgroundColor: string; // header background color
  public headerBackColorStorage: string;
  public layoutType: string;
  public userProfile: any;
  public nextConfig: any;
  public navigation: any;
  public prevDisabled: string;
  public nextDisabled: string;
  public contentWidth: number;
  public wrapperWidth: any;
  public scrollWidth: any;
  public windowWidth: number;
  public isNavProfile: boolean;
  public showStatus: boolean;

  // auto theme properties
  public autoTheme: any;
  public layoutTypeStorage: string;
  public timeStart: any;
  public timeEnd: any;
  public isConfig: boolean;

  @Output() NavMobCollapse = new EventEmitter();

  @ViewChild('navbarContent', {static: false}) navbarContent: ElementRef;
  @ViewChild('navbarWrapper', {static: false}) navbarWrapper: ElementRef;

  constructor(
    public nav: NavigationItem,
    private broadcasterService: BroadcasterService,
    private translateService: TranslateService,
    private oauthService: OauthService,
    private location: Location,
    private zone: NgZone
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.hideProfileMenuBroadcast$.subscribe(res => {
      this.isNavProfile = false;
    });
    this.nextConfig = DefaultConfig.config;
    this.windowWidth = window.innerWidth;

    // this.navigation = this.nav.get();
    this.navigation = [];
    this.prevDisabled = 'disabled';
    this.nextDisabled = '';
    this.scrollWidth = 0;
    this.contentWidth = 0;
    this.userProfile = {
      fullname: 'Loading...',
      numberid: 'Loading...',
      photo: 'assets/images/infinity-situ.svg'
    };
    this.isNavProfile = false;
    // tslint:disable-next-line: max-line-length
    this.headerBackColorStorage = localStorage.getItem('headerBgsColor') ? localStorage.getItem('headerBgsColor') : DefaultConfig.config.headerBackColor;
    broadcasterService.changeTheme$.subscribe(res => {
      this.setLayout(res.layout);
    });
    broadcasterService.getMenuBroadcast$.subscribe(res => {
      this.loadMenu();
    });
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
    this.broadcasterService.isMobile$.subscribe(res => {
      this.showStatus = true;
    });
    // auto theme constructor
    this.layoutTypeStorage = localStorage.getItem('layoutType') ? localStorage.getItem('layoutType') : this.nextConfig.layoutType;
    this.autoTheme = localStorage.getItem('autoTheme') ? localStorage.getItem('autoTheme') : this.nextConfig.autoTheme;
    const now = new Date();
    const start: any = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
    const end: any = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
    this.timeStart = start / 1000;
    this.timeEnd = end / 1000;
    this.showStatus = false;
  }

  ngOnInit() {
    this.headerBackgroundColor = this.headerBackColorStorage;
    this.setHeaderBackground(this.headerBackgroundColor);
    if (this.windowWidth < 992) {
      this.nextConfig['layout'] = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-next') as HTMLElement).style.maxHeight = '100%';
      }, 500);
    }
    this.loadProfile();
    this.loadMenu();
    // this.navigation = this.nav.get();
    // Auto theme on init
    this.setAutoTheme(this.autoTheme);
    setTimeout(() => {
      this.checkTimeNow(this.timeStart, this.timeEnd);
    }, 1000);
    this.adjustNavbarSize();
  }

  adjustNavbarSize() {
    setTimeout(() => {
      const el = document.querySelector('.pcoded-navbar.menupos-fixed') as HTMLElement;
      if (el) {
        el.style.height = 'auto';
        el.style.minHeight = `${window.innerHeight - 50}px`;
        el.style.borderRadius = '0 0.70rem 0 0';
      }
      if (this.windowWidth < 992) {
        const hr = document.querySelector('hr.sep') as HTMLElement;
        const ch = document.querySelector('app-checking') as HTMLElement;
        if (hr) { hr.style.display = 'block'; }
        if (ch) { ch.style.display = 'block'; }
      }
    }, 100);
  }

  adjustContainer() {
    const el = (document.querySelector('.pcoded-main-container') as HTMLElement);
    el.style.height = 'auto';
    if (this.isNavProfile) {
      el.style.minHeight = `${(window.innerHeight - 190) + 60}px`;
    }
  }

  loadMenu() {
    setTimeout(() => {
      if (localStorage.getItem('navigation') == 'fedafc5d06cd457b42fcede079cdf94e') {
        this.navigation = this.nav.get();
      }
    }, 100);
  }

  loadProfile() {
    if (this.oauthService.retrieveProfile()) {
      this.userProfile = this.oauthService.retrieveProfile();
    }
  }

  logout() {
    this.oauthService.broadcastLogout();
  }

  ngAfterViewInit() {
    if (this.nextConfig['layout'] === 'horizontal') {
      this.contentWidth = this.navbarContent.nativeElement.clientWidth;
      this.wrapperWidth = this.navbarWrapper.nativeElement.clientWidth;
    }
  }

  scrollPlus() {
    this.scrollWidth = this.scrollWidth + (this.wrapperWidth - 80);
    if (this.scrollWidth > (this.contentWidth - this.wrapperWidth)) {
      this.scrollWidth = this.contentWidth - this.wrapperWidth + 80;
      this.nextDisabled = 'disabled';
    }
    this.prevDisabled = '';
    if (this.nextConfig.rtlLayout) {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginRight = '-' + this.scrollWidth + 'px';
    } else {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
    }
  }

  scrollMinus() {
    this.scrollWidth = this.scrollWidth - this.wrapperWidth;
    if (this.scrollWidth < 0) {
      this.scrollWidth = 0;
      this.prevDisabled = 'disabled';
    }
    this.nextDisabled = '';
    if (this.nextConfig.rtlLayout) {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginRight = '-' + this.scrollWidth + 'px';
    } else {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
    }

  }

  fireLeave() {
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open')) {
      this.NavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          up_parent.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }

  // Auto theme method
  checkAutoTheme(event) {
    if (event.target.checked) {
      this.setAutoTheme(true);
    } else {
      this.setAutoTheme(false);
    }
  }

  autoThemeTrigger(start, end) {
    let now = new Date();
    let sekarang:any = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds())
    let val = sekarang/1000;
    if (this.autoTheme == 'true' || this.autoTheme == true) {
      if (start == val) {
        this.broadcasterService.changeTheme(true, 'reset');
        this.layoutTypeStorage = 'reset';
      } else if (end == val) {
        this.broadcasterService.changeTheme(true, 'dark');
        this.layoutTypeStorage = 'dark';
      }
    }
  }

  checkTimeNow(start, end) {
    let now = new Date();
    let sekarang:any = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds())
    let val = sekarang/1000;
    if (this.autoTheme == 'true' || this.autoTheme == true) {
      if (val > start && val < end) {
        this.broadcasterService.changeTheme(true, 'reset');
        this.layoutTypeStorage = 'reset';
      } else {
        this.broadcasterService.changeTheme(true, 'dark');
        this.layoutTypeStorage = 'dark';
      }
    }
  }

  changeLayout(event) {
    if (event.target.checked) {
      this.broadcasterService.changeTheme(true, 'reset');
      this.layoutTypeStorage = 'reset';
    } else {
      this.broadcasterService.changeTheme(true, 'dark');
      this.layoutTypeStorage = 'dark';
    }
  }

  setAutoTheme(mode) {
    if (mode == true || mode == 'true') {
      localStorage.setItem('autoTheme', 'true');
      this.autoTheme = 'true';
    } else {
      localStorage.setItem('autoTheme', 'false');
      this.autoTheme = 'false';
    }
  }

  setHeaderBackground(background) {
    this.headerBackgroundColor = background;
    document.querySelector('body').classList.remove('background-blue');
    document.querySelector('body').classList.remove('background-red');
    document.querySelector('body').classList.remove('background-purple');
    document.querySelector('body').classList.remove('background-info');
    document.querySelector('body').classList.remove('background-green');
    document.querySelector('body').classList.remove('background-dark');
    document.querySelector('body').classList.remove('background-grd-blue');
    document.querySelector('body').classList.remove('background-grd-red');
    document.querySelector('body').classList.remove('background-grd-purple');
    document.querySelector('body').classList.remove('background-grd-info');
    document.querySelector('body').classList.remove('background-grd-green');
    document.querySelector('body').classList.remove('background-grd-dark');
    document.querySelector('body').classList.remove('background-grd-telu');
    document.querySelector('body').classList.remove('background-img-1');
    document.querySelector('body').classList.remove('background-img-2');
    document.querySelector('body').classList.remove('background-img-3');
    document.querySelector('body').classList.remove('background-img-4');
    document.querySelector('body').classList.remove('background-img-5');
    document.querySelector('body').classList.remove('background-img-6');
    document.querySelector('body').classList.remove('background-img-7');
    document.querySelector('body').classList.add(background);
    this.setNavbarColor(background);
    localStorage.setItem('headerBgsColor', background);
  }

  setNavbarColor(param) {
    const select = param.split('-');
    const color = select[select.length - 1];
    document.querySelector('.pcoded-header').classList.remove('header-telu');
    document.querySelector('.pcoded-header').classList.remove('header-blue');
    document.querySelector('.pcoded-header').classList.remove('header-red');
    document.querySelector('.pcoded-header').classList.remove('header-green');
    document.querySelector('.pcoded-header').classList.remove('header-purple');
    document.querySelector('.pcoded-header').classList.remove('header-blue');
    document.querySelector('.pcoded-header').classList.remove('header-dark');
    document.querySelector('.pcoded-header').classList.remove('header-info');
    if (color === '1' || color === '2' || color === '3' || color === '4' || color === '5' || color === '6' || color === '7') {
      document.querySelector('.pcoded-header').classList.add('header-dark');
    } else {
      document.querySelector('.pcoded-header').classList.add('header-' + color);
    }
  }

  // change main layout
  setLayout(layout) {
    this.isConfig = true;
    document.querySelector('.pcoded-navbar').classList.remove('menu-light');
    document.querySelector('.pcoded-navbar').classList.remove('menu-dark');
    document.querySelector('body').classList.remove('able-pro-dark');

    this.layoutType = layout;
    if (layout === 'menu-light' || layout === 'reset') {
      document.querySelector('.pcoded-navbar').classList.add('menu-light');
      // this.setHeaderBackground('background-img-7');
      localStorage.setItem('layoutType', layout);
    }
    if (layout === 'dark') {
      // this.setHeaderBackground('background-img-7');
      document.querySelector('body').classList.add('able-pro-dark');
      localStorage.setItem('layoutType', layout);
    }
    // if (layout === 'reset') {
    //   this.reset();
    // }
  }

}
