/**
 * Centralizes environment detection so when working with we have a consistent calendar value
 *
 * @returns Calendar identifier string (e.g. `"gregory"`).
 */
export function getDefaultCalendar() {
  return new Intl.DateTimeFormat().resolvedOptions().calendar;
}

/**
 * Centralizes environment detection so when working with we have a consistent time zone value
 *
 * @returns IANA time zone string (e.g. `"America/New_York"`).
 */
export function getDefaultTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Centralizes environment detection so when working with we have a consistent locale value
 *
 * @returns BCP 47 locale string (e.g. `"en-US"`).
 */
export function getDefaultLocale() {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}
