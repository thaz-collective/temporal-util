import { describe, expect, test } from 'vite-plus/test';

import type { PlainMonthDayIssue, PlainMonthDaySchema } from '#src/valibot/schema/plain-month-day';
import { plainMonthDay } from '#src/valibot/schema/plain-month-day';

describe('plainMonthDay', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<PlainMonthDaySchema<never>, 'message'> = {
      kind: 'schema',
      type: 'plain_month_day',
      reference: plainMonthDay,
      expects: 'Temporal.PlainMonthDay',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: PlainMonthDaySchema<undefined> = { ...baseSchema, message: undefined };
      expect(plainMonthDay()).toStrictEqual(schema);
      expect(plainMonthDay(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(plainMonthDay('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PlainMonthDaySchema<string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(plainMonthDay(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PlainMonthDaySchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = plainMonthDay();

    test('for a plain month-day', () => {
      const value = Temporal.PlainMonthDay.from('01-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a mid-year month-day', () => {
      const value = Temporal.PlainMonthDay.from('06-15');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a year-end month-day', () => {
      const value = Temporal.PlainMonthDay.from('12-31');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = plainMonthDay('message');
    const baseIssue: Omit<PlainMonthDayIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'plain_month_day',
      expected: 'Temporal.PlainMonthDay',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for iso month-day strings', () => {
      expect(schema['~run']({ value: '01-01' }, {})).toStrictEqual({
        typed: false,
        value: '01-01',
        issues: [{ ...baseIssue, input: '01-01', received: '"01-01"' }],
      });
    });

    test('for null', () => {
      expect(schema['~run']({ value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: 'null' }],
      });
    });

    test('for undefined', () => {
      expect(schema['~run']({ value: undefined }, {})).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [{ ...baseIssue, input: undefined, received: 'undefined' }],
      });
    });

    test('for numbers', () => {
      expect(schema['~run']({ value: 101 }, {})).toStrictEqual({
        typed: false,
        value: 101,
        issues: [{ ...baseIssue, input: 101, received: '101' }],
      });
    });

    test('for booleans', () => {
      expect(schema['~run']({ value: true }, {})).toStrictEqual({
        typed: false,
        value: true,
        issues: [{ ...baseIssue, input: true, received: 'true' }],
      });
    });

    test('for objects', () => {
      expect(schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...baseIssue, input: {}, received: 'Object' }],
      });
    });

    test('for Temporal.Duration', () => {
      const value = Temporal.Duration.from({ hours: 1 });
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'Duration' }],
      });
    });

    test('for Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'ZonedDateTime' }],
      });
    });

    test('for Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'Instant' }],
      });
    });

    test('for Temporal.PlainDateTime', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T10:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainDateTime' }],
      });
    });

    test('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainDate' }],
      });
    });

    test('for Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('12:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainTime' }],
      });
    });

    test('for Temporal.PlainYearMonth', () => {
      const value = Temporal.PlainYearMonth.from('2024-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainYearMonth' }],
      });
    });
  });
});
