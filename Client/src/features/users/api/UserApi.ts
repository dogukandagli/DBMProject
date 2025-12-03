import { queries } from "../../../shared/api/ApiClient";

const User = {
  updateProfilePhoto: (formData: any) =>
    queries.post("users/me/profile-photo", formData),
  deleteProfilePhoto: () => queries.delete("users/me/profile-photo"),
  updateCoverPhoto: (formData: any) =>
    queries.post("users/me/cover-photo", formData),
  deleteCoverPhoto: () => queries.delete("users/me/cover-photo"),
  updateInfo: (formData: any) => queries.patch("users/me/updateInfo", formData),
};

export default User;
