export function successResponse(res, data, message, status) {
  // if data is null or undefined
  if (data === null || data === undefined) {
    return res.status(status || 200).json({
      success: true,
      message: message || "No data found",
      data: null
    });
  }

  // if data is an empty array
  if (Array.isArray(data) && data.length === 0) {
    return res.status(status || 200).json({
      success: true,
      message: message || "No records found",
      data: []
    });
  }

  // normal case
  return res.status(status || 200).json({
    success: true,
    message: message || "Success",
    data
  });
}


export function errorResponse(res, message, status, error = null) {
  return res.status(status || 400).json({
    success: false,
    message: message || "Error",
    error: error ? error : undefined 
  });
}
