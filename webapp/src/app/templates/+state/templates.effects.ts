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
            this.templateService.loadTemplates()
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
}
