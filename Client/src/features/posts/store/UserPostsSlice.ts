import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type EntityState,
} from "@reduxjs/toolkit";
import type { UserPost } from "../../../entities/post/UserPost";
import Post from "../api/PostApi";

interface GetPostsResponse {
  items: UserPost[];
  page: number;
  pageSize: number;
  totalCount: number;
}

interface UserPostsState extends EntityState<UserPost, string> {
  status: string;
  nextPage: number;
  hasMore: boolean;
}

const postsAdapter = createEntityAdapter<UserPost, string>({
  selectId: (post) => post.postId,
});

const initialState = postsAdapter.getInitialState({
  status: "idle",
  nextPage: 1,
  hasMore: true,
} as UserPostsState);

export const userMeposts = createAsyncThunk<GetPostsResponse, number>(
  "userPosts/userMeposts",
  async (pageParam) => {
    const response = await Post.getPostsMe(pageParam);
    return response.data;
  }
);

export const userPostSlice = createSlice({
  name: "userPosts",
  initialState: initialState,
  reducers: {
    resetList: (state) => {
      postsAdapter.removeAll(state);
      state.nextPage = 1;
      state.hasMore = true;
      state.status = "idle";
    },
    postDeleted: postsAdapter.removeOne,
    postUpdated: postsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(userMeposts.pending, (state) => {
        state.status = "pendingUserMeposts";
      })
      .addCase(userMeposts.fulfilled, (state, action) => {
        state.status = "idle";
        const { items, page } = action.payload;
        if (page === 1) {
          postsAdapter.setAll(state, items);
        } else {
          postsAdapter.addMany(state, items);
        }
        state.nextPage = page + 1;

        if (items.length === 0) {
          state.hasMore = false;
        } else {
          state.hasMore = true;
        }
      })
      .addCase(userMeposts.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export const { resetList, postDeleted, postUpdated } = userPostSlice.actions;

export const { selectAll: selectAllUserPosts } = postsAdapter.getSelectors(
  (state: any) => state.userPosts
);
