module.exports = {
  apps: [{
    name: 'ecostove',
    script: 'sensor-monitor.js',
    cwd: __dirname,
    env: {
      NO_BROWSER: '1',
    },
    restart_delay: 5000,
    max_restarts: 50,
    autorestart: true,
  }],
};
