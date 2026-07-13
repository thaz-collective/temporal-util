import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToDurationAction, ToDurationIssue } from '#src/valibot/actions/to-duration-value';
import { toDuration } from '#src/valibot/actions/to-duration-value';

describe('toDuration', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toDuration({ durationType: 'hours' })).toStrictEqual({
        kind: 'transformation',
        type: 'to_duration',
        reference: toDuration,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToDurationAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toDuration({ durationType: 'hours' }, 'message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_duration',
        reference: toDuration,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToDurationAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toDuration({ durationType: 'hours' }, message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_duration',
        reference: toDuration,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToDurationAction<unknown, typeof message>);
    });
  });

  describe('should transform to Temporal.Duration', () => {
    test('converts a number to hours duration', () => {
      const action = toDuration({ durationType: 'hours' });
      expect(action['~run']({ typed: true, value: 2 }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Duration.from({ hours: 2 }),
      });
    });

    test('converts a number to minutes duration', () => {
      const action = toDuration({ durationType: 'minutes' });
      expect(action['~run']({ typed: true, value: 30 }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Duration.from({ minutes: 30 }),
      });
    });

    test('converts a number to days duration', () => {
      const action = toDuration({ durationType: 'days' });
      expect(action['~run']({ typed: true, value: 7 }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Duration.from({ days: 7 }),
      });
    });

    test('converts a number to seconds duration', () => {
      const action = toDuration({ durationType: 'seconds' });
      expect(action['~run']({ typed: true, value: 60 }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Duration.from({ seconds: 60 }),
      });
    });

    test('converts zero to a zero duration', () => {
      const action = toDuration({ durationType: 'hours' });
      expect(action['~run']({ typed: true, value: 0 }, {})).toStrictEqual({
        typed: true,
        value: Temporal.Duration.from({ hours: 0 }),
      });
    });

    test('passes through an existing Temporal.Duration', () => {
      const action = toDuration({ durationType: 'hours' });
      const value = Temporal.Duration.from({ hours: 5, minutes: 30 });
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
      });
    });
  });

  describe('should return dataset with issues', () => {
    const action = toDuration({ durationType: 'hours' }, 'message');
    const baseIssue: Omit<ToDurationIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_duration',
      expected: null,
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for strings', () => {
      const value = 'PT1H';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: '"Invalid conversion option"' }],
      });
    });

    test('for objects', () => {
      const value = { hours: 1 };
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for booleans', () => {
      const value = true;
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

    test('for NaN', () => {
      expect(action['~run']({ typed: true, value: Number.NaN }, {})).toStrictEqual({
        typed: false,
        value: Number.NaN,
        issues: [{ ...baseIssue, input: Number.NaN, received: 'NaN' }],
      });
    });
  });
});
