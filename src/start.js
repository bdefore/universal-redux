import configure from './configure';

export default (server, projectConfig) => {
  const config = configure(projectConfig);

  server.listen(config.server.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
  });
};
