import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash-es';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendUrl, IBACKEND_URLS } from './lib/backend-urls';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TrackerService {

    templateFileLocation = './staticfiles';
    httpOptions: any;

    constructor(@Inject(IBACKEND_URLS) backendUrls: BackendUrl[], private httpClient: HttpClient) {
        if (environment.cloudMode) {
            const found = _.find(backendUrls, { key: 'api' })
            this.templateFileLocation = (found) ? `${found.value}` : '';
        }
        this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    }

    public getAllCategories(payload) {
        return (environment.cloudMode)
            ? this.httpClient.post(`${this.templateFileLocation}/grid/view/search`, payload)
            : this.httpClient.get(`${this.templateFileLocation}/all-categories.json`, this.httpOptions)
    }
}
