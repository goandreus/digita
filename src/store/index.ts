import {configureStore} from '@reduxjs/toolkit';
import timerReducer from '@features/timer/timerSlice';
import loadingReducer from '@features/loading';
import userReducer from '@features/userInfo';
import appConfigReducer from '@features/appConfig';
import termsReducer from '@features/terms';
import lastUserReducer from '@features/lastUser';
import tokenReducer from '@features/token';
import favoriteReducer from '@features/favorites';
import modalReducer from '@features/modal';
import creditAdviceReducer from '@features/creditAdvice';
import categoriesReducer from '@features/categories';
import categoryInPayment from '@features/categoryInPayment';
import activity from '@features/activity';
import balanceVisibility from '@features/balanceVisibility';
import authBiometry from '@features/authBiometry';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    loading: loadingReducer,
    user: userReducer,
    terms: termsReducer,
    appConfig: appConfigReducer,
    lastUser: lastUserReducer,
    authBiometry: authBiometry,
    token: tokenReducer,
    favorites: favoriteReducer,
    modal: modalReducer,
    creditAdvice: creditAdviceReducer,
    activity: activity,
    categories: categoriesReducer,
    categoryInPayment: categoryInPayment,
    balanceVisibility: balanceVisibility,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
