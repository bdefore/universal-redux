// Define the available hooks
export const hooks = {
  client: {
    GENERATE_ROOT_COMPONENT: 'client_generate_root_component'
  },
  server: {
    GENERATE_ROOT_COMPONENT: 'server_generate_root_component'
  }
};

// Cache for the custom hook executors
const executors = new Map();
const hookValues = Array.concat(
  Object.keys(hooks.client).map((hook) => hooks.client[hook]),
  Object.keys(hooks.server).map((hook) => hooks.server[hook])
);

// Register a hook by adding it to the executors map
export function register(hook, executor) {
  if (hookValues.indexOf(hook) === -1) {
    console.warn(`Unknown hook '${hook}'`);
    return;
  }
  if (typeof(executor) !== 'function') {
    console.warn(`The hook executor must be a function`);
  }
  if (executors.has(hook)) {
    console.warn(`Overriding the hook executor for '${hook}'`);
  }
  executors.set(hook, executor);
}

// Execute registered hook or the default executor. It always returns a promise
export function execute(hook, params, defaultExecutor) {
  const executor = executors.get(hook) || defaultExecutor;
  return Promise.resolve()
    .then(() => executor(params));
}
