import {
  generateToken,
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
      } catch (err) {
        err.code = 422;
        return next(err);
      }
      const { username, email, password } = req.body;
      return models.User.create({ username, email, password })
        .then((user) => {
          req.user = extractUserInfo(user);
          return next();
        })
        .catch(err => next(err));
    };
  }

  /**
   * Authenticate a user with username and password
   * @method
   * @memberof UserController
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
              error.code = 422;
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
        .catch((err) => {
          if (err.code !== 500) {
            err.code = 401;
            err.message = 'Authentication failed, check provided credentials';
          }
          return next(err);
        });
    };
  }
}

export default AuthController;