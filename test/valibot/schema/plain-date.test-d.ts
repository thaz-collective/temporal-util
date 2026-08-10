import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { PlainDateIssue, PlainDateSchema } from '#src/valibot/schema/plain-date';
import { plainDate } from '#src/valibot/schema/plain-date';

describe('plainDate', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PlainDateSchema<undefined>;
      expectTypeOf(plainDate()).toEqualTypeOf<Schema>();
      expectTypeOf(plainDate(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(plainDate('message')).toEqualTypeOf<PlainDateSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(plainDate(() => 'message')).toEqualTypeOf<PlainDateSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainDateSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainDateIssue>();
    });
  });
});
