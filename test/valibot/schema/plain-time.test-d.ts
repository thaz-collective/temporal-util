import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { PlainTimeIssue, PlainTimeSchema } from '#src/valibot/schema/plain-time';
import { plainTime } from '#src/valibot/schema/plain-time';

describe('plainTime', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PlainTimeSchema<undefined>;
      expectTypeOf(plainTime()).toEqualTypeOf<Schema>();
      expectTypeOf(plainTime(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(plainTime('message')).toEqualTypeOf<PlainTimeSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(plainTime(() => 'message')).toEqualTypeOf<PlainTimeSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainTimeSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainTimeIssue>();
    });
  });
});
