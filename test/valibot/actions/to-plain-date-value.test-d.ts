import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { ToPlainDateAction, ToPlainDateIssue } from '#src/valibot/actions/to-plain-date-value';
import { toPlainDate } from '#src/valibot/actions/to-plain-date-value';

describe('toPlainDate', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toPlainDate<string>()).toEqualTypeOf<ToPlainDateAction<string, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toPlainDate<string, 'message'>('message')).toEqualTypeOf<ToPlainDateAction<string, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(toPlainDate<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainDateAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainDateAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainDate>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainDateIssue<string>>();
    });
  });
});
