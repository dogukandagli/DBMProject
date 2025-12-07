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
  orderNo: number;
}

interface PostCapabilitiesDto {
  canEdit: boolean;
  canDelete: boolean;
  canComment: boolean;
  isCommentingEnabled: boolean;
}

export interface UserPost {
  postId: string;
  content: string;
  createdDate: string;
  updateDate: string | null;
  commentCount: number;
  reactionCount: number;
  postVisibilty: number;
  userDto: UserDto;
  medias: MediaDto[];
  postCapabilitiesDto: PostCapabilitiesDto;
  userInteraction: UserInteraction;
}

interface UserInteraction {
  hasReacted: boolean;
  reactionType: number;
  hasCommented: boolean;
}
