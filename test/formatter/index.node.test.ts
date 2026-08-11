import { describe, expect, test } from 'vite-plus/test';

import { buildPlainDateFormatter, buildInstantFormatter, buildPlainTimeFormatter } from '#src/formatter';

const instant = Temporal.Instant.from('2024-06-15T10:30:00Z');
const plainYearMonth = Temporal.PlainYearMonth.from('2024-06');
const plainMonthDay = Temporal.PlainMonthDay.from('06-15');
const plainDateTime = Temporal.PlainDateTime.from('2024-06-15T10:30:00');
const plainDate = Temporal.PlainDate.from('2024-06-15');
const plainTime = Temporal.PlainTime.from('10:30:00');
const zonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T10:30:00-04:00[America/New_York]');

describe('buildPlainDateFormatter', () => {
  describe('formatter options', () => {
    test('defaults to check', () => {
      const formatter = buildPlainDateFormatter();
      expect(formatter.resolvedOptions()).toMatchObject({
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

    test('accepts calendar option', () => {
      const formatter = buildPlainDateFormatter({
        calendar: 'iso8601',
      });
      expect(formatter.resolvedOptions()).toMatchObject({
        calendar: 'iso8601',
      });
    });
  });

  describe('en-US formatter', () => {
    const formatter = buildPlainDateFormatter({ locale: 'en-US' });

    describe('temporal.ZonedDateTime', () => {
      test('throws when formatting', () => {
        // @ts-expect-error ZonedDateTime isn't part of Intl.FormattableTemporalObject, format() throws at runtime
        expect(() => formatter.format(zonedDateTime)).toThrow(TypeError);
      });
    });

    describe('temporal.Instant', () => {
      test('formats successfully', () => {
        expect(formatter.format(instant)).toBe('06/15/2024');
      });
    });

    describe('temporal.PlainDateTime', () => {
      test('formats successfully', () => {
        expect(formatter.format(plainDateTime)).toBe('06/15/2024');
      });
    });

    describe('temporal.PlainDate', () => {
      test('formats successfully', () => {
        expect(formatter.format(plainDate)).toBe('06/15/2024');
      });
    });

    describe('temporal.PlainTime', () => {
      test('throws when formatting', () => {
        expect(() => formatter.format(plainTime)).toThrow(TypeError);
      });
    });

    describe('temporal.PlainYearMonth', () => {
      test('throws when formatting', () => {
        expect(() => formatter.format(plainYearMonth)).toThrow(RangeError);
      });

      const innerFormatter = buildPlainDateFormatter({ locale: 'en-US', calendar: 'iso8601' });
      test('formats successfully with calendar passed', () => {
        expect(innerFormatter.format(plainYearMonth)).toBe('2024-06');
      });
    });

    describe('temporal.PlainMonthDay', () => {
      test('throws when formatting', () => {
        expect(() => formatter.format(plainMonthDay)).toThrow(RangeError);
      });

      const innerFormatter = buildPlainDateFormatter({ locale: 'en-US', calendar: 'iso8601' });
      test('formats successfully with calendar passed', () => {
        expect(innerFormatter.format(plainMonthDay)).toBe('06-15');
      });
    });
  });
});

describe('buildPlainTimeFormatter', () => {
  describe('formatter options', () => {
    test('defaults to check', () => {
      const formatter = buildPlainTimeFormatter();
      expect(formatter.resolvedOptions()).toMatchObject({
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

    test('accepts custom date format options', () => {
      const formatter = buildPlainTimeFormatter({ hour: 'numeric', minute: '2-digit' });
      expect(formatter.resolvedOptions()).toMatchObject({
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      });
    });

    test('accepts calendar option', () => {
      const formatter = buildPlainTimeFormatter({
        calendar: 'iso8601',
      });
      expect(formatter.resolvedOptions()).toMatchObject({
        calendar: 'iso8601',
      });
    });
  });

  describe('en-US formatter', () => {
    const formatter = buildPlainTimeFormatter({ locale: 'en-US' });

    describe('temporal.ZonedDateTime', () => {
      test('throws when formatting', () => {
        // @ts-expect-error ZonedDateTime isn't part of Intl.FormattableTemporalObject, format() throws at runtime
        expect(() => formatter.format(zonedDateTime)).toThrow(TypeError);
      });
    });

    describe('temporal.Instant', () => {
      test('formats successfully', () => {
        expect(formatter.format(instant)).toBe('05:30:00 AM');
      });
    });

    describe('temporal.PlainDateTime', () => {
      test('formats successfully', () => {
        expect(formatter.format(plainDateTime)).toBe('10:30:00 AM');
      });
    });

    describe('temporal.PlainDate', () => {
      test('formats successfully', () => {
        expect(() => formatter.format(plainDate)).toThrow(TypeError);
      });
    });

    describe('temporal.PlainTime', () => {
      test('throws when formatting', () => {
        expect(formatter.format(plainTime)).toBe('10:30:00 AM');
      });
    });

    describe('temporal.PlainYearMonth', () => {
      test('throws when formatting', () => {
        expect(() => formatter.format(plainYearMonth)).toThrow(TypeError);
      });
    });

    describe('temporal.PlainMonthDay', () => {
      test('throws when formatting', () => {
        expect(() => formatter.format(plainMonthDay)).toThrow(TypeError);
      });
    });
  });
});

describe('buildInstantFormatter', () => {
  describe('formatter options', () => {
    test('defaults to check', () => {
      const formatter = buildInstantFormatter({ timeZone: 'UTC' });
      expect(formatter.resolvedOptions()).toMatchObject({
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
      const formatter = buildInstantFormatter({ locale: 'de-DE', timeZone: 'UTC' });
      expect(formatter.resolvedOptions()).toMatchObject({
        locale: 'de-DE',
        timeZone: 'UTC',
      });
    });

    test('accepts custom date format options', () => {
      const formatter = buildInstantFormatter({ timeZoneName: 'long', hour: 'numeric', timeZone: 'UTC' });
      expect(formatter.resolvedOptions()).toMatchObject({
        timeZoneName: 'long',
        hour: 'numeric',
        timeZone: 'UTC',
      });
    });

    test('accepts calendar option', () => {
      const formatter = buildInstantFormatter({
        calendar: 'iso8601',
        timeZone: 'UTC',
      });
      expect(formatter.resolvedOptions()).toMatchObject({
        calendar: 'iso8601',
        timeZone: 'UTC',
      });
    });
  });

  describe('en-US formatter', () => {
    const formatter = buildInstantFormatter({ locale: 'en-US', timeZone: 'UTC' });

    describe('temporal.ZonedDateTime', () => {
      test('throws when formatting', () => {
        // @ts-expect-error ZonedDateTime isn't part of Intl.FormattableTemporalObject, format() throws at runtime
        expect(() => formatter.format(zonedDateTime)).toThrow(TypeError);
      });
    });

    describe('temporal.Instant', () => {
      test('formats successfully', () => {
        expect(formatter.format(instant)).toBe('06/15/2024, 10:30:00 AM UTC');
      });

      const innerFormatter = buildInstantFormatter({ locale: 'en-US', timeZone: 'America/New_York' });
      test('formats successfully with other zone', () => {
        expect(innerFormatter.format(instant)).toBe('06/15/2024, 06:30:00 AM EDT');
      });
    });

    describe('temporal.PlainDateTime', () => {
      test('formats successfully', () => {
        expect(formatter.format(plainDateTime)).toBe('06/15/2024, 10:30:00 AM');
      });
    });

    describe('temporal.PlainDate', () => {
      test('formats successfully', () => {
        expect(formatter.format(plainDate)).toBe('06/15/2024');
      });
    });

    describe('temporal.PlainTime', () => {
      test('throws when formatting', () => {
        expect(formatter.format(plainTime)).toBe('10:30:00 AM');
      });
    });

    describe('temporal.PlainYearMonth', () => {
      test('throws when formatting', () => {
        expect(() => formatter.format(plainYearMonth)).toThrow(RangeError);
      });

      const innerFormatter = buildInstantFormatter({ locale: 'en-US', timeZone: 'UTC', calendar: 'iso8601' });
      test('formats successfully with calendar passed', () => {
        expect(innerFormatter.format(plainYearMonth)).toBe('2024-06');
      });
    });

    describe('temporal.PlainMonthDay', () => {
      test('throws when formatting', () => {
        expect(() => formatter.format(plainMonthDay)).toThrow(RangeError);
      });

      const innerFormatter = buildInstantFormatter({ locale: 'en-US', timeZone: 'UTC', calendar: 'iso8601' });
      test('formats successfully with calendar passed', () => {
        expect(innerFormatter.format(plainMonthDay)).toBe('06-15');
      });
    });
  });
});
