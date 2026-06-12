import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public appName: string;
  public nextConfig: any;
  public menuClass: boolean;
  public collapseStyle: string;
  public windowWidth: number;

  @Output() NavHeaderMobCollapse = new EventEmitter();
  @Output() NavCollapse = new EventEmitter();

  constructor(private broadcasterService: BroadcasterService) {
    this.appName = DefaultConfig.Application.appName;
    this.nextConfig = DefaultConfig.config;
    this.menuClass = false;
    this.collapseStyle = 'none';
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() { }

  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.collapseStyle = (this.menuClass) ? 'block' : 'none';
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.NavCollapse.emit();
      this.broadcasterService.hideProfileMenuBroadcast(true);
    } else {
      this.NavHeaderMobCollapse.emit();
    }
  }

}
