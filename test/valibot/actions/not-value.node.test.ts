import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ZonedDateTimeIssue } from '#src/valibot';
import type { TemporalNotValueAction, TemporalNotValueIssue } from '#src/valibot/actions/not-value';
import { temporalNotValue } from '#src/valibot/actions/not-value';

describe('should return action object', () => {
  const requirement = Temporal.PlainDate.from('2024-06-01');
  const baseAction: Omit<TemporalNotValueAction<Temporal.PlainDate, typeof requirement, never>, 'message'> = {
    kind: 'validation',
    type: 'temporal_not_value',
    reference: temporalNotValue,
    expects: `!${requirement.toJSON()}`,
    requirement,
    async: false,
    '~run': expect.any(Function),
  };

  test('with undefined message', () => {
    const action: TemporalNotValueAction<Temporal.PlainDate, typeof requirement, undefined> = {
      ...baseAction,
      message: undefined,
    };
    expect(temporalNotValue(requirement)).toStrictEqual(action);
  });

  test('with string message', () => {
    expect(temporalNotValue(requirement, 'message')).toStrictEqual({
      ...baseAction,
      message: 'message',
    } satisfies TemporalNotValueAction<Temporal.PlainDate, typeof requirement, string>);
  });

  test('with function message', () => {
    const message = () => 'message';
    expect(temporalNotValue(requirement, message)).toStrictEqual({
      ...baseAction,
      message,
    } satisfies TemporalNotValueAction<Temporal.PlainDate, typeof requirement, typeof message>);
  });
});

describe('zonedDateTime', () => {
  const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
  const zdtAction = temporalNotValue(req, 'message');

  describe('should return dataset without issues', () => {
    test('for value before requirement', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for value after requirement', () => {
      const value = Temporal.ZonedDateTime.from('2024-12-01T00:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
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

    expect(temporalNotValue(value)['~run']({ typed: false, value: null, issues }, {})).toStrictEqual({
      typed: false,
      value: null,
      issues,
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValueIssue<Temporal.ZonedDateTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_value',
      expected: `!${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value equal to requirement', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
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
  const instantAction = temporalNotValue(req, 'message');

  describe('should return dataset without issues', () => {
    test('for value before requirement', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(500_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for value after requirement', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(2_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValueIssue<Temporal.Instant, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_value',
      expected: `!${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value equal to requirement', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
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
  const dtAction = temporalNotValue(req, 'message');

  describe('should return dataset without issues', () => {
    test('for value before requirement', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for value after requirement', () => {
      const value = Temporal.PlainDateTime.from('2024-12-01T00:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValueIssue<Temporal.PlainDateTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_value',
      expected: `!${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value equal to requirement', () => {
      const value = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
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
  const dateAction = temporalNotValue(requirement, 'message');

  describe('should return dataset without issues', () => {
    test('for value before requirement', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for value after requirement', () => {
      const value = Temporal.PlainDate.from('2024-12-12');
      expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValueIssue<Temporal.PlainDate, typeof requirement>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_value',
      expected: `!${requirement.toJSON()}`,
      message: 'message',
      requirement,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value equal to requirement', () => {
      const value = Temporal.PlainDate.from('2024-06-01');
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
  const timeAction = temporalNotValue(req, 'message');

  describe('should return dataset without issues', () => {
    test('for value before requirement', () => {
      const value = Temporal.PlainTime.from('08:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for value after requirement', () => {
      const value = Temporal.PlainTime.from('18:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValueIssue<Temporal.PlainTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_value',
      expected: `!${req.toJSON()}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value equal to requirement', () => {
      const value = Temporal.PlainTime.from('12:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});
