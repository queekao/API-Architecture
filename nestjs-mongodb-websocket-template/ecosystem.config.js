module.exports = {
  apps: [
    {
      name: 'microservice-instant-messaging',
      script: 'dist/main.js',
      watch: true,
      ignore_watch: ['node_modules', '.git', '.vscode', '.pm2', 'static'],
      restart_delay: 10000,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
