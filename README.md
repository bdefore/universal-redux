# Redux Universal Renderer

[![build status](https://img.shields.io/travis/bdefore/redux-universal-renderer/master.svg?style=flat-square)](https://travis-ci.org/bdefore/redux-universal-renderer)
[![Dependency Status](https://david-dm.org/bdefore/redux-universal-renderer.svg?style=flat-square)](https://david-dm.org/bdefore/redux-universal-renderer)
[![devDependency Status](https://david-dm.org/bdefore/redux-universal-renderer/dev-status.svg?style=flat-square)](https://david-dm.org/bdefore/redux-universal-renderer#info=devDependencies)
[![Demo on Heroku](https://img.shields.io/badge/demo-heroku-brightgreen.svg?style=flat-square)](https://redux-universal-renderer.herokuapp.com)

### Why?

This project forked off of [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example) with the goal of making an npm module for an easier starting point for new projects. Please refer to the README there for more details and join the discussion at the pull request here: https://github.com/erikras/react-redux-universal-hot-example/pull/626, and please open an issue if you find one.

### Usage

An example project has been made here: https://github.com/bdefore/react-redux-universal-hot-example/tree/example-project and is deployed on Heroku here: https://redux-universal-renderer.herokuapp.com

- Install

```
npm install redux-universal-renderer
```

- Add a `webpack` object in `config/redux-universal-renderer.config.js` that defines what properties you want to override during the build step. You can start by copying the [annotated example](https://github.com/bdefore/redux-universal-renderer/blob/master/config/redux-universal-renderer.config.js) to your project directory.

- Specify your build steps 

The following npm bin aliases have been defined:

```
redux-universal-renderer-watch
redux-universal-renderer-server
redux-universal-renderer-api
redux-universal-renderer-build
```

You'll generally call these from the corresponding section of your project's scripts. See `package.json` in the example project: https://github.com/bdefore/react-redux-universal-hot-example/blob/example-project/package.json#L39

### Adding new functionality

The npm module also exposes a few methods for adding additional functionality.

#### Express middleware

You can add your own Express middleware like so:

```
import renderer from 'redux-universal-renderer';
import config from '../config/redux-universal-renderer.config.js';

const app = renderer.app();

// add some middleware
// add some more middleware

renderer.setup(config);
renderer.start();
```

#### Replacing the Html.js shell

Inside of your `config.webpack.resolve.alias` array, you can specify `html: sourceRoot + '/path/to/your/Html.js'` and this will be used instead of the default one. This allows you to add your own additions to `<head>` as well as third party `<script>` tags such as for metrics tracking.

#### Webpack Isomorphic Tools configuration

You can add or override the default [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) configuration, by providing a `toolsConfigPath` value to your `config.js`.

### Local development

If you'd like to modify the renderer while running a project that uses it, I've found that npm version 2 tends to cause issues including multiple versions of React, which cause script errors, if you symlink or drop it into your project's `node_modules` manually. You may prefer to use `PROJECT_PATH=/path/to/project npm run dev` from the renderer root, which will watch for changes and copy them over to your project's `node_modules/redux-universal-renderer/lib` directory.

### Known Issues

- Reducers are not hot reloading correctly.
- An extra resolve exists for `node_modules/redux-universal-test/node_modules`. This may not be a correct assumption.
- Extending the functionality of `src/client` is currently difficult without forking.
