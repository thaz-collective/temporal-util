import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { ToPlainYearMonthAction, ToPlainYearMonthIssue } from '#src/valibot/actions/to-plain-year-month';
import { toPlainYearMonth } from '#src/valibot/actions/to-plain-year-month';

describe('toPlainYearMonth', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toPlainYearMonth<string>()).toEqualTypeOf<ToPlainYearMonthAction<string, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toPlainYearMonth<string, 'message'>('message')).toEqualTypeOf<
        ToPlainYearMonthAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(toPlainYearMonth<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainYearMonthAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainYearMonthAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainYearMonth>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainYearMonthIssue<string>>();
    });
  });
});
