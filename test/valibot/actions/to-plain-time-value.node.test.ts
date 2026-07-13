import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToPlainTimeAction, ToPlainTimeIssue } from '#src/valibot/actions/to-plain-time-value';
import { toPlainTime } from '#src/valibot/actions/to-plain-time-value';

describe('toPlainTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toPlainTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_time',
        reference: toPlainTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToPlainTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toPlainTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_time',
        reference: toPlainTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToPlainTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toPlainTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_time',
        reference: toPlainTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToPlainTimeAction<unknown, typeof message>);
    });
  });

  describe('should transform to Temporal.PlainTime', () => {
    const action = toPlainTime();

    test('converts a ZonedDateTime ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-01-01T10:30:00+00:00[UTC]' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from('2024-01-01T10:30:00+00:00[UTC]').toPlainTime(),
      });
    });

    test('converts a PlainDateTime ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-01-01T14:45:30' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainDateTime.from('2024-01-01T14:45:30').toPlainTime(),
      });
    });

    test('converts a PlainTime ISO string', () => {
      expect(action['~run']({ typed: true, value: '10:30:00' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.PlainTime.from('10:30:00'),
      });
    });

    test('converts a Temporal.ZonedDateTime', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-01-15T09:15:00-05:00[America/New_York]');
      expect(action['~run']({ typed: true, value: zdt }, {})).toStrictEqual({
        typed: true,
        value: zdt.toPlainTime(),
      });
    });

    test('converts a Temporal.PlainDateTime', () => {
      const pdt = Temporal.PlainDateTime.from('2024-03-20T09:15:00');
      expect(action['~run']({ typed: true, value: pdt }, {})).toStrictEqual({
        typed: true,
        value: pdt.toPlainTime(),
      });
    });

    test('passes through an existing Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('10:30:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const action = toPlainTime('message');
    const baseIssue: Omit<ToPlainTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_plain_time',
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
      const value = 'not-a-time';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: `"${value}"` }],
      });
    });

    test('for invalid date-like strings', () => {
      const value = '2024-99-99';
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
