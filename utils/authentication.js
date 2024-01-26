const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;


const generateToken = (userId) => {
  const payload = { user_id: userId };
  return jwt.sign(payload, SECRET_KEY,);
};


const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
