import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Episode statuses
    draft: 'bg-gray-100 text-gray-800',
    recording: 'bg-red-100 text-red-800',
    editing: 'bg-yellow-100 text-yellow-800',
    review: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    
    // Session statuses
    scheduled: 'bg-blue-100 text-blue-800',
    live: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    
    // Approval statuses
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    needs_work: 'bg-orange-100 text-orange-800',
    rejected: 'bg-red-100 text-red-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getRoleColor(role: string): string {
  const roleColors: Record<string, string> = {
    host: 'bg-purple-100 text-purple-800',
    cohost: 'bg-blue-100 text-blue-800',
    guest: 'bg-green-100 text-green-800',
    producer: 'bg-orange-100 text-orange-800',
  };
  
  return roleColors[role] || 'bg-gray-100 text-gray-800';
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function parseHtmlContent(html: string): string {
  // Simple HTML parsing for display
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
}