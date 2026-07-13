import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { TemporalMaxValueAction, TemporalMaxValueIssue } from '#src/valibot/actions/max-value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalMaxValue } from '#src/valibot/actions/max-value';

describe('temporalMaxValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-12-31');

    test('with undefined message', () => {
      type Action = TemporalMaxValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;
      expectTypeOf(temporalMaxValue(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalMaxValue(requirement, 'message')).toEqualTypeOf<
        TemporalMaxValueAction<TemporalValueInput, Temporal.PlainDate, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalMaxValue(requirement, () => 'message')).toEqualTypeOf<
        TemporalMaxValueAction<TemporalValueInput, Temporal.PlainDate, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = TemporalMaxValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalMaxValueIssue<TemporalValueInput, Temporal.PlainDate>>();
    });
  });
});
