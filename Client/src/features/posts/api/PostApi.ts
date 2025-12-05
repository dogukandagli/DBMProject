import { queries } from "../../../shared/api/ApiClient";

const Post = {
  createPost: (formData: any) => queries.post("posts", formData),
  getPostsMe: (pageParam: number) =>
    queries.get(`posts/me?page=${pageParam}&pageSize=5`),
  toggleComment: (formData: any) => queries.post("posts/commenting", formData),
  deletePost: (postId: string) => queries.delete(`posts?PostId=${postId}`),
};

export default Post;
