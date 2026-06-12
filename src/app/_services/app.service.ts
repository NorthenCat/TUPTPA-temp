import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AppService extends BaseService {
  private namespace = 'app';

  constructor(
    http: HttpClient,
  ) {
    super(http);
  }


  getFakeData(): Observable<any> {
    return this.getApi('fake-data/datatable-data.json');
  }

  getFaqData(param): Observable<any> {
    const url = this.getUrl(this.namespace, 'faq', this.dtParam(param));
    return this.getApi(url);
  }

  getVendor(param): Observable<any> {
    const url = this.getUrl('app', 'get_vendor', param);
    return this.getApi(url);
  }

  createVendor(param): Observable<any> {
    const url = this.getUrl('app', 'create_vendor');
    return this.postApi(url, param);
  }

  getVendorType(param): Observable<any> {
    const url = this.getUrl('app', 'get_vendortype', param);
    return this.getApi(url);
  }  

  updateVendor(param): Observable<any> {
    const url = this.getUrl('app', 'update_vendor');
    return this.putApi(url, param);
  }


  // getVendor(param): Observable<any> {
  //   const url = this.getUrl('vendor', 'get_vendor', param);
  //   return this.getApi(url);
  // }
}
