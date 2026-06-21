type PricingInput = {
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
};

export type BookingBreakdownItem = {
  type: 'day' | 'week' | 'month';
  count: number;
  unitPrice: number;
  total: number;
};

export function calculateNights(startDate: Date, endDate: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.max(
    0,
    Math.ceil((endDate.getTime() - startDate.getTime()) / millisecondsPerDay)
  );
}

export function calculateBookingPrice(
  startDate: Date,
  endDate: Date,
  pricing: PricingInput
) {
  const nights = calculateNights(startDate, endDate);
  let remaining = nights;
  const breakdown: BookingBreakdownItem[] = [];
  let totalPrice = 0;

  if (remaining >= 30) {
    const months = Math.floor(remaining / 30);
    const total = months * pricing.pricePerMonth;
    breakdown.push({ type: 'month', count: months, unitPrice: pricing.pricePerMonth, total });
    totalPrice += total;
    remaining %= 30;
  }

  if (remaining >= 7) {
    const weeks = Math.floor(remaining / 7);
    const total = weeks * pricing.pricePerWeek;
    breakdown.push({ type: 'week', count: weeks, unitPrice: pricing.pricePerWeek, total });
    totalPrice += total;
    remaining %= 7;
  }

  if (remaining > 0) {
    const total = remaining * pricing.pricePerDay;
    breakdown.push({ type: 'day', count: remaining, unitPrice: pricing.pricePerDay, total });
    totalPrice += total;
  }

  return {
    nights,
    totalPrice,
    breakdown,
  };
}
