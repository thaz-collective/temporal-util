import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { TemporalValueInput } from '#src/valibot/actions/types';
import type { TemporalValuesAction, TemporalValuesIssue } from '#src/valibot/actions/values';
import { temporalValues } from '#src/valibot/actions/values';

describe('temporalValues', () => {
  describe('should return action object', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;

    test('with undefined message', () => {
      type Action = TemporalValuesAction<TemporalValueInput, typeof requirement, undefined>;
      expectTypeOf(temporalValues(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalValues(requirement, 'message')).toEqualTypeOf<
        TemporalValuesAction<TemporalValueInput, typeof requirement, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalValues(requirement, () => 'message')).toEqualTypeOf<
        TemporalValuesAction<TemporalValueInput, typeof requirement, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
    type Action = TemporalValuesAction<TemporalValueInput, typeof requirement, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalValuesIssue<TemporalValueInput, typeof requirement>>();
    });
  });
});
