import { Injectable, Inject } from '@angular/core';
import { IBACKEND_URLS, BackendUrl } from '../lib/backend-urls';
import * as _ from 'lodash-es';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment"

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

    public getCategoryDetails(categoryId) {
        return (environment.cloudMode)
            ? this.httpClient.get(`${this.templateFileLocation}/grid/view/${categoryId}`, this.httpOptions)
            : this.httpClient.get(`${this.templateFileLocation}/category-${categoryId}.json`, this.httpOptions)
    }

    public getStocksByCategory(payload) {
        console.log('getStocksByCategory', payload);
        return (environment.cloudMode)
            ? this.httpClient.post(`${this.templateFileLocation}/grid/filter?include=intro,score`, payload)
            : this.httpClient.get(`${this.templateFileLocation}/filter-${payload.id}.json`, this.httpOptions)
    }

    public getStockDetails(url) {
        const qp = 'include=info,score,score.snowflake,analysis.extended.raw_data,analysis.extended.raw_data.insider_transactions&version=2.0';
        return (environment.cloudMode)
            ? this.httpClient.get(`${this.templateFileLocation}/company/${url}?${qp}`, this.httpOptions)
            : this.httpClient.get(`${this.templateFileLocation}/details.json?${qp}`, this.httpOptions)
    }

    public getSearchResults(queryString) {
        const payload = {
            "query": queryString,
            "highlightPostTag": " ",
            "highlightPreTag": " ",
            "restrictHighlightAndSnippetArrays": true
        }

        const qp = 'x-algolia-agent=Algolia%20for%20JavaScript%20(4.4.0)%3B%20Browser%20(lite)&x-algolia-api-key=be7c37718f927d0137a88a11b69ae419&x-algolia-application-id=17IQHZWXZW';
        return (environment.cloudMode)
            ? this.httpClient.get(`https://17iqhzwxzw-dsn.algolia.net/1/indexes/companies/query?${qp}`, this.httpOptions)
            : this.httpClient.get(`${this.templateFileLocation}/search.json?${qp}`, this.httpOptions)

    }
}
