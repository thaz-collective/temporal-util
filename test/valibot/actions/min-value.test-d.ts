import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { TemporalMinValueAction, TemporalMinValueIssue } from '#src/valibot/actions/min-value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalMinValue } from '#src/valibot/actions/min-value';

describe('temporalMinValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-01-01');

    test('with undefined message', () => {
      type Action = TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;
      expectTypeOf(temporalMinValue(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalMinValue(requirement, 'message')).toEqualTypeOf<
        TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalMinValue(requirement, () => 'message')).toEqualTypeOf<
        TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalMinValueIssue<TemporalValueInput, Temporal.PlainDate>>();
    });
  });
});
