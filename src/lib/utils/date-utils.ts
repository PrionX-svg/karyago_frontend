import { format } from "date-fns";

/**
 * Safely converts a date string to a Date object without timezone issues
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object or undefined
 */
export function safeParseDate(
  dateString: string | undefined | null
): Date | undefined {
  if (!dateString) return undefined;

  // Add time component to ensure local timezone
  const dateWithTime = dateString.includes("T")
    ? dateString
    : `${dateString}T00:00:00`;
  const date = new Date(dateWithTime);

  // Validate the date
  if (isNaN(date.getTime())) return undefined;

  return date;
}

/**
 * Safely formats a Date object to YYYY-MM-DD string
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format or empty string
 */
export function safeFormatDate(date: Date | undefined | null): string {
  if (!date) return "";

  try {
    return format(date, "yyyy-MM-dd");
  } catch {
    return "";
  }
}

/**
 * Formats a Date object for display
 * @param date - Date object
 * @returns Formatted date string for display
 */
export function formatDateForDisplay(date: Date | undefined | null): string {
  if (!date) return "";

  try {
    return format(date, "PPP");
  } catch {
    return "";
  }
}
