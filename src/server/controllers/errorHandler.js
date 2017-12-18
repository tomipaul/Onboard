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
  return (err, req, res, next) => {
    const { sequelize } = models;
    if (err instanceof sequelize.ValidationError) {
      err.code = 422;
    } else {
      err.code = 500;
      err.message = 'Exception 500! Operation failed.';
    }
    return res.status(err.code).json({ error: err.message });
  };
}
