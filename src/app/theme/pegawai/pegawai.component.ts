import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';

@Component({
  selector: 'app-pegawai',
  templateUrl: './pegawai.component.html',
  styleUrls: ['./pegawai.component.scss']
})
export class PegawaiComponent implements OnInit, OnDestroy {
  public activeTab: string = 'target-kinerja';
  
  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService
  ) {
    this.translateService.setDefaultLang(localStorage.getItem('lang'));
    this.broadcasterService.changeLangBroadcast$.subscribe(res => {
      this.translateService.setDefaultLang(res.lang);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
