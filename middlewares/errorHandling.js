const express = require('express');

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || 400,
    msg: err.message || 'Something went wrong, try again',
  };
  if (err.name == 'Validation Error') {
    customError.msg = Object.values(err.errors)
      .map((error) => {
        return error.message;
      })
      .join(',');
    customError.statusCode = 400;
  }
  res.status(customError.statusCode).json(customError.msg);
};

module.exports = errorHandlerMiddleware;
