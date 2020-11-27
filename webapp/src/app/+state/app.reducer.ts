import { App } from './app.state';
import { ActionTypes } from './app.actions';
import * as _ from "lodash-es";

export function appReducer(state: App, action: any): App {

    switch (action.type) {

        case ActionTypes.SetSearchPage: {
            return { ...state, searchParam: { ...state.searchParam, offset: action.payload } };
        }
        case ActionTypes.Search: {
            return { ...state, searchParam: action.payload };
        }
        case ActionTypes.SearchSuccess: {
            return { ...state, searchResults: action.payload };
        }

        case ActionTypes.Category: {
            return { ...state, category: null, filterParam: { ...state.filterParam, rules: null } };
        }
        case ActionTypes.CategorySuccess: {
            const category = action.payload.data || {};
            return {
                ...state, category, filterParam: {
                    ...state.filterParam, id: category.id, rules: category.rule_json
                }
            };
        }

        case ActionTypes.SetFilterPage: {
            return { ...state, filterParam: { ...state.filterParam, offset: action.payload } };
        }
        case ActionTypes.Filter: {
            return { ...state, filterParam: action.payload };
        }
        case ActionTypes.FilterSuccess: {
            return { ...state, filterResults: action.payload };
        }

        case ActionTypes.StockDetailsSuccess: {
            return { ...state, stockDetails: action.payload };
        }

        default: return state;
    }
}


