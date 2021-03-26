import { Templates } from './templates.state';
import { ActionTypes } from './templates.actions';
import { transformTemplate } from '../templates-util';
import { safeLoad } from 'js-yaml';
import * as _ from "lodash-es";

export function templatesReducer(state: Templates, action: any): Templates {
    switch (action.type) {
        case ActionTypes.LoadTemplatesSuccess: {
            return { ...state, list: action.payload, loadedTemplate: null };
        }

        case ActionTypes.LoadTemplate: {
            return { ...state, templateToLoad: action.payload };
        }
        case ActionTypes.LoadTemplateSuccess: {
            const loadedTemplate = action.payload;
            if (loadedTemplate && loadedTemplate.definition) {
                loadedTemplate.parsed = safeLoad(loadedTemplate.definition)
                transformTemplate(loadedTemplate.parsed)
            }
            return { ...state, loadedTemplate };
        }

        case ActionTypes.UpdateDefinitionSuccess: {
            const definition = action.payload.definition;
            let loadedTemplate = state.loadedTemplate || {};
            if (loadedTemplate && definition) {
                let parsed = safeLoad(definition);
                transformTemplate(parsed)
                loadedTemplate = {
                    ...loadedTemplate, definition, parsed,
                    comments: action.payload.comments,
                    version: action.payload.version,
                    currentVersion: action.payload.version
                }
            }
            return { ...state, loadedTemplate };
        }

        case ActionTypes.LoadInstancesSuccess: {
            return { ...state, instances: action.payload };
        }

        case ActionTypes.CreateInstanceSuccess: {
            const instances = state.instances || { total: 0, records: [] };
            instances.total += 1;
            instances.records.splice(0, 0, action.payload);
            console.log(instances, action.payload);
            return { ...state, instances };
        }
        case ActionTypes.RejectWorkflowStageSuccess: {
            const instances = state.instances || {};
            const instance = _.find(state.instances.records, { id: action.payload.instanceId });
            if (instance) {
                instance.isCompleted = true;
                instance.history = instance.history || [];
                instance.history.push({ isApproved: false, previousStage: instance.currentStage, comments: action.payload.comments, createdOn: new Date() });
            }
            return { ...state, instances };
        }
        case ActionTypes.ApproveWorkflowStageSuccess: {
            const instances = state.instances || {};
            const instance = _.find(state.instances.records, { id: action.payload.id });
            if (instance) {
                instance.isCompleted = action.payload.isCompleted;
                instance.isApproved = action.payload.isApproved;
                instance.history = action.payload.history;
                instance.currentStage = action.payload.currentStage;
            }
            return { ...state, instances };
        }
        default: return state;
    }
}
