export default {
  apps: [{
    name: 'analytics-dashboard',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}