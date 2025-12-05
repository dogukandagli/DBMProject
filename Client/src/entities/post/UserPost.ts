interface UserDto {
  userId: string;
  fullName: string;
  profilePhotoUrl: string | null;
  neighborhood: string;
}

export interface MediaDto {
  mediaId: string;
  url: string;
  type: number;
}

interface PostCapabilitiesDto {
  canEdit: boolean;
  canDelete: boolean;
  canComment: boolean;
}

export interface UserPost {
  postId: string;
  content: string;
  createdDate: string;
  commentCount: number;
  reactionCount: number;
  postVisibilty: number;
  userDto: UserDto;
  medias: MediaDto[];
  postCapabilitiesDto: PostCapabilitiesDto;
}
