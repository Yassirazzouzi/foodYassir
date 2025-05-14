const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Access denied'
    });
  }

  // General error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

export default errorHandler;