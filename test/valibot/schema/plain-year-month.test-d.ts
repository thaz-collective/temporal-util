import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { PlainYearMonthIssue, PlainYearMonthSchema } from '#src/valibot/schema/plain-year-month';
import { plainYearMonth } from '#src/valibot/schema/plain-year-month';

describe('plainYearMonth', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PlainYearMonthSchema<undefined>;
      expectTypeOf(plainYearMonth()).toEqualTypeOf<Schema>();
      expectTypeOf(plainYearMonth(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(plainYearMonth('message')).toEqualTypeOf<PlainYearMonthSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(plainYearMonth(() => 'message')).toEqualTypeOf<PlainYearMonthSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainYearMonthSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainYearMonth>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainYearMonth>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainYearMonthIssue>();
    });
  });
});
