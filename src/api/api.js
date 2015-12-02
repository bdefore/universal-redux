import http from 'http';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import {mapUrl} from './utils/url.js';
import PrettyError from 'pretty-error';

const path = require('path');
const config = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));
const apiPrefix = config.apiPrefix || 'api';

// resolve requires that rely on settings from external configuration
const actions = require(path.resolve(config.webpack.resolve.alias.actions));

const pretty = new PrettyError();
const app = express();

const server = new http.Server(app);

app.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(bodyParser.json());

app.use((req, res) => {

  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);

  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});

const runnable = app.listen(config.apiPort, (err) => {
  if (err) {
    console.error(err);
  }
  console.info('----\n==> 🌎  API is running. Send requests to:', 'http://' + config.apiHost + ':' + config.apiPort + '/' + apiPrefix);
});

if (config.socket && config.socket.enabled) {
  import SocketIo from 'socket.io';

  const bufferSize = 100;
  const messageBuffer = new Array(bufferSize);
  let messageIndex = 0;

  const io = new SocketIo(server);
  io.path('/ws');

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`});

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);
}
