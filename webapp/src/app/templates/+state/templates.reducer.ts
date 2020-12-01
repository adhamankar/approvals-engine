import { Templates } from './templates.state';
import { ActionTypes } from './templates.actions';
import { transformTemplate } from '../templates-util';

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
            transformTemplate(loadedTemplate)
            return { ...state, loadedTemplate };
        }

        default: return state;
    }
}
