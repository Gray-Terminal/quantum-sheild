// src/config.js
const config = {
  // For production: your-railway-backend-url.railway.app
  // For development: localhost:8000
  API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:8000"
};

export default config;