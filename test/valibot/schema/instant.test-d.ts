import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InstantIssue, InstantSchema } from '#src/valibot/schema/instant';
import { instant } from '#src/valibot/schema/instant';

describe('instant', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = InstantSchema<undefined>;
      expectTypeOf(instant()).toEqualTypeOf<Schema>();
      expectTypeOf(instant(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(instant('message')).toEqualTypeOf<InstantSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(instant(() => 'message')).toEqualTypeOf<InstantSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = InstantSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.Instant>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.Instant>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<InstantIssue>();
    });
  });
});
