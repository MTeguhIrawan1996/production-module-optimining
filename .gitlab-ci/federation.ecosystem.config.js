module.exports = {
  apps: [
    {
      name: 'production.modules.federation.optimining.optimap.id',
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
