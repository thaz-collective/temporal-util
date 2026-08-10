import type { BaseIssue, ErrorMessage, BaseSchema } from 'valibot';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.Instant} instance.
 */
export interface InstantIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'instant';
  expected: 'Temporal.Instant';
}

/**
 * Schema that accepts only {@link Temporal.Instant} instances.
 */
export interface InstantSchema<TMessage extends ErrorMessage<InstantIssue> | undefined> extends BaseSchema<
  Temporal.Instant,
  Temporal.Instant,
  InstantIssue
> {
  type: 'instant';
  reference: typeof instant;
  expects: 'Temporal.Instant';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.Instant} instances. Any other value type
 * produces an {@link InstantIssue}.
 *
 * @returns A schema representing {@link Temporal.Instant}.
 */
export function instant(): InstantSchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.Instant} instances. Any other value type
 * produces an {@link InstantIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.Instant}.
 */
export function instant<const TMessage extends ErrorMessage<InstantIssue> | undefined>(
  message: TMessage,
): InstantSchema<TMessage>;

export function instant(message?: ErrorMessage<InstantIssue>): InstantSchema<ErrorMessage<InstantIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'instant',
    reference: instant,
    expects: 'Temporal.Instant',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.Instant) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<Temporal.Instant, InstantIssue>;
    },
  };
}
