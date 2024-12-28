// lib/cors.ts
export function addCorsHeaders() {
    return {
      "Access-Control-Allow-Origin": "*", // Change to specific domains in production
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }
  