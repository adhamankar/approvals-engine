import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { CreateInstanceAction, LoadInstancesAction, ApproveWorkflowStageAction, RejectWorkflowStageAction } from "../+state/templates.actions";
import { TemplatesState } from "../+state/templates.state";
import * as _ from 'lodash-es';

@Component({
    selector: "instances",
    templateUrl: "./instances.component.html"
})
export class InstancesComponent implements OnInit, OnDestroy {
    public $template: Subscription;
    public model: any;
    public $instances: Subscription;
    public instances: any;

    evaluatorVisible = false;
    public pageIndex = 1;

    constructor(public store$: Store<TemplatesState>) { }

    ngOnInit(): void {
        this.$instances = this.store$.select(p => p.templates.instances)
            .subscribe(instances => this.instances = instances);

        this.$template = this.store$.select(p => p.templates.loadedTemplate)
            .pipe(filter(p => p))
            .subscribe(template => {
                this.model = template;
                this.loadInstances();
            });
    }
    ngOnDestroy(): void {
        this.$template?.unsubscribe();
        this.$instances?.unsubscribe();
    }

    reset() {
        if (this.model.parsed && this.model.parsed.parameters) {
            this.model.parsed.parameters.forEach(p => p.value = '');
        }
    }

    instantiate() {
        this.store$.dispatch(new CreateInstanceAction({
            code: this.model.code,
            parameters: _.filter(_.map(this.model.parsed.parameters, p => _.pick(p, ['code', 'value'])), p => p.value)
        }));
    }

    loadInstances() {
        this.store$.dispatch(new LoadInstancesAction({ code: this.model.code, pageIndex: this.pageIndex }));
    }

    onApprove(instance) {
        this.store$.dispatch(new ApproveWorkflowStageAction({code: this.model.code, instanceId: instance.id, currentStage: instance.currentStage }));
    }
    onReject(instance) {
        this.store$.dispatch(new RejectWorkflowStageAction({code: this.model.code, instanceId: instance.id, currentStage: instance.currentStage }));
    }
}
