import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { TemporalToMinValueAction } from '#src/valibot/actions/to-min-value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalToMinValue } from '#src/valibot/actions/to-min-value';

describe('temporalToMinValue', () => {
  describe('should return action object', () => {
    test('with a Temporal.PlainDate requirement', () => {
      const requirement = Temporal.PlainDate.from('2024-06-01');
      type Action = TemporalToMinValueAction<TemporalValueInput, Temporal.PlainDate>;
      expectTypeOf(temporalToMinValue(requirement)).toEqualTypeOf<Action>();
    });
  });

  describe('should infer correct types', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    type Action = TemporalToMinValueAction<TemporalValueInput, Temporal.PlainDate>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });

    test('of requirement', () => {
      expectTypeOf(temporalToMinValue(requirement).requirement).toEqualTypeOf<Temporal.PlainDate>();
    });
  });
});
