// Define the available hooks
const hooks = {
  client: {
    GENERATE_ROOT_COMPONENT: "client_generate_root_component"
  },
  server: {
    GENERATE_ROOT_COMPONENT: "server_generate_root_component"
  }
};
export default hooks;

//Cache for the custom hook executors
const executors = new Map();

//Register a hook by adding it to the executors map
export function register(hook, executor){
  if(!hooks.client[hook] && !hooks.server[hook]) {
    console.warn(`Unknown hook '${hook}'`);
    return;
  }
  if(typeof(executor) !== "function"){
    console.warn(`The hook executor must be a function`);
  }
  if(executors.has(hook)){
    console.warn(`Overriding the hook executor for '${hook}'`);
  }
  executors.put(hook, executor);
}

//Retrieve a registered hook or the default executor
export function hook(hook, defaultExecutor){
  return executors.get(hook) || defaultExecutor;
}