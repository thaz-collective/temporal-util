import type { BaseIssue, ErrorMessage, BaseSchema } from 'valibot';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.PlainTime} instance.
 */
export interface PlainTimeIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'plain_time';
  expected: 'Temporal.PlainTime';
}

/**
 * Schema that accepts only {@link Temporal.PlainTime} instances.
 */
export interface PlainTimeSchema<TMessage extends ErrorMessage<PlainTimeIssue> | undefined> extends BaseSchema<
  Temporal.PlainTime,
  Temporal.PlainTime,
  PlainTimeIssue
> {
  type: 'plain_time';
  reference: typeof plainTime;
  expects: 'Temporal.PlainTime';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.PlainTime} instances. Any other value type
 * produces a {@link PlainTimeIssue}.
 *
 * @returns A schema representing {@link Temporal.PlainTime}.
 */
export function plainTime(): PlainTimeSchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.PlainTime} instances. Any other value type
 * produces a {@link PlainTimeIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.PlainTime}.
 */
export function plainTime<const TMessage extends ErrorMessage<PlainTimeIssue> | undefined>(
  message: TMessage,
): PlainTimeSchema<TMessage>;

export function plainTime(
  message?: ErrorMessage<PlainTimeIssue>,
): PlainTimeSchema<ErrorMessage<PlainTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'plain_time',
    reference: plainTime,
    expects: 'Temporal.PlainTime',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.PlainTime) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<Temporal.PlainTime, PlainTimeIssue>;
    },
  };
}
