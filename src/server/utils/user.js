import models from '../models';

const { Op } = models.sequelize;

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

/**
 * Queries the database for a user object
 * @function extractUserInfo
 * @param {object} queryOptions
 * @returns {object} found user object if found or error details
 * if not found
 */
export const getUser = queryOptions =>
  (
    (Object.prototype.hasOwnProperty
      .call(queryOptions, 'id')) ?
      models.User.findById(
        queryOptions.id,
        {
          rejectOnEmpty: true
        }
      ) :
      models.User.findOne({
        where: (queryOptions.userIdentifier) ?
          {
            [Op.or]: [
              { username: queryOptions.userIdentifier },
              { email: queryOptions.userIdentifier }
            ]
          } :
          queryOptions,
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
