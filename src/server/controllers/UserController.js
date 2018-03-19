import models from '../models';
import { validator } from '../utils/auth';

/**
 * Save a user's session
 * @function saveSession
 * @returns {function} express route handler
 */
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

/**
 * Modify a user's profile
 * @function  modifyProfile
 * @returns {function} express route handler
 */
export const modifyProfile = () =>
  (req, res, next) => {
    const fields = Object.keys(req.body);
    const updateFields = ['username', 'email']
      .filter(field => fields.includes(field));
    if (!updateFields.length) {
      const error = new Error('Invalid request, no valid fields');
      error.code = 400;
      throw error;
    }
    try {
      validator(updateFields, req.body);
    } catch (error) {
      return next(error);
    }
    return models.User.update(req.body, {
      where: {
        id: req.user.id
      },
      fields: updateFields
    })
      .then(() =>
        res.json({
          message: 'User Profile modified successfully',
          user: req.body
        }))
      .catch((err) => {
        err.code = 400;
        next(err);
      });
  };

