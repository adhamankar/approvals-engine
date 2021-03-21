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

    constructor(public store$: Store<TemplatesState>, public activatedRoute: ActivatedRoute, public router: Router) {
    }
    ngOnInit(): void {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => this.currentRoute = event.url);

        this.routerParam = this.activatedRoute.params
            .pipe(filter(p => p.code), map(p => p.code))
            .subscribe(code => this.store$.dispatch(new LoadTemplateAction(code)));

        this.loadedTemplate$ = this.store$.select(p => p.templates.loadedTemplate)
            .pipe(filter(p => p))
            .subscribe(model => this.model = model);
    }
    ngOnDestroy(): void {
        this.routerParam ? this.routerParam.unsubscribe() : null;
        this.loadedTemplate$ ? this.loadedTemplate$.unsubscribe() : null;
    }
}
