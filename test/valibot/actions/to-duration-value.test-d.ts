import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { ToDurationAction, ToDurationIssue } from '#src/valibot/actions/to-duration-value';
import { toDuration } from '#src/valibot/actions/to-duration-value';

describe('toDuration', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expectTypeOf(toDuration<number>({ durationType: 'hours' })).toEqualTypeOf<ToDurationAction<number, undefined>>();
    });

    test('with string message', () => {
      expectTypeOf(toDuration<number, 'message'>({ durationType: 'hours' }, 'message')).toEqualTypeOf<
        ToDurationAction<number, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(toDuration<number, () => string>({ durationType: 'hours' }, () => 'message')).toEqualTypeOf<
        ToDurationAction<number, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToDurationAction<number, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.Duration>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToDurationIssue<number>>();
    });
  });
});
