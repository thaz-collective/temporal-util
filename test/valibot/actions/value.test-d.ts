import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { TemporalValueAction, TemporalValueIssue } from '#src/valibot/actions/value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalValue } from '#src/valibot/actions/value';

describe('temporalValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');

    test('with undefined message', () => {
      type Action = TemporalValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;
      expectTypeOf(temporalValue(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalValue(requirement, 'message')).toEqualTypeOf<
        TemporalValueAction<TemporalValueInput, Temporal.PlainDate, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalValue(requirement, () => 'message')).toEqualTypeOf<
        TemporalValueAction<TemporalValueInput, Temporal.PlainDate, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = TemporalValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalValueIssue<TemporalValueInput, Temporal.PlainDate>>();
    });
  });
});
