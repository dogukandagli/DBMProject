import { queries } from "../../../shared/api/ApiClient";

const Post = {
  createPost: (formData: any) => queries.post("posts", formData),
  getPostsMe: (pageParam: number) =>
    queries.get(`posts/me?page=${pageParam}&pageSize=5`),
};

export default Post;
