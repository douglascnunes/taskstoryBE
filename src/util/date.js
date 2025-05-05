export function parseDateOnly(dateStr) {
  if (!dateStr) {
    return null;
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};


export function isValidISODate(dateStr) {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}