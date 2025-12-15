import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../features/auth/store/AuthSlice";
import { neighborhoodsSlice } from "../../features/neighborhoods/store/neighborhoodSlice";
import { LocationSlice } from "../../features/location/store/LocationSlice";
import { postSlice } from "../../features/posts/store/PostSlice";
import { userSlice } from "../../features/users/store/UserSlice";
import { userPostSlice } from "../../features/posts/store/UserPostsSlice";
import { commentSlice } from "../../features/posts/store/CommentSlice";
import { borrowRequstSlice } from "../../features/borrowRequests/store/BorrowRequestSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    neighborhood: neighborhoodsSlice.reducer,
    location: LocationSlice.reducer,
    post: postSlice.reducer,
    user: userSlice.reducer,
    userPosts: userPostSlice.reducer,
    postComments: commentSlice.reducer,
    borrowRequests: borrowRequstSlice.reducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
