import { queries } from "../../../shared/api/ApiClient";

const User = {
  // --- Arkadaşının Orijinal Kodları ---
  updateProfilePhoto: (formData: any) =>
    queries.post("users/me/profile-photo", formData),
  deleteProfilePhoto: () => queries.delete("users/me/profile-photo"),
  updateCoverPhoto: (formData: any) =>
    queries.post("users/me/cover-photo", formData),
  deleteCoverPhoto: () => queries.delete("users/me/cover-photo"),
  updateInfo: (formData: any) => queries.patch("users/me/updateInfo", formData),

  // --- Senin Kodların (Formatlanmış Hali) ---

  // Account settings
updateAccountSettings: (formData: any) => 
    queries.patch("users/me/account-settings", formData),

  // Request Information
  requestMyInformation: (formData: any) =>
    queries.post("users/me/request-my-information", formData, {
      responseType: "blob",
    }),
  deactivateAccount: () => queries.post("users/me/deactivate", {}),


  getMyNeighborhood: () => queries.get("users/me/neighborhood"),
  // Privacy
  patchPrivacy: (patch: Record<string, any>) =>
    queries.patch("users/me/privacy", patch),


  /* Neighborhoods */
  getFollowedNeighborhoods: () =>
    queries.get("users/me/neighborhoods/following"),

  unfollowNeighborhood: (id: string) =>
    queries.delete(`users/me/neighborhoods/following/${id}`),

  // Notifications
  patchNotifications: (patch: Record<string, any>) =>
    queries.patch("users/me/notifications", patch),
};

export default User;