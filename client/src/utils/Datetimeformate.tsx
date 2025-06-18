
import { parse, format, isValid } from 'date-fns';

export function formatDate(value: any) {
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : '-';
}

// Formats a time string like "23:04:00" to "11:04 PM"
export function formatTime(value: any) {
  const parsed = parse(value, 'HH:mm:ss', new Date());
  return isValid(parsed) ? format(parsed, 'hh:mm a') : '-';
}