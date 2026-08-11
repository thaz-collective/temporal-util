import type { SetNonNullable } from './types';

/**
 * Centralizes environment detection so when working with we have a consistent calendar value
 *
 * @returns Calendar identifier string (e.g. `"gregory"`).
 */
export function getDefaultCalendar() {
  return new Intl.DateTimeFormat().resolvedOptions().calendar;
}

/**
 * Centralizes environment detection so when working with we have a consistent time zone value
 *
 * @returns IANA time zone string (e.g. `"America/New_York"`).
 */
export function getDefaultTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Centralizes environment detection so when working with we have a consistent locale value
 *
 * @returns BCP 47 locale string (e.g. `"en-US"`).
 */
export function getDefaultLocale() {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}

/**
 * Default date fields used by {@link buildPlainDateFormatter} when not overridden.
 */
export const DEFAULT_DATE_FORMAT = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const;

/**
 * Default time fields used by {@link buildPlainTimeFormatter} when not overridden.
 */
export const DEFAULT_TIME_FORMAT = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
} as const;

/**
 * Default time zone name field used by {@link buildDateTimeZoneAwareFormatter} when not overridden.
 */
export const DEFAULT_ZONE_FORMAT = {
  timeZoneName: 'short',
} as const;

/**
 * Default date, time, and time zone name fields used by {@link buildDateTimeZoneAwareFormatter} when not overridden.
 */
export const DEFAULT_DATE_TIME_ZONE_FORMAT = {
  ...DEFAULT_ZONE_FORMAT,
  ...DEFAULT_TIME_FORMAT,
  ...DEFAULT_DATE_FORMAT,
} as const;

/**
 * Locale portion of the {@link Intl.DateTimeFormat}
 */
export interface LocaleOptions {
  locale: NonNullable<Intl.LocalesArgument>;
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
 * @see {@link buildDateTimeZoneAwareFormatter}
 */
export function buildPlainDateFormatter(options: LocaleOptions & PlainDateOptions) {
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
 * @see {@link buildDateTimeZoneAwareFormatter}
 */
export function buildPlainTimeFormatter(options: LocaleOptions & PlainTimeOptions) {
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
export function buildDateTimeZoneAwareFormatter(
  options: LocaleOptions & PlainDateOptions & PlainTimeOptions & TimeZoneNameOption & TimeZoneOption,
) {
  return new Intl.DateTimeFormat(options?.locale, {
    ...DEFAULT_DATE_TIME_ZONE_FORMAT,
    ...options,
  });
}

/**
 * Any {@link Temporal} value that can be formatted, either directly via {@link Intl.DateTimeFormat.format}
 * or, for {@link Temporal.ZonedDateTime}, via its own `toLocaleString`.
 */
export type FormattableTemporal =
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Temporal.PlainYearMonth
  | Temporal.PlainMonthDay;

/**
 * Formats any {@link FormattableTemporal} value with the given formatter, including
 * {@link Temporal.ZonedDateTime}, which `Intl.DateTimeFormat.format` cannot format directly.
 *
 * @param temporal - The value to format.
 * @param formatter - The formatter whose resolved locale and options are applied.
 * @returns The formatted string.
 */
export function formatTemporal(temporal: FormattableTemporal, formatter: Intl.DateTimeFormat) {
  if (temporal instanceof Temporal.ZonedDateTime) {
    const { locale, timeZone: _timeZone, ...options } = formatter.resolvedOptions();

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return temporal.toLocaleString(locale, options as Intl.DateTimeFormatOptions);

    // I'd prefer something like this but formatter is immutable so can't update the timeZone of the formatter instance
    // return formatter.format(temporal.toInstant());
  }

  // May want to add these blocks in the future. Not sure though I want this or current yet.
  // else if (temporal instanceof Temporal.PlainYearMonth) {
  //   const { locale, ...options } = formatter.resolvedOptions();
  //
  //   return temporal.toLocaleString(locale, {
  //     // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  //     ...(options as Intl.DateTimeFormatOptions),
  //     calendar: temporal.calendarId,
  //   });
  // } else if (temporal instanceof Temporal.PlainMonthDay) {
  //   const { locale, ...options } = formatter.resolvedOptions();
  //
  //   return temporal.toLocaleString(locale, {
  //     // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  //     ...(options as Intl.DateTimeFormatOptions),
  //     calendar: temporal.calendarId,
  //   });
  // }

  return formatter.format(temporal);
}
