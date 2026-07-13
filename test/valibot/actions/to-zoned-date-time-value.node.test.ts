import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToZonedDateTimeAction, ToZonedDateTimeIssue } from '#src/valibot/actions/to-zoned-date-time-value';
import { toZonedDateTime } from '#src/valibot/actions/to-zoned-date-time-value';

describe('toZonedDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toZonedDateTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toZonedDateTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toZonedDateTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, typeof message>);
    });
  });

  describe('should transform to Temporal.ZonedDateTime', () => {
    const action = toZonedDateTime();

    test('converts a UTC ZonedDateTime ISO string', () => {
      const value = '2024-01-01T00:00:00+00:00[UTC]';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from(value),
      });
    });

    test('converts a ZonedDateTime string with named timezone', () => {
      const value = '2024-06-15T12:00:00-05:00[America/Chicago]';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from(value),
      });
    });

    test('converts a ZonedDateTime string with positive offset', () => {
      const value = '2024-01-01T09:00:00+09:00[Asia/Tokyo]';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from(value),
      });
    });

    test('passes through an existing Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const action = toZonedDateTime('message');

    const baseIssue: Omit<ToZonedDateTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_zoned_date_time',
      expected: null,
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for undefined', () => {
      expect(action['~run']({ typed: true, value: undefined }, {})).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [{ ...baseIssue, input: undefined, received: '"Invalid conversion option"' }],
      });
    });

    test('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: '"Invalid conversion option"' }],
      });
    });

    test('for plain objects', () => {
      const value = {};
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for NaN', () => {
      expect(action['~run']({ typed: true, value: Number.NaN }, {})).toStrictEqual({
        typed: false,
        value: Number.NaN,
        issues: [{ ...baseIssue, input: Number.NaN, received: '"Invalid conversion option"' }],
      });
    });

    test('for numbers', () => {
      const value = 1_700_000_000_000;
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for invalid strings', () => {
      const value = 'not-a-datetime';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for instant strings', () => {
      const value = '2024-06-01T12:00:00Z';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for plain date-time strings (no offset)', () => {
      const value = '2024-01-01T10:00:00';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for plain date strings (no time or offset)', () => {
      const value = '2024-01-01';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for plain time strings', () => {
      const value = '12:00:00';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for Temporal.PlainDateTime', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T10:00:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('10:00:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
