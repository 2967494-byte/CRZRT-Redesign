import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8080';

export default function () {
  // 1. Health check & me
  const meRes = http.get(`${BASE_URL}/api/auth.php?action=me`);
  check(meRes, { 'status is 200': (r) => r.status === 200 });

  sleep(1);
}
