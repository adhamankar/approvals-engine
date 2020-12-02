import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TemplatesState } from '../+state/templates.state';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { prepareGraph, evaluateExpression } from '../templates-util';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'template-evaluate',
    templateUrl: './evaluate.component.html'
})
export class TemplateEvaluatorComponent implements OnInit, OnDestroy {
    loadedTemplate$: Subscription;
    model: any;

    instances = [];
    currentInstance = null;

    constructor(public store$: Store<TemplatesState>, public activatedRoute: ActivatedRoute, public messageService: MessageService) {
    }

    ngOnInit(): void {
        this.loadedTemplate$ = this.store$.select(p => p.templates.loadedTemplate)
            .pipe(filter(p => p))
            .subscribe(model => {
                this.model = model;
                this.model.definition = prepareGraph(this.model);
            });
    }
    ngOnDestroy(): void {
        this.loadedTemplate$ ? this.loadedTemplate$.unsubscribe() : null;
    }

    reset() {
        if (this.model && this.model.parameters) {
            this.model.parameters.forEach(p => p.value = '');
        }
    }

    startEvaluation() {
        this.currentInstance = {
            parameters: this.model.parameters
                ? _.filter(_.map(this.model.parameters, p => _.pick(p, ['code', 'value'])), p => p.value)
                : null,
            currentStage: null,
            visited: [],
            completed: false
        }
        this.reset();
        if (this.model.stages) {
            this.currentInstance.currentStage = _.find(this.model.stages, { initial: true });
            if (!this.currentInstance.currentStage) {
                this.messageService.add({ summary: "Failed to start workflow", detail: "No stage is marked as Initial stage.", severity: "error" });
                return;
            }

            if (this.currentInstance.currentStage.final === true) {
                this.currentInstance.nextStage = null;
            } else {
                this.currentInstance.nextStage = this.evaluateNextStage(this.currentInstance.currentStage.next, this.currentInstance.parameters);
            }
        }
    }

    evaluateNextStage(nextStages, parameters) {
        if (!nextStages || nextStages.length === 0) {
            this.messageService.add({ summary: "Failed to find next stage", detail: "No next stage configured.", severity: "error" });
            return null;
        }
        let next = null;
        _.sortBy(nextStages, 'priority').forEach(stage => {
            if (next === null && evaluateExpression(stage.condition, parameters) === true) {
                next = stage;
            }
        });
        return (next)
            ? next.stage
            : this.messageService.add({ summary: "Failed to find next stage", detail: "None of the conditions are satisfied.", severity: "error" });
    }

    approve() {
        this.currentInstance.visited.push(this.currentInstance.currentStage.title);
        if (this.currentInstance.currentStage.final === true) {
            this.currentInstance.completed = true;
            this.messageService.add({ summary: "Approval flow complete", detail: "The workflow completed successfully.", severity: "success" });
            return;
        }
        this.currentInstance.currentStage = _.find(this.model.stages, { code: this.currentInstance.nextStage });
        if (!this.currentInstance.currentStage) {
            this.messageService.add({ summary: "Failed to procced", detail: "Invalid next stage configured.", severity: "error" });
            return;
        }

        if (this.currentInstance.currentStage.final !== true) {
            this.currentInstance.nextStage = this.evaluateNextStage(this.currentInstance.currentStage.next, this.currentInstance.parameters);
        }
    }

    reject = () => this.close();
    close = () => this.currentInstance = null;
}
