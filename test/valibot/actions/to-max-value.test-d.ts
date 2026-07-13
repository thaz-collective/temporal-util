import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { TemporalToMaxValueAction } from '#src/valibot/actions/to-max-value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalToMaxValue } from '#src/valibot/actions/to-max-value';

describe('temporalToMaxValue', () => {
  describe('should return action object', () => {
    test('with a Temporal.PlainDate requirement', () => {
      const requirement = Temporal.PlainDate.from('2024-06-01');
      type Action = TemporalToMaxValueAction<TemporalValueInput, Temporal.PlainDate>;
      expectTypeOf(temporalToMaxValue(requirement)).toEqualTypeOf<Action>();
    });
  });

  describe('should infer correct types', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');
    type Action = TemporalToMaxValueAction<TemporalValueInput, Temporal.PlainDate>;

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
      expectTypeOf(temporalToMaxValue(requirement).requirement).toEqualTypeOf<Temporal.PlainDate>();
    });
  });
});
