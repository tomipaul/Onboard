import models from '../models';
import {
  validator,
} from '../utils/auth';

export const saveSession = () =>
  (req, res) => {
    const { name, moduleId, challengeId } = req.body;
    const payload = {
      name,
      moduleId,
      challengeId,
      userId: req.userId
    };
    return models.Session.create(payload)
      .then((session) => {
        res.status(200).json({
          message: 'Session saved successfully',
          session
        });
      });
  };

/**
   * Resets a users password
   * @method
   * @return {function} Function handling updating of password
   */
export const resetPassword = () =>
  (req, res, next) => {
    try {
      const enumArray = ['newPassword'];
      validator(enumArray, req.body);
    } catch (error) {
      return next(error);
    }

    const { email } = req.user;
    return models.User.update({
      password: req.body.newPassword
    }, {
      where: {
        email
      }
    }).then(() => res.status(200)
      .json({ message: 'Password change succesful' }))
      .catch(error => next(error));
  };

export default saveSession;
