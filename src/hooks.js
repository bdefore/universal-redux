// Define the available hooks
export const hooks = {
  CREATE_REDUX_STORE: 'create_redux_store',
  CREATE_REDUX_MIDDLEWARE: 'create_redux_middleware',
  CREATE_REDUX_REDUCER: 'create_redux_reducer',
  CREATE_ROOT_COMPONENT: 'create_root_component',
  UPDATE_ROOT_COMPONENT: 'update_root_component',
  RENDER_ROOT_COMPONENT: 'render_root_component',

  CREATE_SERVER: 'create_server',
  START_SERVER: 'start_server',
  CREATE_SERVER_RESPONSE: 'create_server_response'
};

export const environments = {
  SERVER: 'server',
  CLIENT: 'client',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
};

export const positions = {
  BEFORE: 'before_',
  AFTER: 'after_'
};

// Cache for the custom hook executors
const executors = new Map();

const hookValues = Array.concat(
  Object.keys(hooks).map((key) => hooks[key])
);
const environmentValues = Array.concat(
  Object.keys(environments).map((key) => environments[key])
);
const positionValues = Array.concat(
  Object.keys(positions).map((key) => positions[key])
);


// Register a hook by adding it to the executors map
// The bulk of this function is argument validation to help the developer
// find issues with the code.
export function register(hook, executor, { environments: hookEnvs, position: hookPos } = {}) {
  let hookPosition = hookPos;
  let hookEnvironments = hookEnvs;

  if (hookValues.indexOf(hook) === -1) {
    console.warn(`Unknown hook '${hook}'`);
    return;
  }
  if (typeof(executor) !== 'function') {
    console.warn('The hook executor must be a function');
    return;
  }
  if (hookPosition && positionValues.hookPosition(hookPos) === -1) {
    console.warn(`Unknown hook position '${hookPosition}'`);
    return;
  } else if (!hookPosition) {
    hookPosition = '';
  }
  if (hookEnvironments && !(hookEnvironments instanceof Array)) {
    hookEnvironments = [ hookEnvironments ];
  }
  if (hookEnvironments) {
    for (let i = 0; i < hookEnvironments.length; i++) {
      if (environmentValues.indexOf(hookEnvironments[i]) !== -1) {
        continue;
      }
      console.warn(`Unknown hook environment '${hookEnvironments[i]}'`);
      return;
    }

    // Do not register the hook if it does not match the environment
    if (typeof(__SERVER__) !== 'undefined' &&
        typeof(__CLIENT__) !== 'undefined' &&
        typeof(__DEVELOPMENT__) !== 'undefined') {
      if (__SERVER__ && hookEnvironments.indexOf(environments.CLIENT) !== -1 && hookEnvironments.indexOf(environments.SERVER) === -1 ||
          __CLIENT__ && hookEnvironments.indexOf(environments.SERVER) !== -1 && hookEnvironments.indexOf(environments.CLIENT) === -1 ||
          __DEVELOPMENT__ && hookEnvironments.indexOf(environments.PRODUCTION) !== -1 && hookEnvironments.indexOf(environments.DEVELOPMENT) === -1 ||
          !__DEVELOPMENT__ && hookEnvironments.indexOf(environments.DEVELOPMENT) !== -1 && hookEnvironments.indexOf(environments.PRODUCTION) === -1) {
        return;
      }
    } else {
      return;
    }
  }

  const fullHook = hookPosition + hook;
  let existingExecutor = executors.get(fullHook);
  if (hookPosition === '' && !!existingExecutor) {
    console.warn(`Overriding the hook executor for '${hook}'`);
  }

  // There can be multiple BEFORE and AFTER executors
  if (hookPosition) {
    if (!existingExecutor) {
      existingExecutor = [];
      executors.set(fullHook, existingExecutor);
    }
    existingExecutor.push(executor);
  } else {
    executors.set(fullHook, executor);
  }
}

// Execute registered hook or the default executor. It always returns a promise
export function execute(hook, properties, defaultExecutor) {
  const beforeExecutors = executors.get(positions.BEFORE + hook);
  const executor = executors.get(hook) || defaultExecutor;
  const afterExecutors = executors.get(positions.AFTER + hook);

  let props = properties;
  if (!executor) {
    throw new Error(`You must register a plugin that registers a default implementation of the '${hook}' hook.`);
  }

  // Modify the input props via the before hooks (if any).
  if (beforeExecutors) {
    props = beforeExecutors.reduce((tProps, exec) => exec(tProps), props);
  }
  let result = executor(props);
  // Modify the output result via the after hooks (if any).
  if (afterExecutors) {
    result = afterExecutors.reduce((tResult, exec) => exec(tResult, props), result);
  }

  return result;
}
