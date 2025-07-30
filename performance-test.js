import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
export let errorRate = new Rate("errors");

// Test configuration with increased VUs
export let options = {
  stages: [
    { duration: "15s", target: 100 }, // Ramp up to 100 VUs over 15 seconds
    { duration: "60s", target: 300 }, // Ramp up to 300 VUs over 60 seconds
    { duration: "30s", target: 500 }, // Ramp up to 500 VUs over 30 seconds
    { duration: "60s", target: 500 }, // Hold 500 VUs for 60 seconds
    { duration: "20s", target: 0 }, // Ramp down to 0 VUs over 20 seconds
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // Adjusted for higher load
    http_req_failed: ["rate<0.1"],
    errors: ["rate<0.1"],
  },
};

// API endpoints for testing
const BASE_URL = "http://localhost:3000/api";
const endpoints = [
  { path: "/guests", weight: 40 },
  { path: "/products", weight: 45 },
  { path: "/parameters", weight: 5 },
];

// Main test function
export default function () {
  // Headers
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // Weighted random endpoint selection
  let random = Math.random() * 100;
  let cumulativeWeight = 0;
  let selectedEndpoint = endpoints[0];

  for (let endpoint of endpoints) {
    cumulativeWeight += endpoint.weight;
    if (random <= cumulativeWeight) {
      selectedEndpoint = endpoint;
      break;
    }
  }

  let url = `${BASE_URL}${selectedEndpoint.path}`;

  // Make HTTP GET request
  let response = http.get(url, params);

  // Checks for response validation
  let checkResult = check(response, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
    "response time < 500ms": (r) => r.timings.duration < 500,
    "response has body": (r) => r.body && r.body.length > 0,
    "no server errors": (r) => r.status < 500,
  });

  // Record errors for custom metric
  errorRate.add(!checkResult);

  // Add some think time to simulate real user behavior
  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds
}

// Setup function (runs once before test)
export function setup() {
  console.log("Starting enhanced performance test...");
  console.log("Base URL:", BASE_URL);
  console.log("Testing endpoints:");
  endpoints.forEach((ep) => {
    console.log(`  GET ${ep.path} (${ep.weight}% weight)`);
  });
  console.log("Load pattern: 15s→100 VUs → 60s→300 VUs → 30s→500 VUs → 60s hold → 20s→0 VUs");
  console.log("Expected peak load: 500 concurrent virtual users");
}

// Teardown function (runs once after test)
export function teardown() {
  console.log("Enhanced performance test completed.");
  console.log("Check the results for:");
  console.log("- Response times (p95 should be < 500ms)");
  console.log("- Error rates (should be < 10%)");
  console.log("- Throughput (requests per second)");
}
