import { queries } from "../../../shared/api/ApiClient";

const Post = {
  createPost: (formData: any) => queries.post("posts", formData),
};

export default Post;
