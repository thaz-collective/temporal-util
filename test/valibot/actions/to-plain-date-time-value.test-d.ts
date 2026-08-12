import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { ToPlainDateTimeAction, ToPlainDateTimeIssue } from '#src/valibot/actions/to-plain-date-time-value';
import { toPlainDateTime } from '#src/valibot/actions/to-plain-date-time-value';

describe('toPlainDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toPlainDateTime<string>()).toEqualTypeOf<ToPlainDateTimeAction<string, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toPlainDateTime<string, 'message'>('message')).toEqualTypeOf<
        ToPlainDateTimeAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(toPlainDateTime<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainDateTimeAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainDateTimeAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainDateTimeIssue<string>>();
    });
  });
});
