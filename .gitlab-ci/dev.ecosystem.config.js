module.exports = {
  apps: [
    {
      name: 'optimining.optimap.id',
      namespace: 'optimining',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: '1',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 31011,
      },
    },
  ],
};
