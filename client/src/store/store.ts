import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./update/slice";
import userLoginReduer from "./login/loginSlice";

export const store = configureStore({
  reducer: { user: userReducer, userLogin: userLoginReduer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
