import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalValueAction, TemporalValueIssue } from '#src/valibot/actions/value';
import { temporalValue } from '#src/valibot/actions/value';

describe('temporalValue', () => {
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

  describe('should return dataset without issues', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    const action = temporalValue(requirement);

    test('for untyped inputs', () => {
      const issues: [TemporalValueIssue<Temporal.PlainDate, typeof requirement>] = [
        {
          kind: 'validation',
          type: 'temporal_value',
          input: Temporal.PlainDate.from('2024-01-01'),
          expected: `=${requirement.toJSON()}`,
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

    test('for value equal to requirement', () => {
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.Instant equal to requirement', () => {
      const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const instantAction = temporalValue(req);
      const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainTime equal to requirement', () => {
      const req = Temporal.PlainTime.from('12:00:00');
      const timeAction = temporalValue(req);
      const value = Temporal.PlainTime.from('12:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainDateTime equal to requirement', () => {
      const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const dtAction = temporalValue(req);
      const value = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.ZonedDateTime equal to requirement', () => {
      const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const zdtAction = temporalValue(req);
      const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    const action = temporalValue(requirement, 'message');
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
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value after requirement', () => {
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for Temporal.Instant not equal to requirement', () => {
      const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const instantAction = temporalValue(req, 'message');
      const value = Temporal.Instant.fromEpochMilliseconds(2_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
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
            input: value,
            received: value.toJSON(),
          },
        ],
      });
    });

    test('for Temporal.PlainTime not equal to requirement', () => {
      const req = Temporal.PlainTime.from('12:00:00');
      const timeAction = temporalValue(req, 'message');
      const value = Temporal.PlainTime.from('16:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
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
            input: value,
            received: value.toJSON(),
          },
        ],
      });
    });

    test('for Temporal.PlainDateTime not equal to requirement', () => {
      const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const dtAction = temporalValue(req, 'message');
      const value = Temporal.PlainDateTime.from('2024-12-31T23:59:59');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
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
            input: value,
            received: value.toJSON(),
          },
        ],
      });
    });

    test('for Temporal.ZonedDateTime not equal to requirement', () => {
      const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const zdtAction = temporalValue(req, 'message');
      const value = Temporal.ZonedDateTime.from('2024-12-31T23:59:59+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
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
            input: value,
            received: value.toJSON(),
          },
        ],
      });
    });
  });
});
