import { describe, expect, test } from 'vite-plus/test';

import { getDefaultCalendar, getDefaultLocale, getDefaultTimeZone } from '#src/index';

describe('getDefaultCalendar', () => {
  test('returns the calendar resolved by the environment', () => {
    expect(getDefaultCalendar()).toBe(new Intl.DateTimeFormat().resolvedOptions().calendar);
  });
});

describe('getDefaultTimeZone', () => {
  test('returns the time zone resolved by the environment', () => {
    expect(getDefaultTimeZone()).toBe(new Intl.DateTimeFormat().resolvedOptions().timeZone);
  });
});

describe('getDefaultLocale', () => {
  test('returns the locale resolved by the environment', () => {
    expect(getDefaultLocale()).toBe(new Intl.DateTimeFormat().resolvedOptions().locale);
  });
});
