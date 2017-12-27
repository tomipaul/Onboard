import models from '../models';

/**
 * Extract user properties from object
 * @function extractUserInfo
 * @param {object} userObject
 * @returns {object} object with user id, username, email and password
 */
export const extractUserInfo = (userObject) => {
  const {
    id,
    username,
    email
  } = userObject;
  return {
    id,
    username,
    email
  };
};

export const getUser = searchOptions =>
  (
    (Object.prototype.hasOwnProperty
      .call(searchOptions, 'id')) ?
      models.User.findById(
        searchOptions.id,
        {
          rejectOnEmpty: true
        }
      ) :
      models.User.findOne({
        where: searchOptions,
        rejectOnEmpty: true
      })
  )
    .then(user => user)
    .catch((error) => {
      const finalError = (
        error instanceof models.sequelize.EmptyResultError
      ) ?
        (error.code = 404, error.message = 'User not found', error) :
        (error.code = 500, error.message = 'Something went wrong', error);
      throw finalError;
    });

