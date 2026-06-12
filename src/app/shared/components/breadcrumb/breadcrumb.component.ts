import { NavigationItem } from 'src/app/layout/admin/navigation/navigation';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultConfig } from 'src/app/app-config';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() type: string;
  public navigation: any;
  public breadcrumbList: Array<any> = [];
  public navigationList: Array<any> = [];

  constructor(
    public nav: NavigationItem,
    private broadcasterService: BroadcasterService,
    private translateService: TranslateService,
    private route: Router,
    private title: Title
    ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
      this.loadTitle();
    });
    broadcasterService.getMenuBroadcast$.subscribe(res => {
      setTimeout(() => {
        this.navigation = this.nav.get();
      }, 100);
    });
    this.type = 'theme2';
    this.setBreadcrumb();
    this.navigation = this.nav.get();
  }

  ngOnInit() {
    this.loadTitle();
  }

  loadTitle() {
    let routerUrl: string;
    routerUrl = this.route.url;
    if (routerUrl && typeof routerUrl === 'string') {
      this.filterNavigation(routerUrl);
    }
  }

  setBreadcrumb() {
    let routerUrl: string;
    this.route.events.subscribe((router: any) => {
      routerUrl = router.urlAfterRedirects;
      if (routerUrl && typeof routerUrl === 'string') {
        this.breadcrumbList.length = 0;
        const activeLink = router.url;
        this.filterNavigation(activeLink);
      }
    });
  }

  filterNavigation(activeLink) {
    let result = [];
    let title = 'Welcome';
    this.navigation.forEach((a) => {
      if (a.type === 'item' && 'url' in a && a.url === activeLink) {
        result = [
          {
            url: ('url' in a) ? a.url : false,
            title: a.title,
            breadcrumbs: ('breadcrumbs' in a) ? a.breadcrumbs : true,
            type: a.type
          }
        ];
        title = a.title;
      } else {
        if (a.type === 'group' && 'children' in a) {
          a.children.forEach((b) => {
            if (b.type === 'item' && 'url' in b && b.url === activeLink) {
              result = [
                {
                  url: ('url' in b) ? b.url : false,
                  title: b.title,
                  breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                  type: b.type
                }
              ];
              title = b.title;
            } else {
              if (b.type === 'collapse' && 'children' in b) {
                b.children.forEach((c) => {
                  if (c.type === 'item' && 'url' in c && c.url === activeLink) {
                    result = [
                      {
                        url: ('url' in b) ? b.url : false,
                        title: b.title,
                        breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                        type: b.type
                      },
                      {
                        url: ('url' in c) ? c.url : false,
                        title: c.title,
                        breadcrumbs: ('breadcrumbs' in c) ? c.breadcrumbs : true,
                        type: c.type
                      }
                    ];
                    title = c.title;
                  } else {
                    if (c.type === 'collapse' && 'children' in c) {
                      c.children.forEach((d) => {
                        if (d.type === 'item' && 'url' in d && d.url === activeLink) {
                          result = [
                            {
                              url: ('url' in b) ? b.url : false,
                              title: b.title,
                              breadcrumbs: ('breadcrumbs' in b) ? b.breadcrumbs : true,
                              type: b.type
                            },
                            {
                              url: ('url' in c) ? c.url : false,
                              title: c.title,
                              breadcrumbs: ('breadcrumbs' in c) ? c.breadcrumbs : true,
                              type: c.type
                            },
                            {
                              url: ('url' in d) ? d.url : false,
                              title: d.title,
                              breadcrumbs: ('breadcrumbs' in c) ? d.breadcrumbs : true,
                              type: d.type
                            }
                          ];
                          title = d.title;
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
    this.navigationList = result;
    this.translateService.get(title).subscribe((text) => {
      this.title.setTitle(text + ' | ' + DefaultConfig.Application.appName);
    });
  }
}
