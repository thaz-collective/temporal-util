import type { SetNonNullable } from 'type-fest';

export const DEFAULT_DATE_FORMAT = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const;

export const DEFAULT_TIME_FORMAT = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
} as const;

export const DEFAULT_ZONE_FORMAT = {
  timeZoneName: 'short',
} as const;

export const DEFAULT_DATE_TIME_ZONE_FORMAT = {
  ...DEFAULT_ZONE_FORMAT,
  ...DEFAULT_TIME_FORMAT,
  ...DEFAULT_DATE_FORMAT,
} as const;

/**
 * Locale portion of the {@link Intl.DateTimeFormat}
 */
export interface LocaleOptions {
  locale?: NonNullable<Intl.LocalesArgument>;
}

/**
 * Date portion of the {@link Intl.DateTimeFormat} for {@link Intl.DateTimeFormatOptions}
 */
export type PlainDateOptions = SetNonNullable<Pick<Intl.DateTimeFormatOptions, 'year' | 'month' | 'day' | 'calendar'>>;

/**
 * Use when you need to display only the date portion of a {@link Temporal} value.
 *
 * @param options - Optional date and locale format options.
 * @returns A {@link Intl.DateTimeFormat} instance configured for date-only output.
 * @see {@link buildPlainTimeFormatter}
 * @see {@link buildInstantFormatter}
 */
export function buildPlainDateFormatter(options: LocaleOptions & PlainDateOptions = {}) {
  return new Intl.DateTimeFormat(options?.locale, {
    ...DEFAULT_DATE_FORMAT,
    ...options,
  });
}

/**
 * Time portion of the {@link Intl.DateTimeFormat} for {@link Intl.DateTimeFormatOptions}
 */
export type PlainTimeOptions = SetNonNullable<
  Pick<Intl.DateTimeFormatOptions, 'hour' | 'minute' | 'second' | 'calendar'>
>;

/**
 * Use when you need to display only the time portion of a {@link Temporal} value.
 *
 * @param options - Optional time and locale format options.
 * @returns A {@link Intl.DateTimeFormat} instance configured for time-only output.
 * @see {@link buildPlainDateFormatter}
 * @see {@link buildInstantFormatter}
 */
export function buildPlainTimeFormatter(options: LocaleOptions & PlainTimeOptions = {}) {
  return new Intl.DateTimeFormat(options?.locale, {
    ...DEFAULT_TIME_FORMAT,
    ...options,
  });
}

/**
 * TimeZoneName portion of the {@link Intl.DateTimeFormat} for {@link Intl.DateTimeFormatOptions}
 */
export type TimeZoneNameOption = SetNonNullable<Pick<Intl.DateTimeFormatOptions, 'timeZoneName'>>;

/**
 * Zone identifier portion of the {@link Intl.DateTimeFormat} for {@link Intl.DateTimeFormatOptions}
 */
export type TimeZoneOption = Required<SetNonNullable<Pick<Intl.DateTimeFormatOptions, 'timeZone'>>>;

/**
 * Use when you need to display the full date-time-zone portion of a {@link Temporal.Instant} value.
 *
 * @param options - Required timeZone option and optional date/time and locale format options
 * @returns A {@link Intl.DateTimeFormat} instance configured for date-time-zone output.
 * @see {@link buildPlainDateFormatter}
 * @see {@link buildPlainTimeFormatter}
 */
export function buildInstantFormatter(
  options: LocaleOptions & PlainDateOptions & PlainTimeOptions & TimeZoneNameOption & TimeZoneOption,
) {
  return new Intl.DateTimeFormat(options?.locale, {
    ...DEFAULT_DATE_TIME_ZONE_FORMAT,
    ...options,
  });
}
