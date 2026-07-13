import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalValuesAction, TemporalValuesIssue } from '#src/valibot/actions/values';
import { temporalValues } from '#src/valibot/actions/values';

describe('temporalValues', () => {
  describe('should return action object', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
    const baseAction: Omit<TemporalValuesAction<Temporal.PlainDate, typeof requirement, never>, 'message'> = {
      kind: 'validation',
      type: 'temporal_values',
      reference: temporalValues,
      expects: `=${requirement.map((req) => req.toJSON()).join(' | ')}`,
      requirement,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: TemporalValuesAction<Temporal.PlainDate, typeof requirement, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(temporalValues(requirement)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(temporalValues(requirement, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies TemporalValuesAction<Temporal.PlainDate, typeof requirement, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(temporalValues(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies TemporalValuesAction<Temporal.PlainDate, typeof requirement, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
    const action = temporalValues(requirement);

    test('for untyped inputs', () => {
      const issues: [TemporalValuesIssue<Temporal.PlainDate, typeof requirement>] = [
        {
          kind: 'validation',
          type: 'temporal_values',
          input: Temporal.PlainDate.from('2024-12-31'),
          expected: `=${requirement.map((req) => req.toJSON()).join(' | ')}`,
          received: '2024-12-31',
          message: 'message',
          requirement,
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
        },
      ];
      expect(action['~run']({ typed: false, value: Temporal.PlainDate.from('2024-12-31'), issues }, {})).toStrictEqual({
        typed: false,
        value: Temporal.PlainDate.from('2024-12-31'),
        issues,
      });
    });

    test('for value matching the first requirement', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for value matching the last requirement', () => {
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a value matching one of several mixed Temporal types', () => {
      const req = [
        Temporal.Instant.fromEpochMilliseconds(1_000_000),
        Temporal.PlainTime.from('12:00:00'),
        Temporal.PlainDate.from('2024-06-01'),
      ] as const;
      const mixedAction = temporalValues(req);
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(mixedAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a value matching a later entry even when earlier entries are a different type', () => {
      const req = [Temporal.Instant.fromEpochMilliseconds(1_000_000), Temporal.PlainDate.from('2024-06-01')] as const;
      const mixedAction = temporalValues(req);
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(mixedAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with a value issue', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
    const action = temporalValues(requirement, 'message');
    const baseIssue: Omit<TemporalValuesIssue<Temporal.PlainDate, typeof requirement>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_values',
      expected: `=${requirement.map((req) => req.toJSON()).join(' | ')}`,
      message: 'message',
      requirement,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for a type-compatible value matching none of the requirements', () => {
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for a type-compatible value among mixed Temporal type requirements', () => {
      const req = [Temporal.Instant.fromEpochMilliseconds(1_000_000), Temporal.PlainDate.from('2024-06-01')] as const;
      const mixedAction = temporalValues(req, 'message');
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(mixedAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_values',
            expected: `=${req.map((r) => r.toJSON()).join(' | ')}`,
            message: 'message',
            requirement: req,
            path: undefined,
            issues: undefined,
            lang: undefined,
            abortEarly: undefined,
            abortPipeEarly: undefined,
            input: value,
            received: value.toJSON(),
          },
        ],
      });
    });
  });

  describe('should return dataset with a requirement/value pair issue', () => {
    test('when no requirement shares the value type', () => {
      const req = [Temporal.Instant.fromEpochMilliseconds(1_000_000), Temporal.PlainTime.from('12:00:00')] as const;
      const action = temporalValues(req, 'message');
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_values',
            expected: `=${req.map((r) => r.toJSON()).join(' | ')}`,
            message: 'message',
            requirement: req,
            path: undefined,
            issues: undefined,
            lang: undefined,
            abortEarly: undefined,
            abortPipeEarly: undefined,
            input: value,
            received: value.toJSON(),
          },
        ],
      });
    });
  });
});
