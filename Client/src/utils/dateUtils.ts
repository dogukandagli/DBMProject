export const formatDate = (dateString: string | null): string | null => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    const isToday = new Date().toDateString() === date.toDateString();
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      day: isToday ? undefined : "numeric",
      month: isToday ? undefined : "short",
    }).format(date);
  } catch {
    return null;
  }
};
