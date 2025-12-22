export interface ConversationEntity {
  id: string;
  title: string;
  avatarUrl: string | null;
  type: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
  relatedEntityId: string | null;
  isLastMessageFromMe: boolean;
  isReadByRecipient: boolean;
  isReadByMe: boolean;
}
