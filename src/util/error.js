export const controllerErrorObj = (message, statusCode = null, errors = null) => {
  const error = new Error(message);
  if (statusCode) { error.statusCode = statusCode; }
  if (errors) { error.data = errors.array(); }
  return error;
};
