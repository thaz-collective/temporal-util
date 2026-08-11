import { describe, expect, test } from 'vite-plus/test';

import type { PlainYearMonthIssue, PlainYearMonthSchema } from '#src/valibot/schema/plain-year-month';
import { plainYearMonth } from '#src/valibot/schema/plain-year-month';

describe('plainYearMonth', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<PlainYearMonthSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'plain_year_month',
      reference: plainYearMonth,
      expects: 'Temporal.PlainYearMonth',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: PlainYearMonthSchema<undefined> = { ...baseSchema, message: undefined };
      expect(plainYearMonth()).toStrictEqual(schema);
      expect(plainYearMonth(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(plainYearMonth('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PlainYearMonthSchema<string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(plainYearMonth(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PlainYearMonthSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = plainYearMonth();

    test('for a plain year-month', () => {
      const value = Temporal.PlainYearMonth.from('2024-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a mid-year year-month', () => {
      const value = Temporal.PlainYearMonth.from('2024-06');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a year-end year-month', () => {
      const value = Temporal.PlainYearMonth.from('2024-12');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = plainYearMonth('message');
    const baseIssue: Omit<PlainYearMonthIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'plain_year_month',
      expected: 'Temporal.PlainYearMonth',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for iso year-month strings', () => {
      expect(schema['~run']({ value: '2024-01' }, {})).toStrictEqual({
        typed: false,
        value: '2024-01',
        issues: [{ ...baseIssue, input: '2024-01', received: '"2024-01"' }],
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
      expect(schema['~run']({ value: 2024 }, {})).toStrictEqual({
        typed: false,
        value: 2024,
        issues: [{ ...baseIssue, input: 2024, received: '2024' }],
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

    test('for Temporal.PlainMonthDay', () => {
      const value = Temporal.PlainMonthDay.from('01-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainMonthDay' }],
      });
    });
  });
});
