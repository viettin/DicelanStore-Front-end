import { createReducer, on } from "@ngrx/store";
import * as LoadingActions from "../actions/loading.action";

export interface LoadingState {
    loading: number,
}
export const initialState: LoadingState = {
    loading: 0
};

export const loadingReducer = createReducer(
    initialState,
    on(LoadingActions.setLoading, (state, { show }) => {
        let loading = state.loading;
        return {
            loading: show ? ++loading : --loading
        };
    })
);