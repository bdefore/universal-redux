This is a minimal example of how to use the [Universal Redux](https://github.com/bdefore/universal-redux) npm package with [express-jwt-proxy](https://github.com/bdefore/express-jwt-proxy) to provide JWT authentication with an external API. It is intended to be modular; you can replace either the auth server or API server with the implementation of your choice.

An example is [deployed to Heroku](https://universal-redux-jwt-example.herokuapp.com).

---

## Requirements

- node.JS 4 or higher
- npm 2 or higher
- Redis

## Installation

The following steps will set up your local environment.

#### Install nvm

Installing Node via nvm is recommended. Install [nvm](https://github.com/creationix/nvm) (Node Version Manager) via the [nvm install script](https://github.com/creationix/nvm#install-script).

#### Install node, npm

Use nvm to install the version of node.js. Your package manager, npm, is included with the node installation.

```sh
nvm install 5.2.0
```

#### Install Redis

Redis is used to store authentication tokens. You'll need to install and have this running when developing locally.

```sh
brew install redis
```

#### Install Project Dependencies

Use npm to install all project dependencies listed in [package.json](package.json).

```sh
npm install
```

## Running

#### Configure Environment Variables

```sh
cp .env.example .env
```

Currently you do not need to add any specific variables to `.env` but you may wish to add or modify them when developing against other targets.

#### Start the Redis server

Authentication by default uses Redis to manage its session store. This script will start it up if you haven't already.

```sh
redis-server
```

#### Start the dev, auth, and API servers

```sh
npm run dev
```
