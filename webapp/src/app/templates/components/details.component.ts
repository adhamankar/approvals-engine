import { Component, Input, Output, EventEmitter, Inject, AfterContentInit, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { BackendUrl, IBACKEND_URLS } from 'src/app/lib/backend-urls';
import * as mermaid from "mermaid";

@Component({
    selector: 'template-details',
    templateUrl: './details.component.html'
})
export class TemplateDetailsComponent implements AfterViewInit {

    templateFileLocation = "";

    @Input() sections = [];
    _model: any;
    @Input() set model(value: any) {
        value.graphDefinition = this.prepareGraph(value)
        this._model = value;
    }
    get model() {
        return this._model;
    }

    @Output() close = new EventEmitter<any>();
    onClose = () => this.close.emit();

    @ViewChild("mermaid", { static: false }) mermaidDiv;

    constructor(@Inject(IBACKEND_URLS) backendUrls: BackendUrl[]) {
        const found = _.find(backendUrls, { key: 'templates' })
        this.templateFileLocation = (found) ? `${found.value}` : '';
    }
    ngAfterViewInit(): void {
        mermaid.initialize({
            theme: "neutral"
        });
        if (this.model && this.model.graphDefinition) {
            this.renderGraph(this.model.graphDefinition);
        }
    }

    prepareGraph(model) {
        if (model && model.stages && model.stages.length > 0) {
            const stageDefinitions = [];
            stageDefinitions.push("graph LR");
            model.stages.forEach(stage => {
                if (stage.next && stage.next.length > 0) {
                    stage.next.forEach(nextStage => {
                        stageDefinitions.push(`${stage.code}([${stage.title}])-->${nextStage.stage}([${stage.title}])`);
                    });
                }
            });
            if (stageDefinitions.length >= 2) {
                return stageDefinitions.join('\n');
            }
        }
        return '';
    }

    renderGraph(definition) {
        console.log(definition);
        if (definition && definition.length > 0 && this.mermaidDiv) {
            const element: any = this.mermaidDiv.nativeElement;
            mermaid.render("graphDiv", definition, (svgCode, bindFunctions) => {
                element.innerHTML = svgCode;
            });
        }
    }
}
