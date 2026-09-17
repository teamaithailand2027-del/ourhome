export type {
  Agent,
  Appointment,
  Cell,
  Coordinates,
  Error_,
  Favorite,
  House,
  Location,
  Notification,
  Post,
  Project,
  ProjectFilter,
  RatingCategory,
  Result,
  Review,
  Timestamp,
  Value,
  AdminMetrics,
  UserId,
} from "@/backend";

export {
  AppointmentStatus,
  HouseStatus,
  ProjectStatus,
  UnitStatus,
  UserRole,
  VerificationStatus,
} from "@/backend";

/** Convert a Motoko nanosecond timestamp to a JS Date. Returns null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a bigint price as Thai Baht, e.g. ฿4,900,000 */
export function formatBaht(value: bigint): string {
  return `฿${Number(value).toLocaleString("th-TH")}`;
}
