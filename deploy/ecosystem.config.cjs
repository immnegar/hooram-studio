module.exports = {
  apps: [
    {
      name: 'hooram-studio',
      script: 'server/index.js',
      instances: 1, // Single instance required for JSON file database atomicity
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '350M',
      restart_delay: 3000,
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true
    }
  ]
};

