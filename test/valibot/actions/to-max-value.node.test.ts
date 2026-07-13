import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalToMaxValueAction } from '#src/valibot/actions/to-max-value';
import { temporalToMaxValue } from '#src/valibot/actions/to-max-value';

describe('temporalToMaxValue', () => {
  describe('should return action object', () => {
    test('with a Temporal.PlainDate requirement', () => {
      const requirement = Temporal.PlainDate.from('2024-06-01');
      expect(temporalToMaxValue(requirement)).toStrictEqual({
        kind: 'transformation',
        type: 'temporal_to_max_value',
        reference: temporalToMaxValue,
        async: false,
        requirement,
        '~run': expect.any(Function),
      } satisfies TemporalToMaxValueAction<Temporal.PlainDate, typeof requirement>);
    });
  });

  describe('should clamp to the maximum value', () => {
    test('for a Temporal.PlainDate after the requirement', () => {
      const requirement = Temporal.PlainDate.from('2024-06-01');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: requirement });
    });

    test('for a Temporal.Instant after the requirement', () => {
      const requirement = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      const action = temporalToMaxValue(requirement);
      const value = Temporal.Instant.fromEpochMilliseconds(2_000_000);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: requirement });
    });

    test('for a Temporal.PlainTime after the requirement', () => {
      const requirement = Temporal.PlainTime.from('12:00:00');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.PlainTime.from('16:00:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: requirement });
    });

    test('for a Temporal.PlainDateTime after the requirement', () => {
      const requirement = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.PlainDateTime.from('2024-12-31T23:59:59');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: requirement });
    });

    test('for a Temporal.ZonedDateTime after the requirement', () => {
      const requirement = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.ZonedDateTime.from('2024-12-31T23:59:59+00:00[UTC]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: requirement });
    });
  });

  describe('should pass through values within range', () => {
    test('for a value before the requirement', () => {
      const requirement = Temporal.PlainDate.from('2024-06-01');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a value equal to the requirement', () => {
      const requirement = Temporal.PlainDate.from('2024-06-01');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.PlainDate.from('2024-06-01');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a Temporal.ZonedDateTime before the requirement', () => {
      const requirement = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a Temporal.Instant before the requirement', () => {
      const requirement = Temporal.Instant.fromEpochMilliseconds(2_000_000);
      const action = temporalToMaxValue(requirement);
      const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a Temporal.PlainDateTime before the requirement', () => {
      const requirement = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for a Temporal.PlainTime before the requirement', () => {
      const requirement = Temporal.PlainTime.from('12:00:00');
      const action = temporalToMaxValue(requirement);
      const value = Temporal.PlainTime.from('08:00:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });
});
