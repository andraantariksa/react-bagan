export const monthDiff = (a: Date, b: Date) => {
  const months = (b.getFullYear() - a.getFullYear()) * 12 - a.getMonth() + 1 + b.getMonth();
  return months <= 0 ? 0 : months;
}
export const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 0).getDate();
const MS_PER_DAY = 1000 * 60 * 60 * 24;
export const dateDiffInDays = (a: Date, b: Date) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};
