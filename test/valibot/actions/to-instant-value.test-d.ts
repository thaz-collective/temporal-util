import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { ToInstantAction, ToInstantIssue } from '#src/valibot/actions/to-instant-value';
import { toInstant } from '#src/valibot/actions/to-instant-value';

describe('toInstant', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toInstant<string>()).toEqualTypeOf<ToInstantAction<string, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toInstant<string, 'message'>('message')).toEqualTypeOf<ToInstantAction<string, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(toInstant<string, () => string>(() => 'message')).toEqualTypeOf<
        ToInstantAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToInstantAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.Instant>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToInstantIssue<string>>();
    });
  });
});
