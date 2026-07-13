import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalGTValueAction, TemporalGTValueIssue } from '#src/valibot/actions/gt-value';
import { temporalGTValue } from '#src/valibot/actions/gt-value';

describe('temporalGTValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    const baseAction: Omit<TemporalGTValueAction<Temporal.PlainDate, typeof requirement, never>, 'message'> = {
      kind: 'validation',
      type: 'temporal_gt_value',
      reference: temporalGTValue,
      expects: `>${requirement.toJSON()}`,
      requirement,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: TemporalGTValueAction<Temporal.PlainDate, typeof requirement, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(temporalGTValue(requirement)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(temporalGTValue(requirement, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies TemporalGTValueAction<Temporal.PlainDate, typeof requirement, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(temporalGTValue(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies TemporalGTValueAction<Temporal.PlainDate, typeof requirement, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    const action = temporalGTValue(requirement);

    test('for untyped inputs', () => {
      const issues: [TemporalGTValueIssue<Temporal.PlainDate, typeof requirement>] = [
        {
          kind: 'validation',
          type: 'temporal_gt_value',
          input: Temporal.PlainDate.from('2024-01-01'),
          expected: `>${requirement.toJSON()}`,
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

    test('for value after requirement', () => {
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.Instant after requirement', () => {
      const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const instantAction = temporalGTValue(req);
      const value = Temporal.Instant.fromEpochMilliseconds(2_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainTime after requirement', () => {
      const req = Temporal.PlainTime.from('12:00:00');
      const timeAction = temporalGTValue(req);
      const value = Temporal.PlainTime.from('16:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.PlainDateTime after requirement', () => {
      const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const dtAction = temporalGTValue(req);
      const value = Temporal.PlainDateTime.from('2024-12-31T23:59:59');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for Temporal.ZonedDateTime after requirement', () => {
      const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const zdtAction = temporalGTValue(req);
      const value = Temporal.ZonedDateTime.from('2024-12-31T23:59:59+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    const action = temporalGTValue(requirement, 'message');
    const baseIssue: Omit<TemporalGTValueIssue<Temporal.PlainDate, typeof requirement>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'temporal_gt_value',
      expected: `>${requirement.toJSON()}`,
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
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for value before requirement', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: value.toJSON() }],
      });
    });

    test('for Temporal.Instant equal to requirement', () => {
      const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const instantAction = temporalGTValue(req, 'message');
      const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_gt_value',
            expected: `>${req.toJSON()}`,
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
      const timeAction = temporalGTValue(req, 'message');
      const value = Temporal.PlainTime.from('08:00:00');
      expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_gt_value',
            expected: `>${req.toJSON()}`,
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
      const dtAction = temporalGTValue(req, 'message');
      const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_gt_value',
            expected: `>${req.toJSON()}`,
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
      const zdtAction = temporalGTValue(req, 'message');
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [
          {
            kind: 'validation',
            type: 'temporal_gt_value',
            expected: `>${req.toJSON()}`,
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
