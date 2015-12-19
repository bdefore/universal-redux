import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import Express from 'express';

const authPort = process.env.AUTH_PORT;
const authHost = process.env.AUTH_HOST;
const authSecret = process.env.AUTH_SECRET;

const authApp = new Express();

authApp.use(bodyParser.urlencoded({ extended: false }))
authApp.use(bodyParser.json());
authApp.post('/authenticate', (req, res) => {

  // For the purpose of this example, make a single user
  // to verify email/pass from. In a real setup, you'd
  // look up the requested user by email from a database
  const user = {
    email: 'dummy@user.com',
    password: 'somepassword',
    id: '1234'
  }

  if(req.body.email === user.email && req.body.password === user.password) {
    const token = jwt.sign(user, authSecret, {
      expiresIn: 1440 * 60 // expires in 24 hours
    });

    res.json({
      success: true,
      access_token: token
    });
  } else {
    res.json({
      success: false,
      message: 'Authentication failed. User not found.'
    });
  }

});

authApp.listen(authPort, (err) => {
  if (err) {
    console.error(err);
  }
  console.info(`==> 💻  Authentication server running at ${authHost}:${authPort}`);
})
