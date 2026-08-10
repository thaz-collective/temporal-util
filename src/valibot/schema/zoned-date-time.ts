import type { BaseIssue, ErrorMessage, BaseSchema } from 'valibot';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.ZonedDateTime} instance.
 */
export interface ZonedDateTimeIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'zoned_date_time';
  expected: 'Temporal.ZonedDateTime';
}

/**
 * Schema that accepts only {@link Temporal.ZonedDateTime} instances.
 */
export interface ZonedDateTimeSchema<TMessage extends ErrorMessage<ZonedDateTimeIssue> | undefined> extends BaseSchema<
  Temporal.ZonedDateTime,
  Temporal.ZonedDateTime,
  ZonedDateTimeIssue
> {
  type: 'zoned_date_time';
  reference: typeof zonedDateTime;
  expects: 'Temporal.ZonedDateTime';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.ZonedDateTime} instances. Any other value type
 * produces a {@link ZonedDateTimeIssue}.
 *
 * @returns A schema representing {@link Temporal.ZonedDateTime}.
 */
export function zonedDateTime(): ZonedDateTimeSchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.ZonedDateTime} instances. Any other value type
 * produces a {@link ZonedDateTimeIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.ZonedDateTime}.
 */
export function zonedDateTime<const TMessage extends ErrorMessage<ZonedDateTimeIssue> | undefined>(
  message: TMessage,
): ZonedDateTimeSchema<TMessage>;

export function zonedDateTime(
  message?: ErrorMessage<ZonedDateTimeIssue>,
): ZonedDateTimeSchema<ErrorMessage<ZonedDateTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'zoned_date_time',
    reference: zonedDateTime,
    expects: 'Temporal.ZonedDateTime',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.ZonedDateTime) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<Temporal.ZonedDateTime, ZonedDateTimeIssue>;
    },
  };
}
