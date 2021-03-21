import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import * as mermaid from "mermaid";
import { prepareGraph } from '../templates-util';

@Component({
    selector: 'template-preview',
    templateUrl: './preview.component.html'
})
export class TemplatePreviewComponent implements AfterViewInit {
    graph: any;
    _model: any;
    @Input() set model(value: any) {
        this._model = value;
        this.graph = prepareGraph(this._model);
        this.renderGraph(this.graph);
    }

    get model() {
        return this._model;
    }

    @ViewChild("mermaid", { static: false }) mermaidDiv;

    ngAfterViewInit(): void {
        mermaid.initialize({ theme: "neutral", securityLevel: 'loose' });
        this.model ? this.renderGraph(this.graph) : null;
    }

    renderGraph(graph) {
        if (graph && graph.length > 0 && this.mermaidDiv) {
            mermaid.render("graphContainer", graph,
                (svgCode) => this.mermaidDiv.nativeElement.innerHTML = svgCode);
        }
    }
}
