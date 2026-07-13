import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { ToPlainTimeAction, ToPlainTimeIssue } from '#src/valibot/actions/to-plain-time-value';
import { toPlainTime } from '#src/valibot/actions/to-plain-time-value';

describe('toPlainTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toPlainTime<string>()).toEqualTypeOf<ToPlainTimeAction<string, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toPlainTime<string, 'message'>('message')).toEqualTypeOf<ToPlainTimeAction<string, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(toPlainTime<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainTimeAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainTimeAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainTimeIssue<string>>();
    });
  });
});
