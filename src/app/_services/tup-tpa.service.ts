import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TupTpaService {
  private readonly baseUrl: string = environment.tupTpaApiUrl || '';

  private readonly viewLeaderStaffPath = '/tup-tpa/67ce82d6b5cee0f70958182e021c92e7';
  private readonly viewStaffPath = '/tup-tpa/068ae4fb55bae537723b6ea424f9f01a';
  private readonly getTpaPeriodPath = '/tup-tpa/8e3ef8a1cd9dd4e12b59480624784150';
  private readonly getNkuDataPath = '/tup-tpa/44b0ed23e0c87ae04682b8ee6840e4cc';
  private readonly updateNkuDataPath = '/tup-tpa/bb65bad4ce752951dada33b7865876dc';
  private readonly createNkuDataPath = '/tup-tpa/667650102c0e97074ba31b5c40578ebd';
  private readonly getOrganizationListPath = '/tup-tpa/d01cea0c7325f4285388428335a16248';
  private readonly getEmployeeDetailPath = '/tup-tpa/e87c9a80e29c1c4fee97d0031aaf64f1';
  private readonly getActiveTkpPath = '/tup-tpa/17b329b4381acf5454c8b071bebf05bc';
  private readonly getDetailTkpPath = '/tup-tpa/9bf757d59cdf8d94762545d8c62dea3a';
  private readonly insertTkpDetailPath = '/tup-tpa/7ced502e5f2e9d1285f2e796fb76a0d1';
  private readonly insertTkpPath = '/tup-tpa/0b401ef3968d1eec9155cce47856a260';
  private readonly deleteTkpDetailPath = '/tup-tpa/5d744fef5c0535f306c2b32d0000c9de';
  private readonly getIpkPath = '/tup-tpa/656a551f8ba8adf6e7602b73ff68960d';
  private readonly addTpaPeriodPath = '/tup-tpa/02f6bcbbb25f3ba02b741913e4ece81d';

  constructor(private http: HttpClient) {}

  /** View leader staff (data penilaian pegawai per atasan). */
  viewLeaderStaffData(tpaContentPeriodId: string, organizationId: string): Observable<any> {
    const params = new HttpParams()
      .set('tpa_content_period_id', tpaContentPeriodId)
      .set('organization_id', organizationId);

    return this.http.get(this.baseUrl + this.viewLeaderStaffPath, { params });
  }

  getViewStaffData(tpaContentPeriodId: string, assessorEmployeeId: string): Observable<any> {
    const params = new HttpParams()
      .set('tpa_content_period_id', tpaContentPeriodId)
      .set('assessor_employee_id', assessorEmployeeId);

    return this.http.get(this.baseUrl + this.viewStaffPath, { params });
  }

  getTpaPeriod(status?: number): Observable<any> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', String(status));
    }
    return this.http.get(this.baseUrl + this.getTpaPeriodPath, { params });
  }

  getTpaPeriodById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + this.getTpaPeriodPath + '/' + id);
  }

  addTpaPeriod(body: any): Observable<any> {
    return this.http.post(this.baseUrl + this.addTpaPeriodPath, body);
  }

  getNkuData(): Observable<any> {
    return this.http.get(this.baseUrl + this.getNkuDataPath);
  }

  updateNkuData(body: any): Observable<any> {
    return this.http.put(this.baseUrl + this.updateNkuDataPath, body);
  }

  createNkuData(body: any): Observable<any> {
    return this.http.post(this.baseUrl + this.createNkuDataPath, body);
  }

  getOrganizationList(search: string): Observable<any> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(this.baseUrl + this.getOrganizationListPath, { params });
  }

  getEmployeeDetail(employeeId: string): Observable<any> {
    return this.http.get(
      this.baseUrl + this.getEmployeeDetailPath + '/' + employeeId
    );
  }

  getActiveTkp(employeeId: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('employee_id', employeeId)
      .set('page', String(page));

    return this.http.get(this.baseUrl + this.getActiveTkpPath, { params });
  }

  getDetailTkp(tpaTkpId: string): Observable<any> {
    console.log('[SERVICE][GetDetailTKP] URL =', this.baseUrl + this.getDetailTkpPath + '/' + tpaTkpId);
    console.log('[SERVICE][GetDetailTKP] tpaTkpId =', tpaTkpId);

    return this.http.get(
      this.baseUrl + this.getDetailTkpPath + '/' + tpaTkpId
    );
  }

  insertTkp(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl + this.insertTkpPath, formData);
  }

  insertTkpDetail(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl + this.insertTkpDetailPath, formData);
  }

  deleteTkpDetail(tkpDetailId: string): Observable<any> {
    return this.http.delete(
      this.baseUrl + this.deleteTkpDetailPath + '/' + tkpDetailId
    );
  }

  getIpk(tpaContentPeriodId: string, nik: string): Observable<any> {
    console.log('[SERVICE][GetIPK] URL =', this.baseUrl + this.getIpkPath + '/' + tpaContentPeriodId + '/' + nik);
    console.log('[SERVICE][GetIPK] tpa_content_period_id =', tpaContentPeriodId);
    console.log('[SERVICE][GetIPK] nik =', nik);

    return this.http.get(
      this.baseUrl + this.getIpkPath + '/' + tpaContentPeriodId + '/' + nik
    );
  }
}