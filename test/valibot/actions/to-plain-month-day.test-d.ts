import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { ToPlainMonthDayAction, ToPlainMonthDayIssue } from '#src/valibot/actions/to-plain-month-day';
import { toPlainMonthDay } from '#src/valibot/actions/to-plain-month-day';

describe('toPlainMonthDay', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toPlainMonthDay<string>()).toEqualTypeOf<ToPlainMonthDayAction<string, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toPlainMonthDay<string, 'message'>('message')).toEqualTypeOf<
        ToPlainMonthDayAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(toPlainMonthDay<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainMonthDayAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainMonthDayAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainMonthDay>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainMonthDayIssue<string>>();
    });
  });
});
