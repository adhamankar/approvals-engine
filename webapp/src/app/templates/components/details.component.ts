import { Component, Input, Output, EventEmitter, Inject, AfterContentInit, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TemplatesState } from '../+state/templates.state';
import { filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoadTemplateAction } from '../+state/templates.actions';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'template-details',
    templateUrl: './details.component.html'
})
export class TemplateDetailsComponent implements OnInit, OnDestroy {
    cloudMode = environment.cloudMode;
    templateFileLocation = "";

    routerParam: Subscription;

    loadedTemplate$: Subscription;
    model: any;
    showSummary = false;
    currentRoute: string;
    versions: any;

    constructor(public store$: Store<TemplatesState>, public activatedRoute: ActivatedRoute, public router: Router) {
    }
    ngOnInit(): void {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => this.currentRoute = event.url);

        this.routerParam = this.activatedRoute.params
            .pipe(filter(p => p.code), map(p => p.code))
            .subscribe(code => this.store$.dispatch(new LoadTemplateAction({ code })));

        this.loadedTemplate$ = this.store$.select(p => p.templates.loadedTemplate)
            .pipe(filter(p => p))
            .subscribe(model => {
                this.model = model;
                //this.model.currentVersion = 10;
                this.versions = [];
                if (this.model.currentVersion > 0) {
                    _.map(_.range(this.model.currentVersion, 0), v => this.versions.push(v));
                }
            });
    }
    ngOnDestroy(): void {
        this.routerParam ? this.routerParam.unsubscribe() : null;
        this.loadedTemplate$ ? this.loadedTemplate$.unsubscribe() : null;
    }

    onVersionChange(value) {
        this.store$.dispatch(new LoadTemplateAction({ code: this.model.code, version: value }));
    }
}
