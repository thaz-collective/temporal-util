import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToInstantAction, ToInstantIssue } from '#src/valibot/actions/to-instant-value';
import { toInstant } from '#src/valibot/actions/to-instant-value';

describe('toInstant', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toInstant()).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toInstant('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toInstant(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, typeof message>);
    });
  });

  describe('should transform to Temporal.Instant', () => {
    const action = toInstant();

    test('converts a ZonedDateTime ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-01-01T00:00:00+00:00[UTC]' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]').toInstant(),
      });
    });

    test('converts an Instant ISO string', () => {
      expect(action['~run']({ typed: true, value: '2024-01-01T00:00:00Z' }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Instant.from('2024-01-01T00:00:00Z'),
      });
    });

    test('converts epoch milliseconds as number', () => {
      expect(action['~run']({ typed: true, value: 0 }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Instant.fromEpochMilliseconds(0),
      });
    });

    test('converts positive epoch milliseconds', () => {
      expect(action['~run']({ typed: true, value: 1_700_000_000_000 }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Instant.fromEpochMilliseconds(1_700_000_000_000),
      });
    });

    test('converts epoch nanoseconds as bigint', () => {
      expect(action['~run']({ typed: true, value: 0n }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Instant.fromEpochNanoseconds(0n),
      });
    });

    test('converts a Date object', () => {
      const date = new Date(1_000_000);
      expect(action['~run']({ typed: true, value: date }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Instant.fromEpochMilliseconds(date.getTime()),
      });
    });

    test('converts a Temporal.ZonedDateTime', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      expect(action['~run']({ typed: true, value: zdt }, {})).toStrictEqual({
        typed: true,
        value: zdt.toInstant(),
      });
    });

    test('passes through an existing Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const action = toInstant('message');
    const baseIssue: Omit<ToInstantIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_instant',
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

    test('for plain date strings (no time or offset)', () => {
      const value = '2024-01-01';
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

    test('for plain objects', () => {
      const value = {};
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

    test('for NaN', () => {
      expect(action['~run']({ typed: true, value: Number.NaN }, {})).toStrictEqual({
        typed: false,
        value: Number.NaN,
        issues: [{ ...baseIssue, input: Number.NaN, received: 'NaN' }],
      });
    });
  });
});
