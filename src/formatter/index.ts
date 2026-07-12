import { Intl as TemporalIntl } from '@js-temporal/polyfill';

import { getDefaultLocale } from '#src/index';

/**
 * Locale portion of the {@link TemporalIntl.DateTimeFormat}
 */
export interface LocaleOptions {
  locale: string | string[];
}

/**
 * Date portion of the {@link TemporalIntl.DateTimeFormat}, all fields required.
 */
export interface DateFormatterOptions {
  year: NonNullable<Intl.DateTimeFormatOptions['year']>;
  month: NonNullable<Intl.DateTimeFormatOptions['month']>;
  day: NonNullable<Intl.DateTimeFormatOptions['day']>;
}

/**
 * Use when you need to display only the date portion of a Temporal value.
 * Uses `@js-temporal/polyfill`'s `Intl` rather than native `Intl` because only
 * the polyfill's formatter understands Temporal types.
 *
 * Compatible with {@link import('@js-temporal/polyfill').Temporal.PlainDate Temporal.PlainDate}, {@link import('@js-temporal/polyfill').Temporal.PlainDateTime Temporal.PlainDateTime}, and
 * {@link import('@js-temporal/polyfill').Temporal.ZonedDateTime Temporal.ZonedDateTime} (date portion only).
 *
 * @param options - Optional date and locale format options.
 * @returns A {@link TemporalIntl.DateTimeFormat} instance configured for date-only output.
 * @see {@link buildTimeFormatter}
 * @see {@link buildDateTimeFormatter}
 */
export function buildDateFormatter(options?: Partial<DateFormatterOptions> & Partial<LocaleOptions>) {
  return new TemporalIntl.DateTimeFormat(options?.locale ?? getDefaultLocale(), {
    year: options?.year ?? 'numeric',
    month: options?.month ?? '2-digit',
    day: options?.day ?? '2-digit',
  });
}

/**
 * Time portion of the {@link TemporalIntl.DateTimeFormat}, all fields required.
 */
export interface TimeFormatterOptions {
  hour: NonNullable<Intl.DateTimeFormatOptions['hour']>;
  minute: NonNullable<Intl.DateTimeFormatOptions['minute']>;
  second: NonNullable<Intl.DateTimeFormatOptions['second']>;
}

/**
 * Use when you need to display only the time portion of a Temporal value.
 * Uses `@js-temporal/polyfill`'s `Intl` rather than native `Intl` because only
 * the polyfill's formatter understands Temporal types.
 *
 * Compatible with {@link import('@js-temporal/polyfill').Temporal.PlainTime Temporal.PlainTime} and {@link import('@js-temporal/polyfill').Temporal.PlainDateTime Temporal.PlainDateTime}. Do **not**
 * use for {@link import('@js-temporal/polyfill').Temporal.ZonedDateTime Temporal.ZonedDateTime} as that needs timeZone information - use
 * {@link buildDateTimeFormatter} instead.
 *
 * @param options - Optional date and locale format options.
 * @returns A {@link TemporalIntl.DateTimeFormat} instance configured for time-only output.
 * @see {@link buildDateFormatter}
 * @see {@link buildDateTimeFormatter}
 */
export function buildTimeFormatter(options?: Partial<TimeFormatterOptions> & Partial<LocaleOptions>) {
  return new TemporalIntl.DateTimeFormat(options?.locale ?? getDefaultLocale(), {
    hour: options?.hour ?? '2-digit',
    minute: options?.minute ?? '2-digit',
    second: options?.second ?? '2-digit',
  });
}

/**
 * Controls how the IANA time zone abbreviation is rendered in
 * {@link TemporalIntl.DateTimeFormat} output. Required by {@link buildDateTimeFormatter}
 * to guarantee the zone is always visible when formatting a
 * {@link import('@js-temporal/polyfill').Temporal.ZonedDateTime Temporal.ZonedDateTime}.
 */
export interface TimeZoneNameFormatterOptions {
  timeZoneName: NonNullable<Intl.DateTimeFormatOptions['timeZoneName']>;
}

/**
 * Use when you need to display both date and time alongside the time zone for a
 * {@link import('@js-temporal/polyfill').Temporal.ZonedDateTime Temporal.ZonedDateTime}. Uses `@js-temporal/polyfill`'s `Intl` rather than
 * native `Intl` because only the polyfill's formatter understands Temporal types.
 *
 * Since this needs zone information this is **only** compatible with {@link import('@js-temporal/polyfill').Temporal.ZonedDateTime Temporal.ZonedDateTime}. Passing other
 * types like {@link import('@js-temporal/polyfill').Temporal.PlainDateTime Temporal.PlainDateTime}, {@link import('@js-temporal/polyfill').Temporal.PlainDate Temporal.PlainDate} or {@link import('@js-temporal/polyfill').Temporal.PlainTime Temporal.PlainTime} will throw
 * a `TypeError` while formatting at runtime.
 *
 * @param options - Optional date and locale format options.
 * @returns A {@link TemporalIntl.DateTimeFormat} instance configured for time-only output.
 * @see {@link buildDateFormatter}
 * @see {@link buildDateTimeFormatter}
 */
export function buildDateTimeFormatter(
  options?: Partial<DateFormatterOptions> &
    Partial<TimeFormatterOptions> &
    Partial<TimeZoneNameFormatterOptions> &
    Partial<LocaleOptions>,
) {
  return new TemporalIntl.DateTimeFormat(options?.locale ?? getDefaultLocale(), {
    year: options?.year ?? 'numeric',
    month: options?.month ?? '2-digit',
    day: options?.day ?? '2-digit',
    hour: options?.hour ?? '2-digit',
    minute: options?.minute ?? '2-digit',
    second: options?.second ?? '2-digit',
    timeZoneName: options?.timeZoneName ?? 'short',
  });
}
