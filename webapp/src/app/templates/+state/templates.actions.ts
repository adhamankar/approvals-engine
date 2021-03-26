import { Action } from '@ngrx/store';
import { type } from 'src/app/lib/utils';

export const ActionTypes = {
    LoadFile: type("[LoadFile]"),

    LoadTemplates: type('[LoadTemplates]'),
    LoadTemplatesFailed: type('[LoadTemplates] Failed'),
    LoadTemplatesSuccess: type('[LoadTemplates] Success'),

    LoadTemplate: type('[LoadTemplate]'),
    LoadTemplateFailed: type('[LoadTemplate] Failed'),
    LoadTemplateSuccess: type('[LoadTemplate] Success'),

    UpdateDefinition: type('[UpdateDefinition]'),
    UpdateDefinitionFailed: type('[UpdateDefinition] Failed'),
    UpdateDefinitionSuccess: type('[UpdateDefinition] Success'),

    LoadInstances: type('[LoadInstances]'),
    LoadInstancesFailed: type('[LoadInstances] Failed'),
    LoadInstancesSuccess: type('[LoadInstances] Success'),

    CreateInstance: type('[CreateInstance]'),
    CreateInstanceFailed: type('[CreateInstance] Failed'),
    CreateInstanceSuccess: type('[CreateInstance] Success'),

    ApproveWorkflowStage: type('[ApproveWorkflowStage]'),
    ApproveWorkflowStageFailed: type('[ApproveWorkflowStage] Failed'),
    ApproveWorkflowStageSuccess: type('[ApproveWorkflowStage] Success'),

    RejectWorkflowStage: type('[RejectWorkflowStage]'),
    RejectWorkflowStageFailed: type('[RejectWorkflowStage] Failed'),
    RejectWorkflowStageSuccess: type('[RejectWorkflowStage] Success')
}

export class LoadFileAction implements Action {
    type = ActionTypes.LoadFile;
    constructor(public payload: any) { }
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

export class LoadInstancesAction implements Action {
    type = ActionTypes.LoadInstances;
    constructor(public payload: any) { }
}

export class CreateInstanceAction implements Action {
    type = ActionTypes.CreateInstance;
    constructor(public payload: any) { }
}

export class ApproveWorkflowStageAction implements Action {
    type = ActionTypes.ApproveWorkflowStage;
    constructor(public payload: any) { }
}

export class RejectWorkflowStageAction implements Action {
    type = ActionTypes.RejectWorkflowStage;
    constructor(public payload: any) { }
}
