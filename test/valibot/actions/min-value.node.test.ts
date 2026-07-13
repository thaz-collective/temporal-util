import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalMinValueAction, TemporalMinValueIssue } from '#src/valibot/actions/min-value';
import { temporalMinValue } from '#src/valibot/actions/min-value';

describe('temporalMinValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-01-01');
    const baseAction: Omit<TemporalMinValueAction<Temporal.PlainDate, typeof requirement, never>, 'message'> = {
      kind: 'validation',
      type: 'temporal_min_value',
      reference: temporalMinValue,
      expects: `>=${requirement.toJSON()}`,
      requirement,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: TemporalMinValueAction<Temporal.PlainDate, typeof requirement, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(temporalMinValue(requirement)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(temporalMinValue(requirement, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies TemporalMinValueAction<Temporal.PlainDate, typeof requirement, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(temporalMinValue(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies TemporalMinValueAction<Temporal.PlainDate, typeof requirement, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    const action = temporalMinValue(requirement);

    test('for untyped inputs', () => {
      const issues: [TemporalMinValueIssue<Temporal.PlainDate, typeof requirement>] = [
        {
          kind: 'validation',
          type: 'temporal_min_value',
          input: Temporal.PlainDate.from('2024-01-01'),
          expected: `>=${requirement.toJSON()}`,
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

    test('for value after requirement', () => {
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.Instant equal to requirement', () => {
      const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const instantAction = temporalMinValue(req);
      const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.Instant after requirement', () => {
      const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const instantAction = temporalMinValue(req);
      const value = Temporal.Instant.fromEpochMilliseconds(2_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainTime equal to requirement', () => {
      const req = Temporal.PlainTime.from('10:00:00');
      const timeAction = temporalMinValue(req);
      const value = Temporal.PlainTime.from('10:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainTime after requirement', () => {
      const req = Temporal.PlainTime.from('10:00:00');
      const timeAction = temporalMinValue(req);
      const value = Temporal.PlainTime.from('23:59:59');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainDateTime equal to requirement', () => {
      const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const dtAction = temporalMinValue(req);
      const value = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainDateTime after requirement', () => {
      const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const dtAction = temporalMinValue(req);
      const value = Temporal.PlainDateTime.from('2024-12-31T23:59:59');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.ZonedDateTime equal to requirement', () => {
      const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const zdtAction = temporalMinValue(req);
      const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.ZonedDateTime after requirement', () => {
      const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const zdtAction = temporalMinValue(req);
      const value = Temporal.ZonedDateTime.from('2024-12-31T23:59:59+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    const action = temporalMinValue(requirement, 'message');
    const baseIssue: Omit<TemporalMinValueIssue<Temporal.PlainDate, typeof requirement>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_min_value',
      expected: `>=${requirement.toJSON()}`,
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

    test('for value one day before requirement', () => {
      const value = Temporal.PlainDate.from('2024-05-31');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for Temporal.Instant before requirement', () => {
      const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const instantAction = temporalMinValue(req, 'message');
      const value = Temporal.Instant.fromEpochMilliseconds(500_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_min_value',
            expected: `>=${req.toJSON()}`,
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

    test('for Temporal.PlainTime before requirement', () => {
      const req = Temporal.PlainTime.from('12:00:00');
      const timeAction = temporalMinValue(req, 'message');
      const value = Temporal.PlainTime.from('08:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_min_value',
            expected: `>=${req.toJSON()}`,
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

    test('for Temporal.PlainDateTime before requirement', () => {
      const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const dtAction = temporalMinValue(req, 'message');
      const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_min_value',
            expected: `>=${req.toJSON()}`,
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

    test('for Temporal.ZonedDateTime before requirement', () => {
      const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const zdtAction = temporalMinValue(req, 'message');
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_min_value',
            expected: `>=${req.toJSON()}`,
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

    test('for a value whose type does not match the requirement', () => {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const value = Temporal.Instant.fromEpochMilliseconds(0) as unknown as Temporal.PlainDate;
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });
  });
});
