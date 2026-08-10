import { getDefaultLocale } from '#src/index';

/**
 * Locale portion of the {@link Intl.DateTimeFormat}
 */
export interface LocaleOptions {
  locale: string | string[];
}

/**
 * Date portion of the {@link Intl.DateTimeFormat}, all fields required.
 */
export interface PlainDateFormatterOptions {
  year: NonNullable<Intl.DateTimeFormatOptions['year']>;
  month: NonNullable<Intl.DateTimeFormatOptions['month']>;
  day: NonNullable<Intl.DateTimeFormatOptions['day']>;
}

/**
 * Use when you need to display only the date portion of a Temporal value.
 * Uses the ambient, Temporal-aware `Intl.DateTimeFormat` — provided by a
 * native runtime if available, otherwise by the consumer's
 * `temporal-polyfill/full/global` install.
 *
 * Compatible with: {@link Temporal.PlainDate} or
 * {@link Temporal.PlainDateTime}
 *
 * @param options - Optional date and locale format options.
 * @returns A {@link Intl.DateTimeFormat} instance configured for date-only output.
 * @see {@link buildPlainTimeFormatter}
 * @see {@link buildInstantFormatter}
 */
export function buildPlainDateFormatter(options?: Partial<PlainDateFormatterOptions> & Partial<LocaleOptions>) {
  return new Intl.DateTimeFormat(options?.locale ?? getDefaultLocale(), {
    year: options?.year ?? 'numeric',
    month: options?.month ?? '2-digit',
    day: options?.day ?? '2-digit',
  });
}

/**
 * Time portion of the {@link Intl.DateTimeFormat}, all fields required.
 */
export interface PlainTimeFormatterOptions {
  hour: NonNullable<Intl.DateTimeFormatOptions['hour']>;
  minute: NonNullable<Intl.DateTimeFormatOptions['minute']>;
  second: NonNullable<Intl.DateTimeFormatOptions['second']>;
}

/**
 * Use when you need to display only the time portion of a Temporal value.
 * Uses the ambient, Temporal-aware `Intl.DateTimeFormat` — provided by a
 * native runtime if available, otherwise by the consumer's
 * `temporal-polyfill/full/global` install.
 *
 * Compatible with: {@link Temporal.PlainTime} or
 * {@link Temporal.PlainDateTime}
 *
 * @param options - Optional time and locale format options.
 * @returns A {@link Intl.DateTimeFormat} instance configured for time-only output.
 * @see {@link buildPlainDateFormatter}
 * @see {@link buildInstantFormatter}
 */
export function buildPlainTimeFormatter(options?: Partial<PlainTimeFormatterOptions> & Partial<LocaleOptions>) {
  return new Intl.DateTimeFormat(options?.locale ?? getDefaultLocale(), {
    hour: options?.hour ?? '2-digit',
    minute: options?.minute ?? '2-digit',
    second: options?.second ?? '2-digit',
  });
}

/**
 * Time Zone Display portion of the {@link Intl.DateTimeFormat}, all fields required.
 */
export interface TimeZoneNameFormatterOptions {
  timeZoneName: NonNullable<Intl.DateTimeFormatOptions['timeZoneName']>;
}

/**
 * IANA Time Zone portion of the {@link Intl.DateTimeFormat}, all fields required.
 */
export interface TimeZoneFormatterOptions {
  timeZone: NonNullable<Intl.DateTimeFormatOptions['timeZone']>;
}

/**
 * Use when you need to display the date-time portion of a {@link Temporal.Instant} value.
 * Uses the ambient, Temporal-aware `Intl.DateTimeFormat` — provided by a
 * native runtime if available, otherwise by the consumer's
 * `temporal-polyfill/full/global` install.
 *
 * Compatible with: {@link Temporal.Instant} only.
 *
 * @param options - Required timeZone option and optional date/time and locale format options
 * @returns A {@link Intl.DateTimeFormat} instance configured for date-time-zone output.
 * @see {@link buildPlainDateFormatter}
 * @see {@link buildPlainTimeFormatter}
 */
export function buildInstantFormatter(
  options: TimeZoneFormatterOptions &
    Partial<PlainDateFormatterOptions> &
    Partial<PlainTimeFormatterOptions> &
    Partial<TimeZoneNameFormatterOptions> &
    Partial<LocaleOptions>,
) {
  return new Intl.DateTimeFormat(options?.locale ?? getDefaultLocale(), {
    year: options?.year ?? 'numeric',
    month: options?.month ?? '2-digit',
    day: options?.day ?? '2-digit',
    hour: options?.hour ?? '2-digit',
    minute: options?.minute ?? '2-digit',
    second: options?.second ?? '2-digit',
    timeZoneName: options?.timeZoneName ?? 'short',
    timeZone: options.timeZone,
  });
}
