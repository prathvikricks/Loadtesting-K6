import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loginTime = new Trend('login_time');
const logoutTime = new Trend('logout_time');
const apiResponseTime = new Trend('api_response_time');

export const options = {
  stages: [
    { duration: '20s', target: 50 },   // Ramp up to 50 users over 20 seconds
    { duration: '50s', target: 50 },   // Hold 50 users for 50 seconds
    { duration: '10s', target: 100 },  // Ramp up to 100 users over 10 seconds
    { duration: '40s', target: 100 },  // Hold 100 users for 40 seconds
    { duration: '50s', target: 0 },    // Ramp down to 0 users over 50 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests should be below 500ms
    errors: ['rate<0.1'],              // Error rate should be below 10%
    'login_time': ['p(95)<1000'],      // 95% of logins should be below 1s
    'logout_time': ['p(95)<500'],      // 95% of logouts should be below 500ms
  },
};

const BASE_URL = 'http://localhost:3000';

// Function to perform login
function performLogin() {
  const startTime = new Date();
  const loginRes = http.post(`${BASE_URL}/login`, {
    username: 'admin',
    password: 'password123',
  });
  
  loginTime.add(new Date() - startTime);
  
  check(loginRes, {
    'login successful': (r) => r.status === 200 && r.json().token !== undefined,
  }) || errorRate.add(1);
  
  return loginRes.json().token;
}

// Function to perform logout
function performLogout(token) {
  const startTime = new Date();
  const logoutRes = http.post(`${BASE_URL}/logout`, null, {
    headers: {
      'x-auth-token': token,
    },
  });
  
  logoutTime.add(new Date() - startTime);
  
  check(logoutRes, {
    'logout successful': (r) => r.status === 200,
  }) || errorRate.add(1);
}

// Function to test API endpoints
function testApiEndpoints(token) {
  const params = {
    headers: {
      'x-auth-token': token,
    },
  };

  // Test /time endpoint
  const timeRes = http.get(`${BASE_URL}/time`, params);
  check(timeRes, {
    'time endpoint status is 200': (r) => r.status === 200,
    'time response has valid data': (r) => r.json().time !== undefined,
  }) || errorRate.add(1);
  apiResponseTime.add(timeRes.timings.duration);

  // Test /random-message endpoint
  const messageRes = http.get(`${BASE_URL}/random-message`, params);
  check(messageRes, {
    'random message endpoint status is 200': (r) => r.status === 200,
    'random message response is valid': (r) => r.json().message !== undefined,
  }) || errorRate.add(1);
  apiResponseTime.add(messageRes.timings.duration);
}

export default function () {
  // Perform multiple login/logout cycles
  for (let cycle = 0; cycle < 3; cycle++) {
    // Login
    const token = performLogin();
    
    // Test API endpoints with the new token
    testApiEndpoints(token);
    
    // Small pause to simulate user activity
    sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
    
    // Logout
    performLogout(token);
    
    // Pause between cycles
    sleep(1);
  }
}