import { queries } from "../../../shared/api/ApiClient";

const Post = {
  createPost: (formData: any) => queries.post("posts", formData),
  getPostsMe: (pageParam: number) =>
    queries.get(`posts/me?page=${pageParam}&pageSize=5`),
  toggleComment: (formData: any) => queries.post("posts/commenting", formData),
  getFeedPosts: (pageParam: number) =>
    queries.get(`posts/feed?PostVisibilty=1&Page=${pageParam}&PageSize=5`),
  deletePost: (postId: string) => queries.delete(`posts?PostId=${postId}`),
  updatePost: (formData: any) => queries.put("posts", formData),
};

export default Post;
