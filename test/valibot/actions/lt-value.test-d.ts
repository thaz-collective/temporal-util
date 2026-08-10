import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { TemporalLTValueAction, TemporalLTValueIssue } from '#src/valibot/actions/lt-value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalLTValue } from '#src/valibot/actions/lt-value';

describe('temporalLTValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');

    test('with undefined message', () => {
      type Action = TemporalLTValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;
      expectTypeOf(temporalLTValue(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalLTValue(requirement, 'message')).toEqualTypeOf<
        TemporalLTValueAction<TemporalValueInput, Temporal.PlainDate, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalLTValue(requirement, () => 'message')).toEqualTypeOf<
        TemporalLTValueAction<TemporalValueInput, Temporal.PlainDate, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = TemporalLTValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalLTValueIssue<TemporalValueInput, Temporal.PlainDate>>();
    });
  });
});
