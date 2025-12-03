import { queries } from "../../../shared/api/ApiClient";

const User = {
  updateProfilePhoto: (formData: any) =>
    queries.post("users/me/profile-photo", formData),
  deleteProfilePhoto: () => queries.delete("users/me/profile-photo"),
  updateCoverPhoto: (formData: any) =>
    queries.post("users/me/cover-photo", formData),
};

export default User;
