export interface CommentAuthor {
  userId: string;
  fullName: string;
  profilePhotoUrl?: string | null;
  isPostAuthor: boolean;
}

export interface CommentCapabilities {
  canEdit: boolean;
  canDelete: boolean;
}

export interface Comment {
  commentId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  commentAuthorDto: CommentAuthor;
  commentCapabilitiesDto: CommentCapabilities;
}
