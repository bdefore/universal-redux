const isProduction = process.env.NODE_ENV === 'production';
const apiPortDefault = isProduction ? 443 : 3000;
const apiPort = process.env.API_PORT || apiPortDefault;

module.exports = {
  api: {
    endpoint: '/v1',
    host: process.env.API_HOST || 'http://localhost',
    port: process.env.API_PORT || apiPortDefault
  },
  auth: {
    clientId: isProduction ? process.env.JWT_CLIENT_ID : undefined,
    clientSecret: isProduction ? process.env.JWT_CLIENT_SECRET : undefined,
    endpoint: `${process.env.AUTHENTICATION_HOST}/authenticate`
  },
  debug: !isProduction,
  endpoint: '/api',
  sessionStore: {
    type: 'redis',
    prefix: 'jwt-example',
    secret: process.env.JWT_CLIENT_SECRET,
    url: process.env.REDIS_URL
  }
}
