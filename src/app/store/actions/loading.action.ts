import { createAction, props } from "@ngrx/store";

export const setLoading = createAction(
    '[Page] Loading',
    props<{show: boolean}>()
);