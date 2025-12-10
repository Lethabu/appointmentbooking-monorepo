// Lightweight integration test for SSE -> cache merge logic
const assert = require('assert');

// Simulate the merge logic used in the dashboard SSE handler
function mergeBookings(prevWrapped, rows) {
  const prev = (prevWrapped && prevWrapped.bookings) || (Array.isArray(prevWrapped) ? prevWrapped : []);
  const map = new Map();
  prev.forEach((b) => map.set(b.id, b));
  rows.forEach((r) => map.set(r.id, r));
  const merged = Array.from(map.values()).sort((a, b) => (b.scheduled_time || 0) - (a.scheduled_time || 0));
  return { bookings: merged, count: merged.length };
}

// sample data
const initial = [
  { id: 'a', scheduled_time: 1700000000, service_name: 'Cut' },
  { id: 'b', scheduled_time: 1700001000, service_name: 'Color' },
];

const incoming = [
  { id: 'c', scheduled_time: 1700002000, service_name: 'Style' },
  { id: 'b', scheduled_time: 1700003000, service_name: 'Color (updated)' },
];

const result = mergeBookings({ bookings: initial }, incoming);

// expectations
assert.strictEqual(result.count, 3, 'Merged count should be 3');
const ids = result.bookings.map((r) => r.id);
assert.deepStrictEqual(ids, ['b', 'c', 'a'], 'Order should be newest first by scheduled_time');
const b = result.bookings.find((x) => x.id === 'b');
assert.strictEqual(b.service_name, 'Color (updated)', 'Existing booking should be updated by incoming row');

console.log('SSE cache merge test passed');
process.exit(0);
