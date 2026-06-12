import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Endpoint } from '../_classes/endpoint';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable()
export class BaseService {
  constructor(protected http: HttpClient) {}
  private endpoint = new Endpoint();

  getFormUrlEncoded(toConvert) {
    const formBody = [];
    for (const property in toConvert) {
      if (toConvert.hasOwnProperty(property)) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(toConvert[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
    }
    return formBody.join('&');
  }

  loopParam(params) {
    let query = new HttpParams();
    const parameter = (params !== null) ? params : {};
    const result = Object.entries(parameter);
    for (let i = 0; i < result.length; i++) {
      query = query.set(result[i][0].toString(), result[i][1].toString());
    }
    return query;
  }

  protected getUrl(namespace, key, context: any = '') {
    return this.endpoint.getUrl(namespace, key, context);
  }

  protected getApi(url, params: any = null) {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const query = this.loopParam(params);
    return this.http.get(url, { headers, params: query });
  }

  protected postApi(url, request) {
    const query = this.getFormUrlEncoded(request);
    return this.http.post(url, query, httpOptions);
  }

  protected putApi(url, request?) {
    return this.http.put(url, request);
  }

  protected delApi(url) {
    return this.http.delete(url);
  }

  protected extractData(res: HttpResponse<any>) {
    const body = res;
    return body || {};
  }

  protected dtParam(param) {
    const perPage = param.length;
    const page = param.start / param.length + 1;
    const keyword = param.search.value;
    return `${perPage}/${keyword}?page=${page}`;
  }
}
