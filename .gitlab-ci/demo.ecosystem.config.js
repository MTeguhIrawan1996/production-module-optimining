module.exports = {
  apps: [
    {
      name: 'production.modules.demo.optimining.optimap.id',
      namespace: 'optimining-demo',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: '1',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 31032,
      },
    },
  ],
};
