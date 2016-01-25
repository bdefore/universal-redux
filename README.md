# Universal Redux

[![npm version](https://badge.fury.io/js/universal-redux.svg)](https://badge.fury.io/js/universal-redux)
[![build status](https://img.shields.io/travis/bdefore/universal-redux/master.svg?style=flat-square)](https://travis-ci.org/bdefore/universal-redux)
[![Dependency Status](https://david-dm.org/bdefore/universal-redux.svg?style=flat-square)](https://david-dm.org/bdefore/universal-redux)
[![devDependency Status](https://david-dm.org/bdefore/universal-redux/dev-status.svg?style=flat-square)](https://david-dm.org/bdefore/universal-redux#info=devDependencies)
[![Demo on Heroku](https://img.shields.io/badge/demo-heroku-brightgreen.svg?style=flat-square)](https://universal-redux.herokuapp.com)
[![Discord](https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bXmzEb4)

### What and Why

Universal Redux is an npm package that when used as a dependency in your project provides a universal (isomorphic) rendering server. You can either use its defaults and begin coding your project, or configure it to your liking with custom Webpack options and Express or Redux middleware. It's intended as both an easy starting point for developers new to React and Redux, as well as an extensible base by which advanced developers can augment with their own middleware and keep up to date with the fast-moving React ecosystem.

### Getting Started

The quickest way to get started is to clone the [starter project](https://github.com/bdefore/universal-redux-starter). This gives you a base project that is set up with default configurations of Webpack and Express.

#### Other Examples

- [An example with JWT authentication](https://github.com/bdefore/universal-redux-jwt) ([Heroku demo](https://universal-redux-jwt-example.herokuapp.com))
- [A refactor of react-redux-universal-hot-example with universal-redux and redux-simple-router](https://github.com/bdefore/react-redux-universal-hot-example/tree/babel6) ([Heroku demo](https://universal-redux.herokuapp.com))

### Usage

Your project must define a set of routes as specified by a [React Router](https://github.com/rackt/react-router) configuration, but other than that, your folder structure and development path is up to you. Depending on your other dependencies, you may want to use a version of Universal Redux that is not the latest, using the [section below](https://github.com/bdefore/universal-redux#what-version-to-use) to decide.

#### Requirements

Node.JS >= 4.1.1
npm >= 3.3.12 (install via `npm install -g npm@3` if you are on Node 4)

#### Install

```
npm install --save universal-redux
```

### Customization

The configuration file in your project at `config/universal-redux.config.js` defines what properties you want to customize. You can start by copying the [annotated example](https://github.com/bdefore/universal-redux/blob/master/config/universal-redux.config.js). The configuration file is optional and is only necessary if you wish to modify default behavior.

#### Routes

Generally kept in `src/routes.js`, this is where you define what routes map to what views. See [`routes.js`](https://github.com/bdefore/react-redux-universal-hot-example/blob/example-project/src/routes.js) in the example project.

#### Webpack configuration

Any items specified in the `webpack.config` of your configuration will be merged with the [default Webpack configuration](https://github.com/bdefore/universal-redux/blob/master/config/webpack.config.js). You may also turn on `verbose` mode to see the exact Webpack configuration you are running.

#### Express middleware

You can add your own Express middleware like so:

```javascript
import { express, renderer, start } from 'universal-redux';
import config from '../config/universal-redux.config.js';

const app = express(config);

// app.use(someMiddleware);
// app.use(someOtherMiddleware);

app.use(renderer(config));
start(app, config);
```

Alternatively, you may create your own Express instance, add middleware beforehand and pass that instance as parameter when calling `universal.app(app)`.

#### Redux middleware

You can activate your own Redux middleware by specifying the `middleware` property in the configuration file. This must be a path to a file which exports each middleware as a function. On serverside renders, those functions will be called with two parameters: the Express request and response objects. On clientside renders, they will be called with none. All properties specified in `globals` will be available to the middleware.

#### Adding your own items to HTML head

The `html.head` configuration allows you to define your own `<head>` that will be merged with the necessary items for serverside rendering. You can see an example of this in the JWT project [here](https://github.com/bdefore/universal-redux-jwt/blob/master/src/containers/Head/Head.js).

Alternatively, you can specify `html.root` in your configuration and this will be used instead of the default one. If you do take that approach, you'll want to be sure to include the items from `src/server/head.js` and `src/server/body.js`.

#### Webpack Isomorphic Tools configuration

You can add or override the default [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) configuration, by providing a `toolsConfigPath` value to your `config.js`.

### Plugins

Hooks can be used in order to override the default implementation of certain functions. Files that define hooks are called plugins and must be listed in the `plugins` property of `config/universal-redux.config.js`. The plugin paths are resolved as follow:

 - ${project-src}/{path}
 - ${project-root}/node_modules/universal-redux-plugin-{path}
 - ${project-root}/node_modules/{path}

The plugin file should register the implementations of the functions it wants to override as follow:

```js
import { hooks, register } from 'universal-redux/lib/hooks';

register(hooks.client.GENERATE_ROOT_COMPONENT, ( props ) => {
  // Generate the component
  const component = <MyComponent { ...props } />
  return { root: component };
});
```

> If multiple plugins register the same hook, the last plugin to register it takes precedence.

#### client.GENERATE_ROOT_COMPONENT

This hook can be used to override the default rendering of the root component on the client.

##### Arguments

The hook implementation is provided a single `params` object with the following properties
 - **store** - The redux store
 - **routes** - The routes exported by your `routes.js` file
 - **history** - The `react-router` history
 - **devComponent** *(optional)* - A react element for optional dev tools.

##### Return

The hook implementation should return an object (or promise that resolves to an object) with a `root` property that is a react element.

#### server.GENERATE_ROOT_COMPONENT

This hook can be used to override the default rendering of the root component on the server.

##### Arguments

The hook implementation is provided a single `params` object with the following properties
 - **store** - The redux store
 - **renderProps** - The `renderProps` object provided to the callback of the `react-router` match function. It contains all the property needed to render a `Router` component.

##### Return

The hook implementation should return an object (or promise that resolves to an object) with a `root` property that is a react element.

### Scripts

The following npm bin aliases have been defined:

```
universal-redux-watch
universal-redux-server
universal-redux-build
```

You'll generally call these from the corresponding section of your project's scripts. See [`package.json`](https://github.com/bdefore/react-redux-universal-hot-example/blob/example-project/package.json) in the example project.

### What version to use

Peer dependencies for each version:

#### 0.x

[Babel](https://github.com/babel/babel) 5, [Redux Router](https://github.com/acdlite/redux-router)

```
"react": "^0.14.3",
"react-dom": "^0.14.3",
"react-router": "^1.0.0",
"redux-router": "^1.0.0-beta4"
```

#### 1.x

[Babel](https://github.com/babel/babel) 5, [Redux Simple Router](https://github.com/rackt/redux-simple-router)

```
"react": "^0.14.3",
"react-dom": "^0.14.3",
"react-router": "^1.0.0",
"redux-simple-router": "^1.0.1"
```

#### 2.x

[Babel](https://github.com/babel/babel) 6, [Redux Simple Router](https://github.com/rackt/redux-simple-router)

```
"react": "^0.14.3",
"react-dom": "^0.14.3",
"react-router": "^1.0.0",
"redux-simple-router": "^1.0.1"
```

#### 3.x (Beta - dependencies may change)

[Babel](https://github.com/babel/babel) 6, React Router 2, [Redux Simple Router](https://github.com/rackt/redux-simple-router) 2

```
"react": "^0.14.3",
"react-dom": "^0.14.3",
"react-router": "^2.0.0-rc4",
"redux-simple-router": "^2.0.0"
```

### Local development

If you'd like to develop on Universal Redux, clone the repo and while testing with a project that uses it, you can run `PROJECT_PATH=/path/to/project npm run dev` from the Universal Redux root, which will watch for changes and copy them over to your project's `node_modules/universal-redux/lib` directory. If any of your changes add dependencies, you will need to copy those over manually.

### Inspirations

This project forked off of [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example). Please refer to the README there for more details and join the discussion at the [pull request](https://github.com/erikras/react-redux-universal-hot-example/pull/626).
