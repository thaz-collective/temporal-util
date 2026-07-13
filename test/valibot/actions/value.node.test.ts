import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalValueAction, TemporalValueIssue } from '#src/valibot/actions/value';
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
  const zdtAction = temporalValue(req);

  test('should return dataset without issues', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
    expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    test('for value before requirement', () => {
      expect().toStrictEqual({});
    });

    test('for value after requirement', () => {
      expect().toStrictEqual({});
    });
  });
});

describe('instant', () => {
  const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
  const instantAction = temporalValue(req);

  test('should return dataset without issues', () => {
    const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
    expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    test('for value before requirement', () => {
      expect().toStrictEqual({});
    });

    test('for value after requirement', () => {
      expect().toStrictEqual({});
    });
  });
});

describe('plainDateTime', () => {
  const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
  const dtAction = temporalValue(req);

  test('should return dataset without issues', () => {
    const value = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
    expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    test('for value before requirement', () => {
      expect().toStrictEqual({});
    });

    test('for value after requirement', () => {
      expect().toStrictEqual({});
    });
  });
});

describe('plainDate', () => {
  const requirement = Temporal.PlainDate.from('2024-06-01');
  const dateAction = temporalValue(requirement);

  test('should return dataset without issues', () => {
    const value = Temporal.PlainDate.from('2024-06-01');
    expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    test('for value before requirement', () => {
      const value = '2024-01-01';
      const issues: [TemporalValueIssue<Temporal.PlainDate, typeof requirement>] = [
        {
          kind: 'validation',
          type: 'temporal_value',
          input: Temporal.PlainDate.from(value),
          expected: `=${requirement.toJSON()}`,
          received: value,
          message: 'message',
          requirement,
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
        },
      ];

      expect(dateAction['~run']({ typed: false, value: Temporal.PlainDate.from(value), issues }, {})).toStrictEqual({
        typed: false,
        value: Temporal.PlainDate.from(value),
        issues,
      });
    });

    test('for value after requirement', () => {
      const value = '2024-12-12';
      const issues: [TemporalValueIssue<Temporal.PlainDate, typeof requirement>] = [
        {
          kind: 'validation',
          type: 'temporal_value',
          input: Temporal.PlainDate.from(value),
          expected: `=${requirement.toJSON()}`,
          received: value,
          message: 'message',
          requirement,
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
        },
      ];

      expect(dateAction['~run']({ typed: false, value: Temporal.PlainDate.from(value), issues }, {})).toStrictEqual({
        typed: false,
        value: Temporal.PlainDate.from(value),
        issues,
      });
    });
  });
});

describe('plainTime', () => {
  const req = Temporal.PlainTime.from('12:00:00');
  const timeAction = temporalValue(req);

  test('should return dataset without issues', () => {
    const value = Temporal.PlainTime.from('12:00:00');
    expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  describe('should return dataset with issues', () => {
    test('for value before requirement', () => {
      expect().toStrictEqual({});
    });

    test('for value after requirement', () => {
      expect().toStrictEqual({});
    });
  });
});
