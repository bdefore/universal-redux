# Universal Redux

[![npm version](https://badge.fury.io/js/universal-redux.svg)](https://badge.fury.io/js/universal-redux)
[![build status](https://img.shields.io/travis/bdefore/universal-redux/master.svg?style=flat-square)](https://travis-ci.org/bdefore/universal-redux)
[![Dependency Status](https://david-dm.org/bdefore/universal-redux.svg?style=flat-square)](https://david-dm.org/bdefore/universal-redux)
[![devDependency Status](https://david-dm.org/bdefore/universal-redux/dev-status.svg?style=flat-square)](https://david-dm.org/bdefore/universal-redux#info=devDependencies)
[![Demo on Heroku](https://img.shields.io/badge/demo-heroku-brightgreen.svg?style=flat-square)](https://universal-redux.herokuapp.com)

With the default configuration, Universal Redux provides routing with [React Router](https://github.com/rackt/react-router) as well as a hot-reloading development server. Fonts and styles (SASS, Less, CSS) are also ready to go.

### Usage

- Requirements

Node.JS > 4.1.1 and npm > 3 are strongly recommended. If you are using npm 2, note that you may need to add additional dependencies yourself. If you are using `redux-router`, you must stay with version `^0`, otherwise if you are using `redux-simple-router` version `^1`.

- Install

```
npm install universal-redux
```

- Add a configuration file in your project at `config/universal-redux.config.js` that defines what properties you want to customize. You can start by copying the [annotated example](https://github.com/bdefore/universal-redux/blob/master/config/universal-redux.config.js).

- Specify your build steps 

The following npm bin aliases have been defined:

```
universal-redux-dev
universal-redux-watch
universal-redux-server
universal-redux-build
```

You'll generally call these from the corresponding section of your project's scripts. See [`package.json`](https://github.com/bdefore/react-redux-universal-hot-example/blob/example-project/package.json) in the example project.

- Create a routes file

Generally kept in `src/routes.js`, this is where you define what routes map to what views. See [`routes.js`](https://github.com/bdefore/react-redux-universal-hot-example/blob/example-project/src/routes.js) in the example project.

- Make some code!

### Examples

- [A minimal example to get started](https://github.com/bartolkaruza/universal-redux-simple-example)
- [An example with JWT authentication](https://github.com/bdefore/universal-redux/tree/0.x/examples/jwt) ([Heroku demo](https://universal-redux-jwt-example.herokuapp.com))
- [A refactor of react-redux-universal-hot-example with universal-redux and redux-simple-router](https://github.com/bdefore/react-redux-universal-hot-example/tree/example-project-simple-router) ([Heroku demo](https://universal-redux.herokuapp.com))

### Customization

The npm module also exposes a few ways of integrating your code with that of the module.

#### Webpack configuration

Any items specified in the `webpack.config` of your configuration will be merged with the [default Webpack configuration](https://github.com/bdefore/universal-redux/blob/master/config/webpack.config.js). You may also turn on `verbose` mode to see the exact Webpack configuration you are running.

#### Express middleware

You can add your own Express middleware like so:

```javascript
import universal from 'universal-redux';
import config from '../config/universal-redux.config.js';

const app = universal.app();

// add some middleware
// add some more middleware

universal.setup(config);
universal.start();
```

Alternatively, you may pass your own Express instance as a parameter when calling `universal.app()`.

#### Redux middleware

You can activate your own Redux middleware by specifying the `middleware` property in the configuration file. This must be a path to a file which exports each middleware as a function. On serverside renders, those functions will be called with two parameters: the Express request and response objects. On clientside renders, they will be called with none. All properties specified in `globals` will be available to the middleware.

#### Replacing the HTML shell

You can specify `htmlShell: '/path/to/your/Html.js'` in your configuration and this will be used instead of the default one. This allows you to add your own additions to `<head>` as well as third party `<script>` tags such as for metrics tracking.

#### Webpack Isomorphic Tools configuration

You can add or override the default [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) configuration, by providing a `toolsConfigPath` value to your `config.js`.

### Local development

If you'd like to develop on Universal Redux, clone the repo and while testing with a project that uses it, you can run `PROJECT_PATH=/path/to/project npm run dev` from the Universal Redux root, which will watch for changes and copy them over to your project's `node_modules/universal-redux/lib` directory. If any of your changes add dependencies, you will need to copy those over manually.

### Todo

- [x] Pass in your own Express app instance
- [x] Configurable custom Redux middleware
- [x] Review dependencies, move applicable ones to devDependencies
- [x] Review adding additional peerDependencies
- [x] Example with JWT authentication
- [ ] Finalize API before 1.0
- [ ] Add CHANGELOG
- [ ] npm2 instructions
- [ ] Hot reloadable redux modules (see https://github.com/bdefore/universal-redux/issues/7)

### Inspirations

This project forked off of [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example). Please refer to the README there for more details and join the discussion at the [pull request](https://github.com/erikras/react-redux-universal-hot-example/pull/626).
