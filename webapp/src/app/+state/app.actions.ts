import { Action } from '@ngrx/store';
import { type } from '../lib/utils';

export const ActionTypes = {
    SetSearchPage: type('[SetSearchPage]'),

    Search: type('[Search]'),
    SearchFailed: type('[Search] Failed'),
    SearchSuccess: type('[Search] Success'),

    Category: type('[Category]'),
    CategoryFailed: type('[Category] Failed'),
    CategorySuccess: type('[Category] Success'),

    SetFilterPage: type('[SetFilterPage]'),

    Filter: type('[Filter]'),
    FilterFailed: type('[Filter] Failed'),
    FilterSuccess: type('[Filter] Success'),

    StockDetails: type('[StockDetails]'),
    StockDetailsFailed: type('[StockDetails] Failed'),
    StockDetailsSuccess: type('[StockDetails] Success'),
}

export class SetSearchPageAction implements Action {
    type = ActionTypes.SetSearchPage;
    constructor(public payload: any) { }
}
export class SearchAction implements Action {
    type = ActionTypes.Search;
    constructor(public payload: any) { }
}
export class GetCategoryAction implements Action {
    type = ActionTypes.Category;
    constructor(public payload: any) { }
}
export class SetFilterPageAction implements Action {
    type = ActionTypes.SetFilterPage;
    constructor(public payload: any) { }
}
export class FilterAction implements Action {
    type = ActionTypes.Filter;
    constructor(public payload: any) { }
}
export class LoadStockDetailsAction implements Action {
    type = ActionTypes.StockDetails;
    constructor(public payload: any) { }
}

export type Actions =
    SetSearchPageAction
    | SearchAction
    | GetCategoryAction
    | SetFilterPageAction
    | FilterAction
    | LoadStockDetailsAction
    ;
