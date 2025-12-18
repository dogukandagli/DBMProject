export interface NotificationEntity {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedEntityId: string | null;
  metaData: Record<string, any> | null;
}
