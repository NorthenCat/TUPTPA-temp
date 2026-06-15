import { Component, OnInit } from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public defaultConfig: any;
  public activeTab: string = 'profil';

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.defaultConfig = DefaultConfig;
  }

  public heroImages = [
    'assets/images/hero1.png',
    'assets/images/hero2.png',
    'assets/images/hero3.png'
  ];
  public currentHeroIndex = 0;
  private heroInterval: any;

  ngOnInit() {
    this.startHeroSlider();
  }

  startHeroSlider() {
    this.heroInterval = setInterval(() => {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
    }, 3000);
  }

  setHeroIndex(index: number) {
    this.currentHeroIndex = index;
    clearInterval(this.heroInterval);
    this.startHeroSlider();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
