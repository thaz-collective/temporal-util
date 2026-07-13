import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { TemporalNotValueAction, TemporalNotValueIssue } from '#src/valibot/actions/not-value';
import type { TemporalValueInput } from '#src/valibot/actions/types';
import { temporalNotValue } from '#src/valibot/actions/not-value';

describe('temporalNotValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-06-01');

    test('with undefined message', () => {
      type Action = TemporalNotValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;
      expectTypeOf(temporalNotValue(requirement)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(temporalNotValue(requirement, 'message')).toEqualTypeOf<
        TemporalNotValueAction<TemporalValueInput, Temporal.PlainDate, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(temporalNotValue(requirement, () => 'message')).toEqualTypeOf<
        TemporalNotValueAction<TemporalValueInput, Temporal.PlainDate, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = TemporalNotValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalNotValueIssue<TemporalValueInput, Temporal.PlainDate>>();
    });
  });
});
