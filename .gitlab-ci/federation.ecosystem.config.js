module.exports = {
  apps: [
    {
      name: 'federation.production.modules.dev.optimining.optimap.id',
      namespace: 'optimining-federation',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: '1',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 31021,
      },
    },
  ],
};
