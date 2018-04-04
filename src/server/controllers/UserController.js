import models from '../models';
import {
  validator,
} from '../utils/auth';
import {
  getUser,
} from '../utils/user';

/**
 * Get all saved sessions of a user
 * @function getSessions
 * @returns {function} express route handler
 */
export const getSessions = () =>
  (req, res, next) =>
    models.Session.findAll({
      where: {
        userId: req.user.id
      },
      attributes: {
        exclude: ['userId']
      }
    }).then(sessions =>
      res.json({
        sessions
      }))
      .catch(error => next(error));

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

/**
 * Change user password
 * @function changePassword
 * @returns {function} express route handler
 */
export const changePassword = () =>
  (req, res, next) => {
    const updateFields = ['oldPassword', 'newPassword'];
    try {
      validator(updateFields, req.body);
    } catch (error) {
      return next(error);
    }
    const { oldPassword, newPassword } = req.body;
    return getUser({ id: req.user.id })
      .then(user =>
        user.verifyPassword(oldPassword)
          .then((isValid) => {
            if (isValid) {
              return user.update({
                password: newPassword
              }, {
                fields: ['password']
              });
            }
            const error = new Error('Invalid old password');
            throw error;
          })
          .then(() =>
            res.json({
              message: 'Password change succesful'
            })))
      .catch((error) => {
        error.code = 400;
        next(error);
      });
  };
