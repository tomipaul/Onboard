import {
  generateToken,
  verifyToken,
  validateSignupPayload
} from '../utils/auth';
import { extractUserInfo, getUser } from '../utils/user';
import models from '../models';

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
        validateSignupPayload(req.body);
      } catch (error) {
        error.code = 422;
        return next(error);
      }
      const { username, email, password } = req.body;
      return models.User.create({ username, email, password })
        .then((user) => {
          req.user = extractUserInfo(user);
          return next();
        })
        .catch(error => next(error));
    };
  }

  /**
   * Authenticate a user with username and password
   * @method
   * @memberof AuthController
   * @static
   * @return {function} Express middleware function that
   * validates username and password  and sends token to client
   */
  static authenticateUser() {
    return (req, res, next) => {
      const { username, password } = req.body;
      return getUser({ username })
        .then(user =>
          user.verifyPassword(password)
            .then((passwordIsValid) => {
              if (passwordIsValid) {
                const rsaKey = process.env.PRIVATE_KEY;
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
                message: 'Authentication Successful'
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
   * Get token sent in client request
   * @method
   * @memberof AuthController
   * @static
   * @return {function} Express middleware function that gets
   * authorization token from request body, query, header or cookies
   * and passes request to next middleware function.
   */
  static getClientToken() {
    return (req, res, next) => {
      const token = req.get('Authorization') || req.body.token
      || req.cookies.token || req.query.token;
      if (!token) {
        const err = new Error('No Access token provided!');
        err.code = 401;
        return next(err);
      }
      const matched = /^Bearer (\S+)$/.exec(token);
      req.token = (matched) ? matched[1] : token;
      return next();
    };
  }

  /**
   * Verify user token and authorize user to access requested route
   * @method
   * @memberof AuthController
   * @static
   * @return {function} Express middleware function that
   * validates user token and pass request to route handler
   */
  static authorizeUser() {
    return (req, res, next) => {
      const rsaKey = process.env.PUBLIC_KEY;
      return verifyToken(req.token, rsaKey)
        .then((decodedPayload) => {
          const userInfo = extractUserInfo(decodedPayload);
          req.userId = userInfo.id;
          req.username = userInfo.username;
          return next();
        })
        .catch(() => {
          const err = new Error('Invalid token sent in request');
          err.code = 401;
          return next(err);
        });
    };
  }
}

export default AuthController;
