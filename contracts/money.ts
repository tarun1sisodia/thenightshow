/**
 * Canonical money units (docs/project/Rules.md §3, docs/project/Architecture.md §6.2).
 *
 * - Database and payment boundaries: integer minor units (paise).
 * - API wire, pricing engine, and customer/admin display: rupees as numbers.
 * - Conversion occurs exactly once, at the payment boundary, and is tested.
 */

export const PAISE_PER_RUPEE = 100;

/** A valid minor-unit amount is a non-negative integer number of paise. */
export function isMinorUnitAmount(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

/**
 * Convert a rupees amount (API/display boundary) to integer paise
 * (payment/database boundary). Rejects sub-paise precision and non-finite
 * input instead of silently rounding money.
 */
export function toPaise(rupees: number): number {
  if (typeof rupees !== "number" || !Number.isFinite(rupees)) {
    throw new Error(`toPaise: expected a finite number of rupees, got ${String(rupees)}`);
  }
  const exact = rupees * PAISE_PER_RUPEE;
  const paise = Math.round(exact);
  if (Math.abs(exact - paise) > 1e-9) {
    throw new Error(
      `toPaise: ${rupees} rupees has sub-paise precision and cannot be converted exactly`,
    );
  }
  return paise;
}

/** Convert integer paise to a rupees number for API/display boundaries. */
export function toRupees(paise: number): number {
  if (!isMinorUnitAmount(paise)) {
    throw new Error(`toRupees: expected a non-negative integer paise amount, got ${String(paise)}`);
  }
  return paise / PAISE_PER_RUPEE;
}
