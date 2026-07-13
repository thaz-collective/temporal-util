import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { ToZonedDateTimeAction, ToZonedDateTimeIssue } from '#src/valibot/actions/to-zoned-date-time-value';
import { toZonedDateTime } from '#src/valibot/actions/to-zoned-date-time-value';

describe('toZonedDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toZonedDateTime<string>()).toEqualTypeOf<ToZonedDateTimeAction<string, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toZonedDateTime<string, 'message'>('message')).toEqualTypeOf<
        ToZonedDateTimeAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(toZonedDateTime<string, () => string>(() => 'message')).toEqualTypeOf<
        ToZonedDateTimeAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToZonedDateTimeAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToZonedDateTimeIssue<string>>();
    });
  });
});
