import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { PlainDateTimeIssue, PlainDateTimeSchema } from '#src/valibot/schema/plain-date-time';
import { plainDateTime } from '#src/valibot/schema/plain-date-time';

describe('plainDateTime', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<PlainDateTimeSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'plain_date_time',
      reference: plainDateTime,
      expects: 'Temporal.PlainDateTime',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: PlainDateTimeSchema<undefined> = { ...baseSchema, message: undefined };
      expect(plainDateTime()).toStrictEqual(schema);
      expect(plainDateTime(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(plainDateTime('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PlainDateTimeSchema<string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(plainDateTime(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PlainDateTimeSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = plainDateTime();

    test('for a plain date-time', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T10:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a plain date-time with sub-seconds', () => {
      const value = Temporal.PlainDateTime.from('2024-06-15T23:59:59.999');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for midnight', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = plainDateTime('message');
    const baseIssue: Omit<PlainDateTimeIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'plain_date_time',
      expected: 'Temporal.PlainDateTime',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for iso datetime strings', () => {
      expect(schema['~run']({ value: '2024-01-01T10:00:00' }, {})).toStrictEqual({
        typed: false,
        value: '2024-01-01T10:00:00',
        issues: [{ ...baseIssue, input: '2024-01-01T10:00:00', received: '"2024-01-01T10:00:00"' }],
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
      expect(schema['~run']({ value: 0 }, {})).toStrictEqual({
        typed: false,
        value: 0,
        issues: [{ ...baseIssue, input: 0, received: '0' }],
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
  });
});
