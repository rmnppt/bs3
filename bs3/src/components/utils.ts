// Helper function for timeAgo
export function timeAgo(timestamp: string): string {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return 'now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Calculates remaining time given a start timestamp and expiryPeriod
export function timeRemaining(timestamp: string, expiryPeriod?: '24h' | '3d' | '7d'): { text: string; isExpiringSoon: boolean } {
  const now = new Date();
  const start = new Date(timestamp);
  let msToAdd = 0;
  switch (expiryPeriod) {
    case '24h':
      msToAdd = 24 * 60 * 60 * 1000;
      break;
    case '3d':
      msToAdd = 3 * 24 * 60 * 60 * 1000;
      break;
    case '7d':
    default:
      msToAdd = 7 * 24 * 60 * 60 * 1000;
      break;
  }
  const expiresAt = new Date(start.getTime() + msToAdd);
  const diff = expiresAt.getTime() - now.getTime();
  if (diff <= 0) return { text: 'Expired', isExpiringSoon: false };

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  let parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} min${minutes !== 1 ? 's' : ''}`);
  if (days === 0 && hours === 0 && minutes === 0) parts.push(`${seconds} sec${seconds !== 1 ? 's' : ''}`);

  // Highlight if less than 6h
  const isExpiringSoon = (diff <= 6 * 60 * 60 * 1000);

  return { text: 'Expires in ' + parts.join(' '), isExpiringSoon };
}
