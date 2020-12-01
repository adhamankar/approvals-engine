import { Component, Input, Output, EventEmitter, Inject, AfterContentInit, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { BackendUrl, IBACKEND_URLS } from 'src/app/lib/backend-urls';
import * as mermaid from "mermaid";
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TemplatesState } from '../+state/templates.state';
import { filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LoadTemplateAction } from '../+state/templates.actions';
import { prepareGraph } from '../templates-util';

@Component({
    selector: 'template-definition',
    templateUrl: './definition.component.html'
})
export class TemplateDefinitionComponent implements OnInit, OnDestroy, AfterViewInit {
    loadedTemplate$: Subscription;
    model: any;
    @ViewChild("mermaid", { static: false }) mermaidDiv;
    constructor(public store$: Store<TemplatesState>, public activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadedTemplate$ = this.store$.select(p => p.templates.loadedTemplate)
            .pipe(filter(p => p))
            .subscribe(model => {
                this.model = model;
                this.model.definition = prepareGraph(this.model);
                this.renderGraph(this.model.definition);
            });
    }
    ngOnDestroy(): void {
        this.loadedTemplate$ ? this.loadedTemplate$.unsubscribe() : null;
    }

    ngAfterViewInit(): void {
        mermaid.initialize({ theme: "neutral", securityLevel: 'loose' });
        this.model ? this.renderGraph(this.model.definition) : null;
    }

    renderGraph(definition) {
        if (definition && definition.length > 0 && this.mermaidDiv) {
            mermaid.render("graphContainer", definition,
                (svgCode) => this.mermaidDiv.nativeElement.innerHTML = svgCode);
        }
    }
}
