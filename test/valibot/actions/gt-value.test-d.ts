import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { TemporalGTValueAction, TemporalGTValueIssue } from '#src/valibot/actions/gt-value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalGTValue } from '#src/valibot/actions/gt-value';

describe('temporalGTValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');

    test('with undefined message', () => {
      type Action = TemporalGTValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;
      expectTypeOf(temporalGTValue(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalGTValue(requirement, 'message')).toEqualTypeOf<
        TemporalGTValueAction<TemporalValueInput, Temporal.PlainDate, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalGTValue(requirement, () => 'message')).toEqualTypeOf<
        TemporalGTValueAction<TemporalValueInput, Temporal.PlainDate, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = TemporalGTValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalGTValueIssue<TemporalValueInput, Temporal.PlainDate>>();
    });
  });
});
