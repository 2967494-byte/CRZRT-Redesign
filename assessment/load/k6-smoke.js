/**
 * k6 load smoke for Assessment API
 *
 * Install: https://k6.io
 * Run against local or staging:
 *   k6 run -e BASE_URL=http://localhost:8080 -e VUS=50 -e DURATION=30s assessment/load/k6-smoke.js
 *
 * Full 5000 VU target only on customer hardware:
 *   k6 run -e BASE_URL=https://test.zakupki.tatar -e VUS=5000 -e DURATION=2m assessment/load/k6-smoke.js
 *
 * Note: registration is rate-limited; this script hits public read endpoints + login failures lightly.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:8080';
const VUS = Number(__ENV.VUS || 20);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  vus: VUS,
  duration: DURATION,
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],
  },
};

export default function () {
  const dig = http.get(`${BASE}/api/districts.php`);
  check(dig, { 'districts 200': (r) => r.status === 200 });

  const inn = http.get(`${BASE}/api/org-lookup.php?inn=1644010001`);
  check(inn, { 'org-lookup 200': (r) => r.status === 200 });

  const login = http.post(
    `${BASE}/api/auth.php?action=login`,
    JSON.stringify({ email: 'nobody@example.com', password: 'wrong' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(login, { 'login handled': (r) => r.status === 401 || r.status === 429 });

  sleep(0.3);
}
