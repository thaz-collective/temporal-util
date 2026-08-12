import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type { ZonedDateTimeIssue, ZonedDateTimeSchema } from '#src/valibot/schema/zoned-date-time';
import { zonedDateTime } from '#src/valibot/schema/zoned-date-time';

describe('zonedDateTime', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = ZonedDateTimeSchema<undefined>;
      expectTypeOf(zonedDateTime()).toEqualTypeOf<Schema>();
      expectTypeOf(zonedDateTime(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(zonedDateTime('message')).toEqualTypeOf<ZonedDateTimeSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(zonedDateTime(() => 'message')).toEqualTypeOf<ZonedDateTimeSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ZonedDateTimeSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<ZonedDateTimeIssue>();
    });
  });
});
