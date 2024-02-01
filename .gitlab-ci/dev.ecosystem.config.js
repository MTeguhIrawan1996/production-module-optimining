module.exports = {
  apps: [
    {
      name: 'production.modules.dev.optimining.optimap.id',
      namespace: 'optimining-dev',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: '1',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 31018,
      },
    },
  ],
};
