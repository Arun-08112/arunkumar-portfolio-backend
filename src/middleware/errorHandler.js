export function errorHandler(error, req, res, next) {
  console.error('[API Error]', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
