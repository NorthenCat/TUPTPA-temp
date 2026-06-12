import { OauthService } from 'src/app/_services/oauth.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class MenuResolver implements Resolve<any> {
  constructor(private oauthService: OauthService) { }
  resolve(): Observable<any> {
    return;
    // return this.oauthService.getDynamicMenu();
  }
}
