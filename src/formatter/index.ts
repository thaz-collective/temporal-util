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
  locale?: string | string[];
}

/**
 * Use when you need to display only the date portion of a {@link Temporal} value.
 *
 * @param options - Optional date and locale format options.
 * @returns A {@link Intl.DateTimeFormat} instance configured for date-only output.
 * @see {@link buildPlainTimeFormatter}
 * @see {@link buildInstantFormatter}
 */
export function buildPlainDateFormatter(
  options: Pick<Intl.DateTimeFormatOptions, 'year' | 'month' | 'day'> & LocaleOptions = {},
) {
  return new Intl.DateTimeFormat(options?.locale, {
    ...DEFAULT_DATE_FORMAT,
    ...options,
  });
}

/**
 * Use when you need to display only the time portion of a {@link Temporal} value.
 *
 * @param options - Optional time and locale format options.
 * @returns A {@link Intl.DateTimeFormat} instance configured for time-only output.
 * @see {@link buildPlainDateFormatter}
 * @see {@link buildInstantFormatter}
 */
export function buildPlainTimeFormatter(
  options: Pick<Intl.DateTimeFormatOptions, 'hour' | 'minute' | 'second'> & LocaleOptions = {},
) {
  return new Intl.DateTimeFormat(options?.locale, {
    ...DEFAULT_TIME_FORMAT,
    ...options,
  });
}

export interface TimeZoneOption {
  timeZone: NonNullable<Intl.DateTimeFormatOptions['timeZone']>;
}

/**
 * Use when you need to display the full date-time-zone portion of a {@link Temporal.Instant} value.
 *
 * @param options - Required timeZone option and optional date/time and locale format options
 * @returns A {@link Intl.DateTimeFormat} instance configured for date-time-zone output.
 * @see {@link buildPlainDateFormatter}
 * @see {@link buildPlainTimeFormatter}
 */
export function buildInstantFormatter(
  options: Pick<Intl.DateTimeFormatOptions, 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'timeZoneName'> &
    TimeZoneOption &
    LocaleOptions,
) {
  return new Intl.DateTimeFormat(options?.locale, {
    ...DEFAULT_DATE_TIME_ZONE_FORMAT,
    ...options,
  });
}
