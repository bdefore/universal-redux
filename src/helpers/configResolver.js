export default () => {
  if (__SERVER__) {
    // if running the server, __CONFIG__ is assigned from the server
    return __CONFIG__;
  } else {
    // if running webpack, config is aliased
    import config from 'config';
    return config;
  }
}
