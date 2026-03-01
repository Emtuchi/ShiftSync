import { hoursBetween } from './time.util'

export function calculateTotalHours(
  shifts: { start: Date; end: Date }[]
): number {
  return shifts.reduce(
    (total, shift) => total + hoursBetween(shift.start, shift.end),
    0
  );
}