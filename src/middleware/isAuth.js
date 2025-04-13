import {controllerErrorObj} from '../util/error.js';
import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw controllerErrorObj('Não autenticado.', 401);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw controllerErrorObj('Token inválido.', 401);
  }
  if (!decodedToken) {
    throw controllerErrorObj('Não autenticado.', 401);
  }
  req.userId = decodedToken.userId;
  next();
};

export default isAuth;