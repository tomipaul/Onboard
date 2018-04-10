import sgMail from '@sendgrid/mail';
import {
  generateToken,
  validator,
  verifyToken
} from '../utils/auth';
import { extractUserInfo, getUser } from '../utils/user';
import models from '../models';

const rsaKey = process.env.PRIVATE_KEY;
const rsaKeyPub = process.env.PUBLIC_KEY;

/**
 * @class AuthController
 */
class AuthController {
  /**
   * Create a user
   * @method
   * @memberof AuthController
   * @static
   * @return {function} Express middleware function that creates
   * new user and sends response to client
   */
  static createUser() {
    return (req, res, next) => {
      try {
        const enumArray = ['username', 'email', 'password'];
        validator(enumArray, req.body);
      } catch (error) {
        return next(error);
      }
      const { username, email, password } = req.body;
      return models.User.create({ username, email, password })
        .then(user =>
          generateToken(user, rsaKey)
            .then((token) => {
              const userInfo = extractUserInfo(user);
              return res.status(200).json({
                user: {
                  id: userInfo.id,
                  username: userInfo.username,
                  email: userInfo.email
                },
                token,
                message: 'User created successfully'
              });
            }))
        .catch(error => next(error));
    };
  }

  /**
   * Login a user with valid userIdentifier (username or email) and password
   * @method
   * @memberof AuthController
   * @static
   * @return {function} Express middleware function that
   * validates username and password  and sends token to client
   */
  static loginUser() {
    return (req, res, next) => {
      try {
        const enumArray = ['userIdentifier', 'password'];
        validator(enumArray, req.body);
      } catch (error) {
        return next(error);
      }
      const { userIdentifier, password } = req.body;
      return getUser({ userIdentifier })
        .then(user =>
          user.verifyPassword(password)
            .then((passwordIsValid) => {
              if (passwordIsValid) {
                return generateToken(user, rsaKey);
              }
              const error = new Error('Invalid Password');
              throw error;
            })
            .then((token) => {
              const userInfo = extractUserInfo(user);
              return res.status(200).json({
                user: {
                  id: userInfo.id,
                  username: userInfo.username,
                  email: userInfo.email
                },
                token,
                message: 'Login Successful'
              });
            }))
        .catch((error) => {
          if (!error.code) {
            error.code = 401;
          }
          if (!error.message) {
            error.message = 'Authentication failed, check provided credentials';
          }
          return next(error);
        });
    };
  }

  /**
   * Authenticates user token
   * @method
   * @memberof AuthController
   * @static
   * @return {function} Express middleware function that calls the
   * next method after authentication has been completed
   */
  static isAuthenticated() {
    return (req, res, next) => {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        const err = new Error('Authorization Header not provided!');
        err.code = 401;
        return next(err);
      }

      const [input, token] = /^Bearer (\S+)$/.exec(authHeader) || [authHeader];
      if (token && input.startsWith('Bearer')) {
        return verifyToken(token, rsaKeyPub)
          .then((user) => {
            req.user = user;
            return next();
          })
          .catch((error) => {
            error.message = 'Invalid token sent in request';
            error.code = 401;
            return next(error);
          });
      }
      const error = new Error();
      error.message = 'Invalid signature in authorization header!';
      error.code = 403;
      return next(error);
    };
  }

  /**
   * Authenticates user token
   * @method
   * @memberof AuthController
   * @static
   * @return {function} Express middleware function that calls the
   * next method after authentication has been completed
   */
  static forgotPassword() {
    return (req, res, next) => {
      try {
        const enumArray = ['email'];
        validator(enumArray, req.body);
      } catch (error) {
        return next(error);
      }

      return getUser({ email: req.body.email })
        .then(user => generateToken(user, rsaKey))
        .then((token) => {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: req.body.email,
            from: 'onboard.noreply@gmail.com',
            subject: 'Onboard - Reset Password',
            text: 'Click to reset email',
            html: `<a href="${req.headers.origin}/password/reset/?tok=${token}">Click here</a>`,
          };
          sgMail.send(msg, (error) => {
            if (error) {
              error.message = 'Mail sending failed!';
              error.code = 401;
              return next(error);
            }
            return res.status(200).json({
              message: 'Successful. Check your mail for link to reset passowrd!'
            });
          });
        })
        .catch((error) => {
          error.message = 'Account with this email does not exist';
          return next(error);
        });
    };
  }
}

export default AuthController;
