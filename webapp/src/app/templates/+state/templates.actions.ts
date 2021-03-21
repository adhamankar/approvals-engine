import { Action } from '@ngrx/store';
import { type } from 'src/app/lib/utils';

export const ActionTypes = {
    LoadTemplates: type('[LoadTemplates]'),
    LoadTemplatesFailed: type('[LoadTemplates] Failed'),
    LoadTemplatesSuccess: type('[LoadTemplates] Success'),

    LoadTemplate: type('[LoadTemplate]'),
    LoadTemplateFailed: type('[LoadTemplate] Failed'),
    LoadTemplateSuccess: type('[LoadTemplate] Success'),

    UpdateDefinition: type('[UpdateDefinition]'),
    UpdateDefinitionFailed: type('[UpdateDefinition] Failed'),
    UpdateDefinitionSuccess: type('[UpdateDefinition] Success'),

    LoadFile: type("[LoadFile]")
}

export class LoadTemplatesAction implements Action {
    type = ActionTypes.LoadTemplates;
    constructor(public payload: any) { }
}

export class LoadTemplateAction implements Action {
    type = ActionTypes.LoadTemplate;
    constructor(public payload: any) { }
}

export class UpdateDefinitionAction implements Action {
    type = ActionTypes.UpdateDefinition;
    constructor(public payload: any) { }
}

export class LoadFileAction implements Action {
    type = ActionTypes.LoadFile;
    constructor(public payload: any) { }
}

export type Actions =
    LoadTemplatesAction
    | LoadTemplateAction
    | LoadFileAction
    ;
