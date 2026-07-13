import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToPlainDateAction, ToPlainDateIssue } from '#src/valibot/actions/to-plain-date-value';
import { toPlainDate } from '#src/valibot/actions/to-plain-date-value';

describe('toPlainDate', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toPlainDate()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToPlainDateAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toPlainDate('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToPlainDateAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toPlainDate(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToPlainDateAction<unknown, typeof message>);
    });
  });

  describe('should transform to Temporal.PlainDate', () => {
    const action = toPlainDate();

    test('converts a ZonedDateTime ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-01-15T10:00:00+00:00[UTC]' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDate.from('2024-01-15'),
      });
    });

    test('converts a PlainDateTime ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-06-15T10:00:00' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDate.from('2024-06-15'),
      });
    });

    test('converts a PlainDate ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-01-01' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDate.from('2024-01-01'),
      });
    });

    test('converts a Temporal.ZonedDateTime', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-01-15T09:00:00-05:00[America/New_York]');
      expect(action['~run']({ typed: true, value: zdt }, {})).toStrictEqual({
        typed: true,
        value: zdt.toPlainDate(),
      });
    });

    test('converts a Temporal.PlainDateTime', () => {
      const pdt = Temporal.PlainDateTime.from('2024-03-20T09:00:00');
      expect(action['~run']({ typed: true, value: pdt }, {})).toStrictEqual({
        typed: true,
        value: pdt.toPlainDate(),
      });
    });

    test('passes through an existing Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-06-15');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const action = toPlainDate('message');
    const baseIssue: Omit<ToPlainDateIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_plain_date',
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
      const value = 'not-a-date';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for time-only strings', () => {
      const value = '10:00:00';
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
      const value = 20_240_101;
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
