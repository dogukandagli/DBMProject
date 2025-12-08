import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { UserPost } from "../../../entities/post/UserPost";
import Post from "../api/PostApi";
import type { FieldValues } from "react-hook-form";
import type { RootState } from "../../../app/store/store";

interface GetPostsResponse {
  items: UserPost[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

interface UserPostsState extends EntityState<UserPost, string> {
  status: string;
  nextPage: number | null;
  hasMore: boolean;
}

export const postsAdapter = createEntityAdapter<UserPost, string>({
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
export const feedPosts = createAsyncThunk<
  GetPostsResponse,
  { postVisibility: number },
  { state: RootState }
>("userPosts/feedPosts", async ({ postVisibility }, { getState }) => {
  const state = getState();
  const page = state.userPosts.nextPage ?? 1;

  const response = await Post.getFeedPosts(page, postVisibility);

  return response.data;
});

export const toggleCommentStatus = createAsyncThunk<string, FieldValues>(
  "userPosts/toggleCommentStatus",
  async (data) => {
    const response = await Post.toggleComment(data);
    return response.data;
  }
);

export const deletePost = createAsyncThunk<string, { postId: string }>(
  "userPosts/deletePost",
  async ({ postId }) => {
    const response = await Post.deletePost(postId);
    return response.data;
  }
);

export const updatePost = createAsyncThunk<UserPost, FormData>(
  "posts,updatePost",
  async (formData) => {
    const response = await Post.updatePost(formData);
    return response.data.userPostDto;
  }
);
export const addPostReaction = createAsyncThunk<
  string,
  { postId: string; reactionType: number }
>("userPosts/addPostReaction", async (data) => {
  const response = await Post.addPostReaction(data);
  return response.data;
});

export const removePostReaction = createAsyncThunk<string, { postId: string }>(
  "userPosts/removePostReaction",
  async ({ postId }) => {
    const response = await Post.removePostReaction(postId);
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
        const { items, page, perPage, totalPages } = action.payload;
        if (page === 1) {
          postsAdapter.setAll(state, items);
        } else {
          postsAdapter.addMany(state, items);
        }

        const isLastPage = page >= totalPages || items.length < perPage;
        state.hasMore = !isLastPage;
        state.nextPage = isLastPage ? null : page + 1;
      })
      .addCase(userMeposts.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(feedPosts.pending, (state) => {
        state.status = "pendingUserMeposts";
      })
      .addCase(feedPosts.fulfilled, (state, action) => {
        state.status = "idle";
        const { items, page, perPage, totalPages } = action.payload;
        if (page === 1) {
          postsAdapter.setAll(state, items);
        } else {
          postsAdapter.addMany(state, items);
        }

        const isLastPage = page >= totalPages || items.length < perPage;
        state.hasMore = !isLastPage;
        state.nextPage = isLastPage ? null : page + 1;
      })
      .addCase(feedPosts.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(toggleCommentStatus.pending, (state) => {
        state.status = "pendingToggleCommentStatus";
      })
      .addCase(toggleCommentStatus.fulfilled, (state, action) => {
        const { postId, enable } = action.meta.arg;

        const existingPost = state.entities[postId];
        if (existingPost) {
          existingPost.postCapabilitiesDto.canComment = enable;
        }
      })
      .addCase(deletePost.pending, (state) => {
        state.status = "pendingDeletePost";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "idle";
        const { postId } = action.meta.arg;

        const existingPost = state.entities[postId];
        if (existingPost) {
          postsAdapter.removeOne(state, postId);
        }
      })
      .addCase(updatePost.pending, (state) => {
        state.status = "pendingCreatePost";
      })
      .addCase(
        updatePost.fulfilled,
        (state, action: PayloadAction<UserPost>) => {
          state.status = "idle";
          const updatedPost = action.payload;

          const { postId, ...rest } = updatedPost;

          const changes = Object.fromEntries(
            Object.entries(rest).filter(
              ([_, value]) => value !== null && value !== undefined
            )
          ) as Partial<UserPost>;

          postsAdapter.updateOne(state, {
            id: updatedPost.postId,
            changes,
          });
        }
      )
      .addCase(updatePost.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(addPostReaction.pending, (state) => {
        state.status == "pendingAddPostReaction";
      })
      .addCase(addPostReaction.fulfilled, (state, action) => {
        state.status = "idle";
        const { postId } = action.meta.arg;
        const existingPost = state.entities[postId];
        if (existingPost) {
          existingPost.userInteraction.hasReacted = true;
          existingPost.reactionCount += 1;
        }
      })
      .addCase(addPostReaction.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(removePostReaction.pending, (state) => {
        state.status == "pendingRemovePostReaction";
      })
      .addCase(removePostReaction.fulfilled, (state, action) => {
        state.status = "idle";
        const { postId } = action.meta.arg;
        const existingPost = state.entities[postId];
        if (existingPost) {
          existingPost.userInteraction.hasReacted = false;
          existingPost.reactionCount -= 1;
        }
      })
      .addCase(removePostReaction.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export const { resetList, postDeleted, postUpdated } = userPostSlice.actions;

export const { selectAll: selectAllUserPosts } = postsAdapter.getSelectors(
  (state: any) => state.userPosts
);
