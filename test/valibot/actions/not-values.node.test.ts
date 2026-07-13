import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalNotValuesAction, TemporalNotValuesIssue } from '#src/valibot/actions/not-values';
import { temporalNotValues } from '#src/valibot/actions/not-values';

describe('temporalNotValues', () => {
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

  describe('should return dataset without issues', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
    const action = temporalNotValues(requirement);

    test('for untyped inputs', () => {
      const issues: [TemporalNotValuesIssue<Temporal.PlainDate, typeof requirement>] = [
        {
          kind: 'validation',
          type: 'temporal_not_values',
          input: Temporal.PlainDate.from('2024-01-01'),
          expected: `!${requirement.map((req) => req.toJSON()).join(' | ')}`,
          received: '2024-01-01',
          message: 'message',
          requirement,
          path: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
        },
      ];
      expect(action['~run']({ typed: false, value: Temporal.PlainDate.from('2024-01-01'), issues }, {})).toStrictEqual({
        typed: false,
        value: Temporal.PlainDate.from('2024-01-01'),
        issues,
      });
    });

    test('for a type-compatible value matching none of the requirements', () => {
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a value whose type does not match any requirement', () => {
      const req = [Temporal.Instant.fromEpochMilliseconds(1_000_000), Temporal.PlainTime.from('12:00:00')] as const;
      const mixedAction = temporalNotValues(req);
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(mixedAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
    const action = temporalNotValues(requirement, 'message');
    const baseIssue: Omit<TemporalNotValuesIssue<Temporal.PlainDate, typeof requirement>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_not_values',
      expected: `!${requirement.map((req) => req.toJSON()).join(' | ')}`,
      message: 'message',
      requirement,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for value matching the first requirement', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value matching the last requirement', () => {
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for a value matching a later entry even when earlier entries are a different type', () => {
      const req = [Temporal.Instant.fromEpochMilliseconds(1_000_000), Temporal.PlainDate.from('2024-06-01')] as const;
      const mixedAction = temporalNotValues(req, 'message');
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(mixedAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
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
            input: value,
            received: value.toJSON(),
          },
        ],
      });
    });
  });
});
