import { Templates } from './templates.state';
import { ActionTypes } from './templates.actions';
import { transformTemplate } from '../templates-util';
import { safeLoad } from 'js-yaml';

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
                loadedTemplate = { ...loadedTemplate, definition, parsed }
            }
            return { ...state, loadedTemplate };
        }

        default: return state;
    }
}
