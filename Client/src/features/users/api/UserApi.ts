import { queries } from "../../../shared/api/ApiClient";

const User = {
  updateProfilePhoto: (formData: any) =>
    queries.post("users/me/profile-photo", formData),
};

export default User;
