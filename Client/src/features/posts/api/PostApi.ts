import { queries } from "../../../shared/api/ApiClient";

const Post = {
  createPost: (formData: any) => queries.post("posts", formData),
  getPostsMe: (pageParam: number) =>
    queries.get(`posts/me?page=${pageParam}&pageSize=5`),
  toggleComment: (formData: any) => queries.post("posts/commenting", formData),
  getFeedPosts: (pageParam: number, postVisibilty: number) =>
    queries.get(
      `posts/feed?PostVisibilty=${postVisibilty}&Page=${pageParam}&PageSize=5`
    ),
  deletePost: (postId: string) => queries.delete(`posts?PostId=${postId}`),
  updatePost: (formData: any) => queries.put("posts", formData),
  addPostReaction: (formData: any) => queries.post("posts/reactions", formData),
  removePostReaction: (postId: string) =>
    queries.delete(`posts/reactions?PostId=${postId}`),
};

export default Post;
