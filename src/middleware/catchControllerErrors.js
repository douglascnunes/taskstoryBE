const catchControllerErrors = (error, req, res, next) => {
  console.log(error);
  const message = error.message || 'Erro interno no servidor';
  const status = error.statusCode || 500;
  const data = error.data || "Erro não identificado";
  res.status(status).json({ message: message, data: data });
};

export default catchControllerErrors;