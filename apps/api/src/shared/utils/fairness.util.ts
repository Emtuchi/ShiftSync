export function calculateFairnessScore(
  userPremiumShifts: number,
  totalPremiumShifts: number
) {
  if (totalPremiumShifts === 0) return 1;
  return userPremiumShifts / totalPremiumShifts;
}