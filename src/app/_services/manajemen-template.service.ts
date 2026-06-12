import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';       
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ManajemenTemplateService extends BaseService {
    private namespace = 'manajemen-template';

    constructor(
        http: HttpClient,
    ) {
        super(http);
    }

    getFakeData(): Observable<any> {
        return this.getApi('fake-data/datatable-data.json');
    }
}