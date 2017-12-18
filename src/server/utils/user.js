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
    .catch((err) => {
      const error = (err instanceof models.sequelize.EmptyResultError) ?
        (err.code = 404, err.message = 'User not found', err) :
        (err.code = 500, err.message = 'Something went wrong', err);
      throw error;
    });

