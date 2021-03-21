import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import * as mermaid from "mermaid";
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TemplatesState } from '../+state/templates.state';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { prepareGraph } from '../templates-util';

@Component({
    selector: 'template-definition',
    templateUrl: './overview.component.html'
})
export class TemplateOverviewComponent implements OnInit, OnDestroy {
    loadedTemplate$: Subscription;
    model: any;
    evaluatorVisible = false;
    
    constructor(public store$: Store<TemplatesState>, public activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadedTemplate$ = this.store$.select(p => p.templates.loadedTemplate)
            .pipe(filter(p => p))
            .subscribe(model => this.model = model);
    }
    ngOnDestroy(): void {
        this.loadedTemplate$?.unsubscribe();
    }
}
