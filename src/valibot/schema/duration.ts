import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.Duration} instance.
 */
export interface DurationIssue extends v.BaseIssue<unknown> {
  kind: 'schema';
  type: 'duration';
  expected: 'Temporal.Duration';
}

/**
 * Schema that accepts only {@link Temporal.Duration} instances.
 */
export interface DurationSchema<TMessage extends v.ErrorMessage<DurationIssue> | undefined> extends v.BaseSchema<
  Temporal.Duration,
  Temporal.Duration,
  DurationIssue
> {
  type: 'duration';
  reference: typeof duration;
  expects: 'Temporal.Duration';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.Duration} instances. Any other value type
 * produces a {@link DurationIssue}.
 *
 * @returns A schema representing {@link Temporal.Duration}.
 */
export function duration(): DurationSchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.Duration} instances. Any other value type
 * produces a {@link DurationIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.Duration}.
 */
export function duration<const TMessage extends v.ErrorMessage<DurationIssue> | undefined>(
  message: TMessage,
): DurationSchema<TMessage>;

export function duration(
  message?: v.ErrorMessage<DurationIssue>,
): DurationSchema<v.ErrorMessage<DurationIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'duration',
    reference: duration,
    expects: 'Temporal.Duration',
    async: false,
    message,
    get '~standard'() {
      return v._getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.Duration) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        v._addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.Duration, DurationIssue>;
    },
  };
}
