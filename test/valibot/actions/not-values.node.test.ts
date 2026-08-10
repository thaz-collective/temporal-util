import { describe, expect, test } from 'vite-plus/test';

import type { ZonedDateTimeIssue } from '#src/valibot';
import type { TemporalNotValuesAction, TemporalNotValuesIssue } from '#src/valibot/actions/not-values';
import { temporalNotValues } from '#src/valibot/actions/not-values';

describe('should return action object', () => {
  const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
  const baseAction: Omit<TemporalNotValuesAction<Temporal.PlainDate, typeof requirement, never>, 'message'> = {
    kind: 'validation',
    type: 'temporal_not_values',
    reference: temporalNotValues,
    expects: `!${requirement.map((req) => req.toJSON()).join(' | ')}`,
    requirement,
    async: false,
    '~run': expect.any(Function),
  };

  test('with undefined message', () => {
    const action: TemporalNotValuesAction<Temporal.PlainDate, typeof requirement, undefined> = {
      ...baseAction,
      message: undefined,
    };
    expect(temporalNotValues(requirement)).toStrictEqual(action);
  });

  test('with string message', () => {
    expect(temporalNotValues(requirement, 'message')).toStrictEqual({
      ...baseAction,
      message: 'message',
    } satisfies TemporalNotValuesAction<Temporal.PlainDate, typeof requirement, string>);
  });

  test('with function message', () => {
    const message = () => 'message';
    expect(temporalNotValues(requirement, message)).toStrictEqual({
      ...baseAction,
      message,
    } satisfies TemporalNotValuesAction<Temporal.PlainDate, typeof requirement, typeof message>);
  });
});

describe('zonedDateTime', () => {
  const req = [
    Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]'),
    Temporal.ZonedDateTime.from('2024-12-01T00:00:00+00:00[UTC]'),
  ] as const;
  const zdtAction = temporalNotValues(req, 'message');

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

    expect(temporalNotValues([value])['~run']({ typed: false, value: null, issues }, {})).toStrictEqual({
      typed: false,
      value: null,
      issues,
    });
  });

  describe('should return dataset without issues', () => {
    test('for value matching no requirement', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValuesIssue<Temporal.ZonedDateTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_values',
      expected: `!${req.map((r) => r.toJSON()).join(' | ')}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value matching first requirement', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value matching second requirement', () => {
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
  const req = [
    Temporal.Instant.fromEpochMilliseconds(500_000),
    Temporal.Instant.fromEpochMilliseconds(2_000_000),
  ] as const;
  const instantAction = temporalNotValues(req, 'message');

  describe('should return dataset without issues', () => {
    test('for value matching no requirement', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValuesIssue<Temporal.Instant, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_values',
      expected: `!${req.map((r) => r.toJSON()).join(' | ')}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value matching first requirement', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(500_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value matching second requirement', () => {
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
  const req = [
    Temporal.PlainDateTime.from('2024-01-01T00:00:00'),
    Temporal.PlainDateTime.from('2024-12-01T00:00:00'),
  ] as const;
  const dtAction = temporalNotValues(req, 'message');

  describe('should return dataset without issues', () => {
    test('for value matching no requirement', () => {
      const value = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValuesIssue<Temporal.PlainDateTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_values',
      expected: `!${req.map((r) => r.toJSON()).join(' | ')}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value matching first requirement', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value matching second requirement', () => {
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
  const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-12-12')] as const;
  const dateAction = temporalNotValues(requirement, 'message');

  describe('should return dataset without issues', () => {
    test('for value matching no requirement', () => {
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValuesIssue<Temporal.PlainDate, typeof requirement>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_values',
      expected: `!${requirement.map((r) => r.toJSON()).join(' | ')}`,
      message: 'message',
      requirement,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value matching first requirement', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value matching second requirement', () => {
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
  const req = [Temporal.PlainTime.from('08:00:00'), Temporal.PlainTime.from('18:00:00')] as const;
  const timeAction = temporalNotValues(req, 'message');

  describe('should return dataset without issues', () => {
    test('for value matching no requirement', () => {
      const value = Temporal.PlainTime.from('12:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<TemporalNotValuesIssue<Temporal.PlainTime, typeof req>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_values',
      expected: `!${req.map((r) => r.toJSON()).join(' | ')}`,
      message: 'message',
      requirement: req,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value matching first requirement', () => {
      const value = Temporal.PlainTime.from('08:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value matching second requirement', () => {
      const value = Temporal.PlainTime.from('18:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});
