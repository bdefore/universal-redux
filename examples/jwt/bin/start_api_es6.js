import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import Express from 'express';
import authConfig from '../config/express-jwt-proxy.config.js';

const authSecret = process.env.AUTH_SECRET;

const apiApp = new Express();

apiApp.use(`${authConfig.api.endpoint}/authenticated_request`, bodyParser.json());
apiApp.get(`${authConfig.api.endpoint}/authenticated_request`, (req, res) => {

  const authorizationHeader = req.headers['authorization'];

  // decode token
  if (authorizationHeader) {
    const token = authorizationHeader.split('Bearer ')[1];

    // verifies secret and checks exp
    jwt.verify(token, authSecret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        return res.json({
          success: true,
          message: 'You are receiving this message from the API server because it confirmed that you are authenticated.'
        });
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).json({ 
      success: false, 
      message: 'No token provided.'
    });
  }  
});

apiApp.listen(authConfig.api.port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info(`==> 💻  API server running at ${authConfig.api.host}:${authConfig.api.port}${authConfig.api.endpoint}`);
})
