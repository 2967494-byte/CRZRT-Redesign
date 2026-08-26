import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    test_run: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 500 },   // Warm-up to 500 VU
        { duration: '3m', target: 2000 },  // Plateau at 2000 VU
        { duration: '30s', target: 0 },    // Graceful ramp-down
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8080';

export default function () {
  const r = Math.random();

  if (r < 0.10) {
    // 10% - Check auth / register lookup
    const orgRes = http.get(`${BASE_URL}/api/org-lookup.php?inn=1655429272`);
    check(orgRes, { 'org lookup ok': (res) => res.status === 200 });
    sleep(5);
  } else if (r < 0.80) {
    // 70% - User testing cycle
    const cabRes = http.get(`${BASE_URL}/api/cabinet.php`);
    check(cabRes, { 'cabinet ok': (res) => res.status === 200 || res.status === 401 });
    sleep(3);

    // Heartbeat simulation
    const pingRes = http.post(`${BASE_URL}/api/attempt-ping.php`, JSON.stringify({ attemptId: 1, events: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(pingRes, { 'ping response ok': (res) => res.status === 200 || res.status === 401 });
    sleep(15);
  } else {
    // 20% - Admin dashboards
    const countsRes = http.get(`${BASE_URL}/api/admin-counts.php`);
    check(countsRes, { 'counts ok': (res) => res.status === 200 || res.status === 401 });
    sleep(10);
  }
}
