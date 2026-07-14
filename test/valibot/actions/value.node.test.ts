import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalValueAction, TemporalValueIssue } from '#src/valibot/actions/value';
import type { ZonedDateTimeIssue } from '#src/valibot/schema/zoned-date-time';
import { temporalValue } from '#src/valibot/actions/value';

describe('should return action object', () => {
  const requirement = Temporal.PlainDate.from('2024-06-01');
  const baseAction: Omit<TemporalValueAction<Temporal.PlainDate, typeof requirement, never>, 'message'> = {
    kind: 'validation',
    type: 'temporal_value',
    reference: temporalValue,
    expects: `=${requirement.toJSON()}`,
    requirement,
    async: false,
    '~run': expect.any(Function),
  };

  test('with undefined message', () => {
    const action: TemporalValueAction<Temporal.PlainDate, typeof requirement, undefined> = {
      ...baseAction,
      message: undefined,
    };
    expect(temporalValue(requirement)).toStrictEqual(action);
  });

  test('with string message', () => {
    expect(temporalValue(requirement, 'message')).toStrictEqual({
      ...baseAction,
      message: 'message',
    } satisfies TemporalValueAction<Temporal.PlainDate, typeof requirement, string>);
  });

  test('with function message', () => {
    const message = () => 'message';
    expect(temporalValue(requirement, message)).toStrictEqual({
      ...baseAction,
      message,
    } satisfies TemporalValueAction<Temporal.PlainDate, typeof requirement, typeof message>);
  });
});

describe('zonedDateTime', () => {
  const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
  const zdtAction = temporalValue(req, 'message');

  test('should return dataset without issues', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
    expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('untyped inputs', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
    const issues: [ZonedDateTimeIssue] = [
      {
        kind: 'schema',
        type: 'zoned_date_time',
        input: null,
        expected: 'Temporal.ZonedDateTime',
        received: 'null',
        message: 'message',
      },
    ];

    expect(temporalValue(value)['~run']({ typed: false, value: null, issues }, {})).toStrictEqual({
      typed: false,
      value: null,
      issues,
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalValueIssue<Temporal.ZonedDateTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_value',
      expected: `=${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value before requirement', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value after requirement', () => {
      const value = Temporal.ZonedDateTime.from('2024-12-01T00:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});

describe('instant', () => {
  const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
  const instantAction = temporalValue(req, 'message');

  test('should return dataset without issues', () => {
    const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
    expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalValueIssue<Temporal.Instant, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_value',
      expected: `=${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value before requirement', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(500_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value after requirement', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(2_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});

describe('plainDateTime', () => {
  const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
  const dtAction = temporalValue(req, 'message');

  test('should return dataset without issues', () => {
    const value = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
    expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalValueIssue<Temporal.PlainDateTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_value',
      expected: `=${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value before requirement', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value after requirement', () => {
      const value = Temporal.PlainDateTime.from('2024-12-01T00:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});

describe('plainDate', () => {
  const requirement = Temporal.PlainDate.from('2024-06-01');
  const dateAction = temporalValue(requirement, 'message');

  test('should return dataset without issues', () => {
    const value = Temporal.PlainDate.from('2024-06-01');
    expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalValueIssue<Temporal.PlainDate, typeof requirement>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_value',
      expected: `=${requirement.toJSON()}`,
      message: 'message',
      requirement,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value before requirement', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value after requirement', () => {
      const value = Temporal.PlainDate.from('2024-12-12');
      expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});

describe('plainTime', () => {
  const req = Temporal.PlainTime.from('12:00:00');
  const timeAction = temporalValue(req, 'message');

  test('should return dataset without issues', () => {
    const value = Temporal.PlainTime.from('12:00:00');
    expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalValueIssue<Temporal.PlainTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_value',
      expected: `=${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value before requirement', () => {
      const value = Temporal.PlainTime.from('08:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value after requirement', () => {
      const value = Temporal.PlainTime.from('18:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});
