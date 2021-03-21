import { Injectable, Inject } from '@angular/core';
import { IBACKEND_URLS, BackendUrl } from '../lib/backend-urls';
import * as _ from 'lodash-es';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { safeLoad } from 'js-yaml';
import { environment } from 'src/environments/environment';
import { combineLatest } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateService {
    templateUri = './staticfiles';
    httpOptions: any;

    constructor(@Inject(IBACKEND_URLS) backendUrls: BackendUrl[], private httpClient: HttpClient) {
        if (environment.cloudMode) {
            const found = _.find(backendUrls, { key: 'api' })
            this.templateUri = (found) ? `${found.value}` : '';
        }
        this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    }

    public loadTemplates(param) {
        if (environment.cloudMode) {
            return this.httpClient.get(`${this.templateUri}/workflows`, this.httpOptions)
                .pipe(map((result: any) => {
                    if (result) {
                        return {
                            title: "Approval workflows",
                            groups: [{ code: "type", title: "Groups", list: result.groups }],
                            templates: _.map(result.workflows.records, template => {
                                template.type = template.workflowGroupCode;
                                return template;
                            })
                        }
                    }
                    return result;
                }));
        } else {
            return this.httpClient.get(`${this.templateUri}/list.yaml`, { responseType: "text" })
                .pipe(map(yamlString => {
                    try {
                        const result = safeLoad(yamlString);
                        if (param && param.code && param.code.length > 0 &&
                            result && result.templates && result.templates.length > 0) {
                            result.templates = _.filter(result.templates, (template) => _.includes(template.type, param.code));
                        }
                        return result;
                    } catch (e) { return ''; }
                }));
        }
    }
    public loadTemplate(templateCode) {
        if (environment.cloudMode) {
            return this.httpClient.get(`${this.templateUri}/workflows/${templateCode.toLowerCase()}`, this.httpOptions);
        } else {
            return combineLatest([
                this.loadTemplates(null)
                    .pipe(filter(p => p && p.templates), map(p => p.templates)),
                this.httpClient.get(`${this.templateUri}/${templateCode.toLowerCase()}.yaml`, { responseType: "text" })
                    .pipe(filter(p => p !== null))
            ]).pipe(map(([templates, details]) => {
                var found = _.find(templates, { code: templateCode });
                found.definition = details;
                return found;
            }));
        }
    }

    public updateDefinition(payload) {
        return this.httpClient.post(`${this.templateUri}/workflows/${payload.code}`, payload, this.httpOptions);
    }
}
