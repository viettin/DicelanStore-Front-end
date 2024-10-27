import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LoadingState } from "../reducers/loading.reducer";

export const getLoadingState = createFeatureSelector<LoadingState>("loading");

export const getLoading = createSelector(
    getLoadingState,
    state => state.loading > 0
);
