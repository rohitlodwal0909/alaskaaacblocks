
import dayjs from 'dayjs';
export const getDateTimeFromTimeString = (timeStr) => {
  if (!timeStr) return null;
  const today = dayjs().format('YYYY-MM-DD'); // aaj ki date
  return dayjs(`${today}T${timeStr}`); // full ISO string banta hai
};