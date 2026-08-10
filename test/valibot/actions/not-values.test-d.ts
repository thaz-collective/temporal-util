import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { TemporalNotValuesAction, TemporalNotValuesIssue } from '#src/valibot/actions/not-values';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalNotValues } from '#src/valibot/actions/not-values';

describe('temporalNotValues', () => {
  describe('should return action object', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;

    test('with undefined message', () => {
      type Action = TemporalNotValuesAction<TemporalValueInput, typeof requirement, undefined>;
      expectTypeOf(temporalNotValues(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalNotValues(requirement, 'message')).toEqualTypeOf<
        TemporalNotValuesAction<TemporalValueInput, typeof requirement, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalNotValues(requirement, () => 'message')).toEqualTypeOf<
        TemporalNotValuesAction<TemporalValueInput, typeof requirement, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    const requirement = [Temporal.PlainDate.from('2024-01-01'), Temporal.PlainDate.from('2024-06-01')] as const;
    type Action = TemporalNotValuesAction<TemporalValueInput, typeof requirement, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        TemporalNotValuesIssue<TemporalValueInput, typeof requirement>
      >();
    });
  });
});
