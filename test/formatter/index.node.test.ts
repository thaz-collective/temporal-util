import { describe, expect, test } from 'vite-plus/test';

import { buildPlainDateFormatter, buildInstantFormatter, buildPlainTimeFormatter } from '#src/formatter';
import { getDefaultLocale } from '#src/index';

describe('buildDateFormatter', () => {
  test('defaults to numeric year, 2-digit month/day, and the environment locale', () => {
    const formatter = buildPlainDateFormatter();
    expect(formatter.resolvedOptions()).toMatchObject({
      locale: getDefaultLocale(),
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  });

  test('accepts a custom locale', () => {
    const formatter = buildPlainDateFormatter({ locale: 'de-DE' });
    expect(formatter.resolvedOptions()).toMatchObject({
      locale: 'de-DE',
    });
  });

  test('accepts custom date format options', () => {
    const formatter = buildPlainDateFormatter({ year: '2-digit', month: 'long', day: 'numeric' });
    expect(formatter.resolvedOptions()).toMatchObject({
      year: '2-digit',
      month: 'long',
      day: 'numeric',
    });
  });

  test('formats a Temporal.PlainDate', () => {
    const formatter = buildPlainDateFormatter({ locale: 'en-US' });
    expect(formatter.format(Temporal.PlainDate.from('2024-06-15'))).toBe('06/15/2024');
  });

  test('formats only the date portion of a Temporal.PlainDateTime', () => {
    const formatter = buildPlainDateFormatter({ locale: 'en-US' });
    expect(formatter.format(Temporal.PlainDateTime.from('2024-06-15T10:30:00'))).toBe('06/15/2024');
  });
});

describe('buildTimeFormatter', () => {
  test('defaults to 2-digit hour/minute/second and the environment locale', () => {
    const formatter = buildPlainTimeFormatter();
    expect(formatter.resolvedOptions()).toMatchObject({
      locale: getDefaultLocale(),
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  });

  test('accepts a custom locale', () => {
    const formatter = buildPlainTimeFormatter({ locale: 'de-DE' });
    expect(formatter.resolvedOptions()).toMatchObject({
      locale: 'de-DE',
    });
  });

  test('accepts custom time format options', () => {
    const formatter = buildPlainTimeFormatter({ hour: 'numeric', minute: '2-digit' });
    expect(formatter.resolvedOptions()).toMatchObject({
      hour: 'numeric',
      minute: '2-digit',
    });
  });

  test('formats a Temporal.PlainTime', () => {
    const formatter = buildPlainTimeFormatter({ locale: 'en-US' });
    expect(formatter.format(Temporal.PlainTime.from('10:30:00'))).toBe('10:30:00 AM');
  });

  test('formats only the time portion of a Temporal.PlainDateTime', () => {
    const formatter = buildPlainTimeFormatter({ locale: 'en-US' });
    expect(formatter.format(Temporal.PlainDateTime.from('2024-06-15T10:30:00'))).toBe('10:30:00 AM');
  });

  test('throws when formatting a Temporal.PlainDate', () => {
    const formatter = buildPlainTimeFormatter({ locale: 'en-US' });
    expect(() => formatter.format(Temporal.PlainDate.from('2024-06-15'))).toThrow(TypeError);
  });
});

describe('buildInstantFormatter', () => {
  test('defaults to numeric/2-digit date and time fields, a short zone name, and the environment locale', () => {
    const formatter = buildInstantFormatter({ timeZone: 'UTC' });
    expect(formatter.resolvedOptions()).toMatchObject({
      locale: getDefaultLocale(),
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      timeZone: 'UTC',
    });
  });

  test('accepts a custom locale', () => {
    const formatter = buildInstantFormatter({ timeZone: 'UTC', locale: 'en-GB' });
    expect(formatter.resolvedOptions()).toMatchObject({
      locale: 'en-GB',
    });
  });

  test('accepts custom date, time, and time zone name format options', () => {
    const formatter = buildInstantFormatter({ timeZone: 'UTC', timeZoneName: 'long', hour: 'numeric' });
    expect(formatter.resolvedOptions()).toMatchObject({
      timeZoneName: 'long',
      hour: 'numeric',
    });
  });

  test('formats a Temporal.Instant with its time zone name', () => {
    const formatter = buildInstantFormatter({ locale: 'en-US', timeZone: 'UTC' });
    expect(formatter.format(Temporal.Instant.from('2024-06-15T10:30:00Z'))).toBe('06/15/2024, 10:30:00 AM UTC');
  });

  test('converts to the given time zone when formatting a Temporal.Instant', () => {
    const formatter = buildInstantFormatter({ locale: 'en-US', timeZone: 'America/New_York' });
    expect(formatter.format(Temporal.Instant.from('2024-06-15T10:30:00Z'))).toBe('06/15/2024, 06:30:00 AM EDT');
  });
});
