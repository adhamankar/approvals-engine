import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as templateActions from './templates.actions';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { TemplateService } from '../template.service';

@Injectable()
export class TemplatesEffects {
    constructor(private actions$: Actions, public templateService: TemplateService) { }

    @Effect() loadTemplates = this.actions$.pipe(ofType(templateActions.ActionTypes.LoadTemplates),
        switchMap((action: any) =>
            this.templateService.loadTemplates(action.payload)
                .pipe(
                    map(payload => ({ type: templateActions.ActionTypes.LoadTemplatesSuccess, payload })),
                    catchError(() => of({ type: templateActions.ActionTypes.LoadTemplatesFailed }))
                )
        )
    );
    @Effect() loadTemplate = this.actions$.pipe(ofType(templateActions.ActionTypes.LoadTemplate),
        switchMap((action: any) =>
            this.templateService.loadTemplate(action.payload)
                .pipe(
                    map(payload => ({ type: templateActions.ActionTypes.LoadTemplateSuccess, payload })),
                    catchError(() => of({ type: templateActions.ActionTypes.LoadTemplateFailed }))
                )
        )
    );
    @Effect() updateDefinition = this.actions$.pipe(ofType(templateActions.ActionTypes.UpdateDefinition),
        switchMap((action: any) =>
            this.templateService.updateDefinition(action.payload)
                .pipe(
                    map((payload) => ({ type: templateActions.ActionTypes.UpdateDefinitionSuccess, payload })),
                    catchError(() => of({ type: templateActions.ActionTypes.UpdateDefinitionFailed }))
                )
        )
    );
    @Effect() loadInstances = this.actions$.pipe(ofType(templateActions.ActionTypes.LoadInstances),
        switchMap((action: any) =>
            this.templateService.loadInstances(action.payload)
                .pipe(
                    map(payload => ({ type: templateActions.ActionTypes.LoadInstancesSuccess, payload })),
                    catchError(() => of({ type: templateActions.ActionTypes.LoadInstancesFailed }))
                )
        )
    );
    @Effect() createInstance = this.actions$.pipe(ofType(templateActions.ActionTypes.CreateInstance),
        switchMap((action: any) =>
            this.templateService.createInstance(action.payload)
                .pipe(
                    map((payload) => ({ type: templateActions.ActionTypes.CreateInstanceSuccess, payload })),
                    catchError(() => of({ type: templateActions.ActionTypes.CreateInstanceFailed }))
                )
        )
    );
    @Effect() approveWorkflowStage = this.actions$.pipe(ofType(templateActions.ActionTypes.ApproveWorkflowStage),
        switchMap((action: any) =>
            this.templateService.approveWorkflowStage(action.payload)
                .pipe(
                    map((payload) => ({ type: templateActions.ActionTypes.ApproveWorkflowStageSuccess, payload })),
                    catchError(() => of({ type: templateActions.ActionTypes.ApproveWorkflowStageFailed }))
                )
        )
    );
    @Effect() rejectWorkflowStage = this.actions$.pipe(ofType(templateActions.ActionTypes.RejectWorkflowStage),
        switchMap((action: any) =>
            this.templateService.rejectWorkflowStage(action.payload)
                .pipe(
                    map(() => ({ type: templateActions.ActionTypes.RejectWorkflowStageSuccess, payload: action.payload })),
                    catchError(() => of({ type: templateActions.ActionTypes.RejectWorkflowStageFailed }))
                )
        )
    );
}
