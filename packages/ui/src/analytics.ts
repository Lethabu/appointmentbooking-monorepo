/**
 * Lightweight analytics wrapper used across apps.
 *
 * This file provides a single exported function `trackEvent` that will attempt
 * to call Vercel Analytics if available, otherwise it falls back to sending a
 * request to a local analytics API route which can be wired to Vercel
 * Analytics or another provider.
 */

export async function trackEvent(eventName: string, props: Record<string, any> = {}) {
  try {
    // Try to dynamically call Vercel's track function if available
    // (@vercel/analytics may expose a track function in some setups).
    // This is a best-effort dynamic import to avoid hard dependency.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const analytics = await import('@vercel/analytics');
    if (analytics && typeof analytics.track === 'function') {
      analytics.track(eventName, props);
      return;
    }
  } catch (e) {
    // ignore dynamic import failures
  }

  // Fallback: POST to a local serverless endpoint that can be later wired
  // to Vercel Analytics server-side event ingestion or other BI tools.
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, props }),
    });
  } catch (e) {
    // Best-effort: swallow errors in client analytics to avoid breaking UX
    // In dev you may want to surface these.
    // eslint-disable-next-line no-console
    console.debug('analytics fallback failed', e);
  }
}

export default { trackEvent };
