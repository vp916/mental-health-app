// A date as "2026-10-20", the same format PostgreSQL uses for DATE columns.
// dateString() is today, dateString(1) is yesterday, and so on.
export function dateString(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
