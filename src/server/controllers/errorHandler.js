import models from '../models';

/**
 * Handle errors
 * @function errorHandler
 * @return {function} Express error-handling middleware which
 * handles all errors from the endpoints
 */
export default function errorHandler() {
  // error handlers must always take four arguments
  // eslint-disable-next-line
  return (error, req, res, next) => {
    const { sequelize } = models;
    if (!error.code) {
      if (error instanceof sequelize.ValidationError) {
        error.code = 422;
      } else {
        error.code = 500;
        error.message = 'Exception 500! Operation failed.';
      }
    }
    return res.status(error.code).json({ error: error.message });
  };
}
