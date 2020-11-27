import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as appActions from './app.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TrackerService } from './tracker.service';

@Injectable()
export class AppEffects {
  constructor(private trackerService: TrackerService, private actions$: Actions) { }

  @Effect() search = this.actions$.pipe(ofType(appActions.ActionTypes.Search),
    switchMap((action: any) =>
      this.trackerService.getAllCategories(action.payload)
        .pipe(
          map(payload => ({ type: appActions.ActionTypes.SearchSuccess, payload })),
          catchError(() => of({ type: appActions.ActionTypes.SearchFailed }))
        )
    )
  );

  @Effect() getCategoryDetails = this.actions$.pipe(ofType(appActions.ActionTypes.Category),
    switchMap((action: any) =>
      this.trackerService.getCategoryDetails(action.payload)
        .pipe(
          map(payload => ({ type: appActions.ActionTypes.CategorySuccess, payload })),
          catchError(() => of({ type: appActions.ActionTypes.CategoryFailed }))
        )
    )
  );

  @Effect() filter = this.actions$.pipe(ofType(appActions.ActionTypes.Filter),
    switchMap((action: any) =>
      this.trackerService.getStocksByCategory(action.payload)
        .pipe(
          map(payload => ({ type: appActions.ActionTypes.FilterSuccess, payload })),
          catchError(() => of({ type: appActions.ActionTypes.FilterFailed }))
        )
    )
  );

  @Effect() getStockDetails = this.actions$.pipe(ofType(appActions.ActionTypes.StockDetails),
    switchMap((action: any) =>
      this.trackerService.getStockDetails(action.payload)
        .pipe(
          map(payload => ({ type: appActions.ActionTypes.StockDetailsSuccess, payload })),
          catchError(() => of({ type: appActions.ActionTypes.StockDetailsFailed }))
        )
    )
  );
}
