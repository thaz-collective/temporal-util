import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { PlainMonthDayIssue, PlainMonthDaySchema } from '#src/valibot/schema/plain-month-day';
import { plainMonthDay } from '#src/valibot/schema/plain-month-day';

describe('plainMonthDay', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PlainMonthDaySchema<undefined>;
      expectTypeOf(plainMonthDay()).toEqualTypeOf<Schema>();
      expectTypeOf(plainMonthDay(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(plainMonthDay('message')).toEqualTypeOf<PlainMonthDaySchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(plainMonthDay(() => 'message')).toEqualTypeOf<PlainMonthDaySchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainMonthDaySchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainMonthDay>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainMonthDay>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainMonthDayIssue>();
    });
  });
});
