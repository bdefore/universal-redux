import { hooks, execute } from './hooks';
import createRenderer from './server/renderer';

export default (config) => {
  return Promise.resolve()
    .then(() => execute(hooks.CREATE_SERVER, { config: config.server, renderer: createRenderer(config) }))
    .then(({ server }) => execute(hooks.START_SERVER, { config: config.server, server }));
};
