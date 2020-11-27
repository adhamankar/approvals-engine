import { Templates } from './templates.state';
import { ActionTypes } from './templates.actions';

export function templatesReducer(state: Templates, action: any): Templates {
    switch (action.type) {
        case ActionTypes.LoadTemplatesSuccess: {
            return { ...state, list: action.payload };
        }

        case ActionTypes.UnloadTemplate: {
            return { ...state, loadedTemplate: null };
        }
        case ActionTypes.LoadTemplate: {
            return { ...state, templateToLoad: action.payload };
        }
        case ActionTypes.LoadTemplateSuccess: {
            return { ...state, loadedTemplate: action.payload };
        }

        default: return state;
    }
}
