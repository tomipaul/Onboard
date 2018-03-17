import jwt from 'jsonwebtoken';

/**
 * Generate json web token
 * @function generateToken
 * @param {Object} user User object
 * @param {String} rsaKey PEM encoded RSA private key
 * @param {String} expiresIn a time span e.g '20d', '2h'
 * @returns {Promise.string} promise that fulfills with
 * a json web token or rejects with an error
 */
export const generateToken = (user, rsaKey, expiresIn = '30d') =>
  new Promise((resolve, reject) => {
    const options = {
      expiresIn,
      algorithm: 'RS256',
      issuer: process.env.ISSUER
    };
    const { id, username, email } = user;
    const auth = { id, email, username };
    return jwt.sign(
      auth,
      rsaKey,
      options,
      (error, token) =>
        ((error) ? reject(error) : resolve(token))
    );
  });

/**
 * Verify token's signature and get decoded payload
 * @function verifyToken
 * @param {String} token JSON web token
 * @param {String} rsaKey PEM encoded RSA public key
 * @param {String} maxAge lifespan of token
 * @returns {Promise.object} promise that fulfills with
 * the decoded payload or rejects with an error
 */
export const verifyToken = (token, rsaKey, maxAge = '30d') =>
  new Promise((resolve, reject) => {
    const options = {
      maxAge,
      algorithms: ['RS256'],
      issuer: process.env.ISSUER,
    };
    jwt.verify(
      token,
      rsaKey,
      options,
      (error, decoded) =>
        ((error) ? reject(error) : resolve(decoded))
    );
  });

/**
 * Validate signup request payload
 * @function validateSignupPayload
 * @param {array} enumArray
 * @param {object} payload
 * @returns {undefined}
 */
export const validator = (enumArray, payload) => {
  const error = new Error();
  error.message = {};
  enumArray.forEach((item) => {
    const prop = payload[item];
    if (!prop || /^\s+$/.test(prop)) {
      error.message[item] = `Invalid request, a valid ${item} is required`;
      error.code = 422;
    }
  });
  if (Object.keys(error.message).length) throw error;
};
