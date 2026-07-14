import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { TemporalToMinValueAction } from '#src/valibot/actions/to-min-value';
import { temporalToMinValue } from '#src/valibot/actions/to-min-value';

describe('should return action object', () => {
  const requirement = Temporal.PlainDate.from('2024-06-01');

  test('with a Temporal.PlainDate requirement', () => {
    expect(temporalToMinValue(requirement)).toStrictEqual({
      kind: 'transformation',
      type: 'temporal_to_min_value',
      reference: temporalToMinValue,
      async: false,
      requirement,
      '~run': expect.any(Function),
    } satisfies TemporalToMinValueAction<Temporal.PlainDate, typeof requirement>);
  });
});

describe('zonedDateTime', () => {
  const req = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
  const zdtAction = temporalToMinValue(req);

  test('should return value unchanged for value equal to requirement', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-01T12:00:00+00:00[UTC]');
    expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should return value unchanged for value after requirement', () => {
    const value = Temporal.ZonedDateTime.from('2024-12-01T00:00:00+00:00[UTC]');
    expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should clamp value to requirement for value before requirement', () => {
    const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
    expect(zdtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: req });
  });
});

describe('instant', () => {
  const req = Temporal.Instant.fromEpochMilliseconds(1_000_000);
  const instantAction = temporalToMinValue(req);

  test('should return value unchanged for value equal to requirement', () => {
    const value = Temporal.Instant.fromEpochMilliseconds(1_000_000);
    expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should return value unchanged for value after requirement', () => {
    const value = Temporal.Instant.fromEpochMilliseconds(2_000_000);
    expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should clamp value to requirement for value before requirement', () => {
    const value = Temporal.Instant.fromEpochMilliseconds(500_000);
    expect(instantAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: req });
  });
});

describe('plainDateTime', () => {
  const req = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
  const dtAction = temporalToMinValue(req);

  test('should return value unchanged for value equal to requirement', () => {
    const value = Temporal.PlainDateTime.from('2024-06-01T12:00:00');
    expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should return value unchanged for value after requirement', () => {
    const value = Temporal.PlainDateTime.from('2024-12-01T00:00:00');
    expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should clamp value to requirement for value before requirement', () => {
    const value = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
    expect(dtAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: req });
  });
});

describe('plainDate', () => {
  const requirement = Temporal.PlainDate.from('2024-06-01');
  const dateAction = temporalToMinValue(requirement);

  test('should return value unchanged for value equal to requirement', () => {
    const value = Temporal.PlainDate.from('2024-06-01');
    expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should return value unchanged for value after requirement', () => {
    const value = Temporal.PlainDate.from('2024-12-12');
    expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should clamp value to requirement for value before requirement', () => {
    const value = Temporal.PlainDate.from('2024-01-01');
    expect(dateAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: requirement });
  });
});

describe('plainTime', () => {
  const req = Temporal.PlainTime.from('12:00:00');
  const timeAction = temporalToMinValue(req);

  test('should return value unchanged for value equal to requirement', () => {
    const value = Temporal.PlainTime.from('12:00:00');
    expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should return value unchanged for value after requirement', () => {
    const value = Temporal.PlainTime.from('18:00:00');
    expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });

  test('should clamp value to requirement for value before requirement', () => {
    const value = Temporal.PlainTime.from('08:00:00');
    expect(timeAction['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value: req });
  });
});
