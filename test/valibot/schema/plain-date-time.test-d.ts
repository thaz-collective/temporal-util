import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { PlainDateTimeIssue, PlainDateTimeSchema } from '#src/valibot/schema/plain-date-time';
import { plainDateTime } from '#src/valibot/schema/plain-date-time';

describe('plainDateTime', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PlainDateTimeSchema<undefined>;
      expectTypeOf(plainDateTime()).toEqualTypeOf<Schema>();
      expectTypeOf(plainDateTime(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(plainDateTime('message')).toEqualTypeOf<PlainDateTimeSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(plainDateTime(() => 'message')).toEqualTypeOf<PlainDateTimeSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainDateTimeSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainDateTimeIssue>();
    });
  });
});
