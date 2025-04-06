const errorHelper = require('../util/error');

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw errorHelper.controllerErrorObj('Não autenticado.', 401);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (err) {
    throw errorHelper.controllerErrorObj('Token inválido.', 401);
  }
  if (!decodedToken) {
    throw errorHelper.controllerErrorObj('Não autenticado.', 401);
  }
  req.userId = decodedToken.userId;
  next();
}