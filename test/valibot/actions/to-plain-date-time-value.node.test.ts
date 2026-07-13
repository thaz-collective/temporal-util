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
      expect(action['~run']({ typed: true, value: '2024-01-15T10:30:00+00:00[UTC]' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from('2024-01-15T10:30:00+00:00[UTC]').toPlainDateTime(),
      });
    });

    test('converts a PlainDateTime ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-06-15T10:30:00' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDateTime.from('2024-06-15T10:30:00'),
      });
    });

    test('converts a PlainDateTime string with sub-seconds', () => {
      expect(action['~run']({ typed: true, value: '2024-01-01T00:00:00.123' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDateTime.from('2024-01-01T00:00:00.123'),
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

    test('for invalid strings', () => {
      const value = 'not-a-datetime';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for time-only strings', () => {
      const value = '14:30:00';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: '"Invalid conversion option"' }],
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

    test('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
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
  });
});
