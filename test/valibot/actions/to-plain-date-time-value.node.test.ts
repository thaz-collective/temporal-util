import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToPlainDateTimeAction, ToPlainDateTimeIssue } from '#src/valibot/actions/to-plain-date-time-value';
import { toPlainDateTime } from '#src/valibot/actions/to-plain-date-time-value';

describe('toPlainDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toPlainDateTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToPlainDateTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toPlainDateTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToPlainDateTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toPlainDateTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToPlainDateTimeAction<unknown, typeof message>);
    });
  });

  describe('should transform to Temporal.PlainDateTime', () => {
    const action = toPlainDateTime();

    test('converts a ZonedDateTime ISO string', () => {
      const value = '2024-01-15T10:30:00+00:00[UTC]';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from(value).toPlainDateTime(),
      });
    });

    test('converts a ZonedDateTime string with named timezone', () => {
      const value = '2024-06-15T12:00:00-05:00[America/Chicago]';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from(value).toPlainDateTime(),
      });
    });

    test('converts a PlainDateTime ISO string', () => {
      const value = '2024-06-15T10:30:00';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDateTime.from(value),
      });
    });

    test('converts a PlainDateTime string with sub-seconds', () => {
      const value = '2024-01-01T00:00:00.123';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDateTime.from(value),
      });
    });

    test('converts a PlainDate ISO string, defaulting the time to midnight', () => {
      const value = '2024-06-15';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDateTime.from(value),
      });
    });

    test('converts a Temporal.ZonedDateTime', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-01-15T09:00:00-05:00[America/New_York]');
      expect(action['~run']({ typed: true, value: zdt }, {})).toStrictEqual({
        typed: true,
        value: zdt.toPlainDateTime(),
      });
    });

    test('passes through an existing Temporal.PlainDateTime', () => {
      const value = Temporal.PlainDateTime.from('2024-06-15T10:30:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const action = toPlainDateTime('message');

    const baseIssue: Omit<ToPlainDateTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_plain_date_time',
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
      const value = 0;
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

    test('for instant strings (Z designator not supported)', () => {
      const value = '2024-06-01T12:00:00Z';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for plain time strings', () => {
      const value = '14:30:00';
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

    test('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
